<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CUSTOMER_FORM_TYPE, CUSTOMER_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';
    import Customer from '../../Class/Customer.svelte';
    import Contact from '../../Class/Contact.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    let oTarget: any = $state(Customer.oPlaceholder),
        bIsCustomerView: boolean = $derived( oTarget instanceof Customer ),
        oCustomerView: Customer = $derived( bIsCustomerView ? oTarget : oTarget.oIsExtraOf ),
        oContactView: Contact = $derived( bIsCustomerView ? oTarget.oMainContact : oTarget ),
        oFormEdit = $derived( { oCustomer: oCustomerView, oContact: oContactView } );

    export function open(oNewTarget: Customer | Contact) {
        oTarget = oNewTarget;
        App.oPage.open(CUSTOMER_PAGE.VIEW, true);
    }

    /* ---- Modal */
    let bOpenModal: boolean = $state(false);
    function openModal(): void {
        bOpenModal = true;
    }

    function closeModal(): void {
        bOpenModal = false;
    }

    function remove(): void {
        closeModal();
        oTarget.destroy();
        oTarget = Customer.oPlaceholder;
        App.oPage.back();
    }

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oTarget).with(console.trace);
        // $inspect(oFormEdit).with(console.trace);
        // $inspect(oContactView).with(console.trace);
    }
</script>

<section class="fox-app-page">
    <!-- Page Content -->
    <div class="fox-app-page-content">

        <header class="bulma-hero">
            <div class="bulma-hero-body">
                <div class="bulma-container bulma-is-max-tablet">
                    <div class="bulma-block">
                        <h1 class="bulma-title fox-is-text-ellipsis">{oContactView.sName}</h1>
                        <h2 class="bulma-subtitle">
                            {#if bIsCustomerView}
                                <span class="bulma-icon-text">
                                    <span class="bulma-icon">
                                        <i class="fa-solid fa-user-tie"></i>
                                    </span>
                                    <span>Client principal</span>
                                </span>
                            {:else}
                                <span class="bulma-icon-text">
                                    <span class="bulma-icon">
                                        <i class="fa-solid fa-user-group"></i>
                                    </span>
                                    <span>Contact supplémentaire</span>
                                </span>
                            {/if}
                        </h2>
                    </div>
                    <address class="bulma-block">
                        {@html '<p>' + oContactView.getAddress().join('</p><p>') + '</p>'}
                    </address>
                    {#if oContactView.bHasKey || oContactView.sInformations}
                        <div class="bulma-block">
                            {#if oContactView.sInformations}
                                <div class="bulma-content bulma-is-small bulma-mb-2">
                                    <blockquote>{oContactView.sInformations}</blockquote>
                                </div>
                            {/if}
                            {#if oContactView.bHasKey}
                                <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon-text bulma-mb-2">
                                    <span class="bulma-icon">
                                        <i class="fa-solid fa-key"></i>
                                    </span>
                                    <span>Je possède un double des clefs</span>
                                </span>
                            {/if}
                        </div>
                    {/if}
                    <div class="bulma-field bulma-is-grouped bulma-is-grouped-right">
                        <a class="bulma-button bulma-is-hovered" href="tel:{oContactView.aPhoneNumbers[0]}">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-phone"></i>
                            </span>
                            <span>Appel</span>
                        </a>
                        {#if oContactView.getMobilePhoneNumbers().length}
                            <a class="bulma-button bulma-is-hovered" href="sms:{oContactView.getMobilePhoneNumbers()[0]}">
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-message"></i>
                                </span>
                                <span>SMS</span>
                            </a>
                        {/if}
                        <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={openModal}>
                            <span class="bulma-icon">
                                <i class="fa-solid fa-user-xmark"></i>
                            </span>
                            <span>Supprimer</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <section class="bulma-section">
            <div class="bulma-container bulma-is-max-tablet">
                {#if bIsCustomerView}
                    <div class="fox-separator">
                        <span>Contacts supplémentaires</span>
                    </div>
                    {#each oCustomerView.aExtraContacts as oContact}
                        <article class="fox-customer-list-item">
                            <button class="bulma-box" onclick={ () => open(oContact) }>
                                {#if oContact.bHasKey}
                                    <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon">
                                        <i class="fa-solid fa-key"></i>
                                    </span>
                                {/if}
                                <span class="bulma-icon-text">
                                    <span class="bulma-icon">
                                        <i class="fa-solid fa-user-group fa-xl"></i>
                                    </span>
                                    <span class="bulma-ml-3">{oContact.sName}</span>
                                </span>
                            </button>
                        </article>
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
                {:else}
                    <div class="fox-separator">
                        <span>Client principal</span>
                    </div>
                    <article class="fox-customer-list-item">
                        <button class="bulma-box" onclick={ () => open(oCustomerView) }>
                            {#if oCustomerView.hasMainKey()}
                                <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon">
                                    <i class="fa-solid fa-key"></i>
                                </span>
                            {/if}
                            <span class="bulma-icon-text">
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-user-tie fa-xl"></i>
                                </span>
                                <span class="bulma-ml-3">{oCustomerView.sName}</span>
                            </span>
                            </button>
                    </article>
                {/if}
            </div>
        </section>

    </div>

    <!-- Navbar -->
    <nav class="fox-app-page-navbar bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button bulma-is-hovered" onclick={App.oPage.back} >
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-left"></i>
                    </span>
                    <span>Retour</span>
                </button>
            </div>
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button" onclick="{ () => Pages.oForm.open(CUSTOMER_FORM_TYPE.MODIFY_CONTACT, oFormEdit) }">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-user-pen"></i>
                    </span>
                    <span>Modifier</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Modal -->
    <aside class="bulma-modal bulma-is-justify-content-flex-end { bOpenModal ? 'bulma-is-active' : '' }" >
        <div class="bulma-modal-background"></div>
        <div class="bulma-modal-content">
            <div class="bulma-box bulma-p-5">
                <p class="bulma-block">
                    Es-tu sûr de vouloir supprimer <b>{oContactView.sName}</b>
                    {#if bIsCustomerView}
                        et ses contacts supplémentaires
                    {/if}&nbsp;?
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