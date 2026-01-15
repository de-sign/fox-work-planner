<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { Component } from 'svelte';
    import { EVENT_NAME, PROPERTY_NAME, SCHEDULE_FORM_TYPE, SCHEDULE_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import Store from '../../Class/Store';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
    import Customer from '../../Class/Customer.svelte';
    import List from './List.svelte';
    import Calendar from './Calendar.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();
    
    /* -- Theme Switch */
    const oDisplays: TObject = {
        'calendar-week': Calendar,
        'list': List
    };

    let sDisplay: string = $state( Store.get(PROPERTY_NAME.APP_SCHEDULE_DISPLAY) || 'calendar-week'),
        Content: Component = $derived( oDisplays[sDisplay] );

    function changeDisplay(sValue: string): void {
        if( sDisplay != sValue ){
            sDisplay = sValue;
            Store.set(PROPERTY_NAME.APP_SCHEDULE_DISPLAY, sDisplay);
        }
    }

    /* ---- Template */
    const bHasCustomer = Customer.hasCustomers();

    /* -- Title */
    const oTitle = $derived.by( () => {
        return {
            sTitle: 'Planification',
            sSubTitle: 'Définis ta semaine type',
            aButtons: bHasCustomer ? 
                [
                    {
                        sClass: sDisplay == 'calendar-week' ? 'bulma-is-link bulma-is-selected' : '',
                        sTitle: 'Affichage calendrier',
                        sIcon: 'fa-calendar-week',
                        click: () => changeDisplay('calendar-week')
                    },
                    {
                        sClass: sDisplay == 'list' ? 'bulma-is-link bulma-is-selected' : '',
                        sTitle: 'Affichage liste',
                        sIcon: 'fa-list',
                        click: () => changeDisplay('list')
                    }
                ]
                : null
        }
    } );

    /* -- Navbar */
    const oNavbar = $derived.by( () => {
        return {
            oBack: {
                sTitle: 'Ouvrir le menu',
                sIcon: 'fa-bars',
                sText: 'Menu',
                click: App.oMenu.open
            },
            aButtons: bHasCustomer ?
                [
                    {
                        sClass: 'bulma-is-link',
                        sTitle: 'Ajouter une planification',
                        sIcon: 'fa-calendar-plus',
                        sText: 'Ajouter',
                        click: () => Pages.oForm.open(SCHEDULE_FORM_TYPE.NEW_SCHEDULE)
                    }
                ]
                : null
        }
    } );

    
    /* -- History */
    const sEventName = EVENT_NAME.URL_REDIRECTION + '_Schedule_' + SCHEDULE_PAGE.CONTENT;
    function redirection() {
        App.oPage.open( SCHEDULE_PAGE.CONTENT);
    }

    Svelte.onMount( () => App.oEmitter.on(sEventName, redirection) );
    Svelte.onDestroy( () => App.oEmitter.removeListener(sEventName, redirection) );


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(uVariable).with(console.trace);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="fox-app-page" onclick={ () => App.oEmitter.emit('fox-app-page--click') }>

    <!-- Page Title -->
    <Title Item={oTitle} />

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">

            {#if bHasCustomer}
               <Content App={App} Pages={Pages} />
            {:else}
                <div class="bulma-notification bulma-has-text-centered">
                    <span class="bulma-block bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-slash"></i>
                        </span>
                        <span>Aucun client trouvé</span>
                    </span>
                </div>
                
                <p class="fox-empty-notification bulma-block">
                    Tu dois d'abord créer un <b>client</b> avant de pouvoir lui ajouter une planification !
                </p>
            {/if}

        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar} />
    
</section>

<style>
</style>