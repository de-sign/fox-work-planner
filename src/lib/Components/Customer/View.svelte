<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CUSTOMER_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';
    import Customer from '../../Class/Customer.svelte';

    /* ---- Component */
    let {
        oTarget,

        Pages_openView,
        Pages_deleteView,
        Pages_closeView,
        Pages_openForm
    } = $props();

    const bIsCustomerView = $derived( oTarget instanceof Customer ),
        oCustomerView = $derived( bIsCustomerView ? oTarget : oTarget.oIsExtraOf ),
        oContactView = $derived( bIsCustomerView ? oTarget.oMainContact : oTarget ),
        oFormEdit = $derived( { oCustomer: oCustomerView, oContact: oContactView } );

    /* ---- Modal */
    let hModal: HTMLElement | null = $state(null);
    function openModal() {
        hModal?.classList.add('bulma-is-active');
    }

    function closeModal(bConfirm = false) {
        if( bConfirm ){
            Pages_deleteView();
        }
        hModal?.classList.remove('bulma-is-active');
    }

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oTarget).with(console.trace);
        // $inspect(oFormEdit).with(console.trace);
        // $inspect(oContactView).with(console.trace);
    }

    /* Contact - Instance Properties
        private _nId: number = 0;
        public sFirstName: string = '';
        public sLastName: string = '';
        public sAddress: string = '';
        public sAddressSupplement: string | undefined;
        public sPostalCode: string = '';
        public sCity: string = '';
        public aPhoneNumbers: string[] = [];
        public sInformations: string | undefined;
        public bHasKey: boolean = false;
    */
</script>

<section class="fox-app-page">
    <!-- Page Content -->
    <div class="fox-app-page-content">

        <header class="bulma-hero">
            <div class="bulma-hero-body">
                <div class="bulma-container bulma-is-max-tablet">
                    <div class="bulma-block">
                        <div class="bulma-block">
                            <h1 class="bulma-title fox-is-text-ellipsis">{oContactView.getName()}</h1>
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
                                    <span class="bulma-tag bulma-is-info bulma-is-light bulma-icon-text bulma-mb-2">
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
                            <button class="bulma-box" onclick={ () => Pages_openView(oContact, true) }>
                                {#if oContact.bHasKey}
                                    <span class="bulma-tag bulma-is-info bulma-is-light bulma-icon">
                                        <i class="fa-solid fa-key"></i>
                                    </span>
                                {/if}
                                <span class="bulma-icon-text">
                                    <span class="bulma-icon">
                                        <i class="fa-solid fa-user-group fa-xl"></i>
                                    </span>
                                    <span class="bulma-ml-3">{oContact.getName()}</span>
                                </span>
                            </button>
                        </article>
                    {:else}
                        <div class="bulma-block bulma-content bulma-is-small">
                            <blockquote>
                                <i class="bulma-text-icon">
                                    <span class="bulma-icon">
                                        <i class="fa-solid fa-users-slash fa-lg"></i>
                                    </span>
                                    <span>Aucun contact supplémentaire</span>
                                </i>
                            </blockquote>
                        </div>
                    {/each}
                    <div class="bulma-has-text-right bulma-mt-5">
                        <button class="bulma-button bulma-is-hovered" onclick="{ () => Pages_openForm(CUSTOMER_FORM_TYPE.NEW_CONTACT, { oCustomer: oCustomerView }) }">
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
                        <button class="bulma-box" onclick={ () => Pages_openView(oCustomerView, true) }>
                            {#if oCustomerView.hasMainKey()}
                                <span class="bulma-tag bulma-is-info bulma-is-light bulma-icon">
                                    <i class="fa-solid fa-key"></i>
                                </span>
                            {/if}
                            <span class="bulma-icon-text">
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-user-tie fa-xl"></i>
                                </span>
                                <span class="bulma-ml-3">{oCustomerView.getMainName()}</span>
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
                <button class="bulma-button bulma-is-hovered" onclick={Pages_closeView} >
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-left"></i>
                    </span>
                    <span>Retour</span>
                </button>
            </div>
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button" onclick="{ () => Pages_openForm(CUSTOMER_FORM_TYPE.MODIFY_CONTACT, oFormEdit) }">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-user-pen"></i>
                    </span>
                    <span>Modifier</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Modal -->
    <aside class="bulma-modal bulma-is-justify-content-flex-end" bind:this={hModal} >
        <div class="bulma-modal-background"></div>
        <div class="bulma-modal-content">
            <div class="bulma-box bulma-p-5">
                <p class="bulma-block">
                    Es-tu sûr de vouloir supprimer <b>{oContactView.getName()}</b>
                    {#if bIsCustomerView}
                        et ses contacts supplémentaires
                    {/if}&nbsp;?
                </p>
                <div class="bulma-field bulma-is-grouped bulma-is-grouped-right">
                    <button class="bulma-button" onclick={ () => closeModal(false) }>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-xmark"></i>
                        </span>
                        <span>Annuler</span>
                    </button>
                    <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={ () => closeModal(true) }>
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