<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CUSTOMER_FORM_TYPE, CUSTOMER_PAGE, SCHEDULE_WEEK_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
    import Customer from '../../Class/Customer.svelte';
    import Contact from '../../Class/Contact.svelte';
    import Schedule from '../../Class/Schedule.svelte';
    
    import Item from './Item.svelte';
    import ItemSchedule from '../Schedule/Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    let oTarget: any = $state(Customer.oPlaceholder),
        bIsCustomerView: boolean = $derived( oTarget instanceof Customer ),
        oCustomerView: Customer = $derived( bIsCustomerView ? oTarget : oTarget.oIsExtraOf ),
        oContactView: Contact = $derived( bIsCustomerView ? oTarget.oMainContact : oTarget ),
        oFormEdit = $derived( { oCustomer: oCustomerView, oContact: oContactView } ),
        aCustomerSchedules: Schedule[] = $derived( bIsCustomerView ?
            Object.values( Schedule.getAll() )
                .filter( oSchedule => oSchedule.oCustomer === oCustomerView )
                .sort( (oA, oB) => oA.nDay - oB.nDay || oA.nTimeStart - oB.nTimeStart )
            : []
        );

    export function open(oNewTarget: Customer | Contact) {
        oTarget = oNewTarget;
        App.oPage.open(CUSTOMER_PAGE.VIEW, true);
    }

    /* ---- Modal */
    let bOpenModal: boolean = $state(false),
        sHTMLInfos: string = $derived.by( () => {
            
            let aInfos: string[] = ['<b>' + oContactView.sName + '</b>'],
                sInfo: string = '';

            if( bIsCustomerView ){
                if( oCustomerView.aExtraContacts.length ){
                    aInfos.push('ses <u>contacts supplémentaires</u>');
                }
                if( aCustomerSchedules.length ){
                    aInfos.push('ses <u>planifications</u>');
                }
            }

            if( aInfos.length > 1 ){
                sInfo = <string>aInfos.pop();
                sInfo = aInfos.join(', ') + ' et ' + sInfo;
            } else {
                sInfo = aInfos[0];
            }

            return sInfo;
        } );

    function openModal(): void {
        bOpenModal = true;
    }

    function closeModal(): void {
        bOpenModal = false;
    }

    function remove(): void {
        // Schedule
        aCustomerSchedules.forEach( oSchedule => oSchedule.destroy() );

        // Customer / Contact
        oTarget.destroy();
        oTarget = Customer.oPlaceholder;

        // Close
        closeModal();
        App.oPage.back();
    }

    /* ---- Template */
    /* -- Title */
    const oTitle = $derived.by( () => {
        return {
            sTitle: oContactView.sName,
            sSubTitle : bIsCustomerView ?
                `<span class="bulma-icon-text">
                    <span class="bulma-icon">
                        <i class="fa-solid ${ oCustomerView.bEnable ? 'fa-user-tie' : 'fa-user-slash' }"></i>
                    </span>
                    <span>Client principal</span>
                </span>` :
                `<span class="bulma-icon-text">
                    <span class="bulma-icon">
                        <i class="fa-solid ${ oCustomerView.bEnable ? 'fa-user-group' : 'fa-users-slash' } fa-sm"></i>
                    </span>
                    <span>Contact supplémentaire</span>
                </span>`
        };
    } );
    
    /* -- Navbar */
    const oNavbar = {
        oBack: {
            sTitle: 'Retourner à la page précédente',
            sIcon: 'fa-chevron-left',
            sText: 'Retour',
            click: App.oPage.back
        },
        aButtons: [
            {
                sTitle: 'Modifier le client',
                sIcon: 'fa-user-pen',
                sText: 'Modifier',
                click: () => Pages.oForm.open(CUSTOMER_FORM_TYPE.MODIFY_CONTACT, oFormEdit)
            }
        ]
    };

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oTarget).with(console.trace);
        // $inspect(oFormEdit).with(console.trace);
        // $inspect(oContactView).with(console.trace);
    }
</script>

<section class="fox-app-page">

    <!-- Page Title -->
    <Title Item={oTitle} />

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">

            <address class="bulma-block">
                {@html '<p>' + oContactView.getAddress().join('</p><p>') + '</p>'}
            </address>

            {#if oContactView.sInformations || !oCustomerView.bEnable || oContactView.bHasKey}
                <div class="bulma-block">
                    {#if oContactView.sInformations}
                        <div class="bulma-content bulma-is-small bulma-mb-2">
                            <blockquote>{oContactView.sInformations}</blockquote>
                        </div>
                    {/if}
                    {#if !oCustomerView.bEnable}
                        <span class="fox-customer-disable bulma-tag bulma-is-danger bulma-is-light bulma-icon-text">
                            <span class="bulma-icon bulma-is-small">
                                <i class="fa-solid fa-user-slash"></i>
                            </span>
                            <span>Désactivé</span>
                        </span>
                    {/if}
                    {#if oContactView.bHasKey}
                        <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon-text">
                            <span class="bulma-icon bulma-is-small">
                                <i class="fa-solid fa-key"></i>
                            </span>
                            <span>Je possède un double des clefs</span>
                        </span>
                    {/if}
                </div>
            {/if}
            
            <div class="bulma-mb-6">
                <div class="bulma-field bulma-is-grouped bulma-is-grouped-right bulma-is-flex-wrap-wrap">
                    <div class="bulma-buttons bulma-has-addons bulma-m-0">
                        <a class="bulma-button bulma-is-hovered" target="_blank" href="https://maps.google.com/?q={oContactView.sMapsQuery}">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-location-dot"></i>
                            </span>
                            <span>Maps</span>
                        </a>
                        {#if oContactView.getMobilePhoneNumbers().length}
                        <a class="bulma-button bulma-is-hovered" href="sms:{oContactView.getMobilePhoneNumbers()[0]}">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-message"></i>
                            </span>
                            <span>SMS</span>
                        </a>
                        {/if}
                        <a class="bulma-button bulma-is-hovered" href="tel:{oContactView.aPhoneNumbers[0]}">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-phone"></i>
                            </span>
                            <span>Appel</span>
                        </a>
                    </div>
                    {#if bIsCustomerView}
                        {#if oCustomerView.bEnable}
                            <button class="bulma-button" onclick={() => oCustomerView.changeEnable(false)}>
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-user-slash"></i>
                                </span>
                                <span>Désactiver</span>
                            </button>
                        {:else}
                            <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={openModal}>
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-user-xmark"></i>
                                </span>
                                <span>Supprimer</span>
                            </button>
                            <button class="bulma-button" onclick={() => oCustomerView.changeEnable(true)}>
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-user-tie"></i>
                                </span>
                                <span>Activer</span>
                            </button>
                        {/if}
                    {:else}
                        <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={openModal}>
                            <span class="bulma-icon">
                                <i class="fa-solid fa-user-xmark"></i>
                            </span>
                            <span>Supprimer</span>
                        </button>
                    {/if}
                </div>
            </div>

            {#if bIsCustomerView}

                {#if aCustomerSchedules.length}
                    <div class="bulma-block">
                        <div class="fox-separator">
                            <span>Planifications</span>
                        </div>
                        {#each aCustomerSchedules as oSchedule}
                            <ItemSchedule sType="simple" Item={{ oTarget: oSchedule }}/>
                        {/each}
                    </div>
                {/if}

                <div class="bulma-block">
                    <div class="fox-separator">
                        <span>Contacts supplémentaires</span>
                    </div>
                    {#each oCustomerView.aExtraContacts as oContact}
                        <Item Item={{ bEnable: oCustomerView.bEnable, oTarget: oContact, click: () => open(oContact) }}/>
                    {:else}
                        <div class="bulma-notification bulma-has-text-centered bulma-is-size-7">
                            <span class="bulma-icon-text bulma-is-small">
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-users-slash fa-lg"></i>
                                </span>
                                <span>Aucun contact supplémentaire</span>
                            </span>
                        </div>
                    {/each}
                    <div class="bulma-has-text-right bulma-mt-5">
                        <button class="bulma-button bulma-is-hovered" onclick="{ () => Pages.oForm.open(CUSTOMER_FORM_TYPE.NEW_CONTACT, { oCustomer: oCustomerView }) }">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-user-plus"></i>
                            </span>
                            <span>Ajouter</span>
                        </button>
                    </div>
                </div>
                
            {:else}
                <div class="bulma-block">
                    <div class="fox-separator">
                        <span>Client principal</span>
                    </div>
                    <Item Item={{ bEnable: oCustomerView.bEnable, oTarget: oCustomerView, click: () => open(oCustomerView) }}/>
                </div>
            {/if}
        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar} />

    <!-- Modal -->
    <aside class="bulma-modal bulma-is-justify-content-flex-end { bOpenModal ? 'bulma-is-active' : '' }" >
        <div class="bulma-modal-background"></div>
        <div class="bulma-modal-content">
            <div class="bulma-box bulma-p-5">
                <p class="bulma-block">
                    Es-tu sûr de vouloir supprimer {@html sHTMLInfos}&nbsp;?
                </p>
                <div class="bulma-field bulma-is-grouped bulma-is-grouped-right">
                    <button class="bulma-button" onclick={closeModal}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-xmark"></i>
                        </span>
                        <span>Annuler</span>
                    </button>
                    <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={remove}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-xmark"></i>
                        </span>
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        </div>
    </aside>
</section>

<style>
</style>