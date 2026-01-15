<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { EVENT_NAME, CUSTOMER_FORM_TYPE, CUSTOMER_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
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
        
    /* ---- Template */
    /* -- Title */
    const oTitle = {
        sTitle: 'Clients',
        sSubTitle: 'Administre tes clients'
    };

    /* -- Navbar */
    const oNavbar = {
        oBack: {
            sTitle: 'Ouvrir le menu',
            sIcon: 'fa-bars',
            sText: 'Menu',
            click: App.oMenu.open
        },
        aButtons: [
            {
                sClass: 'bulma-is-link',
                sTitle: 'Ajouter un client',
                sIcon: 'fa-user-plus',
                sText: 'Ajouter',
                click: () => Pages.oForm.open(CUSTOMER_FORM_TYPE.NEW_CUSTOMER)
            }
        ]
    };

    
    /* -- History */
    const sEventName = EVENT_NAME.URL_REDIRECTION + '_Customer_' + CUSTOMER_PAGE.LIST;
    function redirection() {
        App.oPage.open( CUSTOMER_PAGE.LIST);
    }

    Svelte.onMount( () => App.oEmitter.on(sEventName, redirection) );
    Svelte.onDestroy( () => App.oEmitter.removeListener(sEventName, redirection) );

    
    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oCustomers).with(console.trace);
        // $inspect(aCustomersGrouped).with(console.trace);
    }
</script>

<section class="fox-app-page">

    <!-- Page Title -->
    <Title Item={oTitle} />

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            {#each aCustomersGrouped as oGroup}
                <section class="bulma-block">
                    <div class="fox-separator">
                        <span>{oGroup.sLetter}</span>
                    </div>
                    {#each oGroup.aCustomers as oCustomer}
                        <section class="fox-list">
                            <Item Item={{ bEnable: oCustomer.bEnable, oTarget: oCustomer, click: () => Pages.oView.open(oCustomer) }}/>
                            {#if oCustomer.aExtraContacts.length}
                                <div class="fox-list">
                                    {#each oCustomer.aExtraContacts as oContact}
                                        <Item Item={{ bEnable: oCustomer.bEnable, oTarget: oContact, click: () => Pages.oView.open(oContact) }}/>
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
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar} />
    
</section>

<style>
</style>