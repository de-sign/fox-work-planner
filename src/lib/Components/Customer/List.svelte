<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { CUSTOMER_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import Customer from '../../Class/Customer.svelte';
    import Item from './Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    const oCustomers = Customer.getAll(),
        aCustomersGrouped = $derived.by( () => {
            const aCopyCustomer: Customer[] = Object.values(oCustomers),
                aReturn: TObject[] = [],
                oLetters: TObject<Customer[]> = {};
            
            // Group and Sort
            aCopyCustomer
                .sort( (oA, oB) => oA.sName.localeCompare(oB.sName, 'fr', { numeric: true }) )
                .forEach( oCustomer => {
                    let sLetter = oCustomer.oMainContact.sLastName.charAt(0);
                    if( !oLetters[sLetter] ){
                        oLetters[sLetter] = [];
                    }
                    oLetters[sLetter].push(oCustomer);
                } );

            Object.keys(oLetters)
                .sort( (sA, sB) => sA.localeCompare(sB, 'fr', { numeric: true }) )
                .forEach( sLetter => {
                    aReturn.push( {
                        sLetter,
                        aCustomers: oLetters[sLetter]
                    } )
                } );

            return aReturn;
        } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oCustomers).with(console.trace);
        // $inspect(aCustomersGrouped).with(console.trace);
    }
</script>

<section class="fox-app-page">

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">

            <header class="fox-app-title">
                <h1 class="bulma-title">Clients</h1>
                <h2 class="bulma-subtitle">Administre tes clients</h2>
            </header>

            {#each aCustomersGrouped as oGroup}
                <section class="bulma-block">
                    <div class="fox-separator">
                        <span>{oGroup.sLetter}</span>
                    </div>
                    {#each oGroup.aCustomers as oCustomer}
                        <section class="fox-list">
                            <Item Item={{ oTarget: oCustomer, click: () => Pages.oView.open(oCustomer) }}/>
                            {#if oCustomer.aExtraContacts.length}
                                <div class="fox-list">
                                    {#each oCustomer.aExtraContacts as oContact}
                                        <Item Item={{ oTarget: oContact, click: () => Pages.oView.open(oContact) }}/>
                                    {/each}
                                </div>
                            {/if}
                        </section>
                    {/each}
                </section>
            {:else}
                <div class="bulma-notification bulma-has-text-centered">
                    <span class="bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-slash"></i>
                        </span>
                        <span>Aucun client trouvé</span>
                    </span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Navbar -->
    <nav class="fox-app-page-navbar bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button bulma-is-hovered" onclick={App.oMenu.open} >
                    <span class="bulma-icon">
                        <i class="fa-solid fa-bars"></i>
                    </span>
                    <span>Menu</span>
                </button>
            </div>
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button bulma-is-link" onclick="{ () => Pages.oForm.open(CUSTOMER_FORM_TYPE.NEW_CUSTOMER) }">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-user-plus"></i>
                    </span>
                    <span>Ajouter</span>
                </button>
            </div>
        </div>
    </nav>
</section>

<style>
</style>