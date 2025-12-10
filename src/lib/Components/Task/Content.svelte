<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { Component } from 'svelte';
    import { PROPERTY_NAME, CUSTOMER_PAGE, SCHEDULE_PAGE, TASK_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import * as FoxDate from '../../Core/Date';
    import Store from '../../Core/Store';

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

    // -- Change Week
    let dDateNow = new Date(),
        dMonday = new Date();
        
    dDateNow = new Date( Date.UTC(dDateNow.getFullYear(), dDateNow.getMonth(), dDateNow.getDate()) );
    dMonday.setDate( (dDateNow.getDate() - dDateNow.getDay() + 1) );
    dMonday = new Date( Date.UTC(dMonday.getFullYear(), dMonday.getMonth(), dMonday.getDate()) );

    // Go to first Monday Day of current Week
    let dMondayOfWeek = $state( new Date(dMonday.toJSON()) ),
        aWeekData = $derived( FoxDate.toWeekData(dMondayOfWeek) ),
        aDates = $derived( FoxDate.getDaysOfWeek(dMondayOfWeek) ),
        nNow = $derived.by( () => {
            let nResult = -1;
            aDates.forEach( (dDate, nIndex) => {
                if( dDate.toJSON() == dDateNow.toJSON() ){
                    nResult = nIndex;
                }
            } );
            return nResult;
        } ),
        sHTMLSelector = $derived.by( () => {
            const dFirst = aDates[0],
                dLast = aDates[ aDates.length - 1 ];

            return 'Du <span class="bulma-is-size-5">' + dFirst.getDate() +  ' ' + CONFIG.CALENDAR_MONTHS_ABBR[dFirst.getMonth()] + '</span> ' +
                'au <span class="bulma-is-size-5">' + dLast.getDate() + ' ' + CONFIG.CALENDAR_MONTHS_ABBR[dLast.getMonth()] + '</span> ' + dLast.getFullYear();
        } );

    function changeWeek(nRatio: number): void {
        if( nRatio ){
            dMondayOfWeek.setDate( dMondayOfWeek.getDate() + (7 * nRatio) );
            dMondayOfWeek = new Date( dMondayOfWeek.toJSON() );
        } else {
            dMondayOfWeek = new Date( dMonday.toJSON() );
        }
        App.oPage.scrollTop();
    }

    // -- Change Time
    let dTimeNow = $state( new Date() ),
        nTimeout = 0;

    function updateTime(): void {
        dTimeNow = new Date();
        nTimeout = setTimeout(updateTime, (61 - dTimeNow.getSeconds()) * 1000 );
    }

    Svelte.onMount(updateTime);
    Svelte.onDestroy( () => clearTimeout(nTimeout) );
    
    /* -- Theme Switch */
    const oDisplays: TObject = {
        'calendar': Calendar,
        'list': List
    };

    let sDisplay: string = $state( Store.get(PROPERTY_NAME.APP_TASK_DISPLAY) || 'calendar'),
        Content: Component = $derived( oDisplays[sDisplay] );

    function changeDisplay(sValue: string): void {
        if( sDisplay != sValue ){
            sDisplay = sValue;
            Store.set(PROPERTY_NAME.APP_TASK_DISPLAY, sDisplay);
        }
    }

    /* ---- Template */
    /* -- Title */
    const oTitle = $derived.by( () => {
        return {
            sTitle: 'Agenda',
            sSubTitle: 'Organise tes tâches',
            aButtons: [
                {
                    sClass: sDisplay == 'calendar' ? 'bulma-is-link bulma-is-selected' : '',
                    sTitle: 'Affichage calendrier',
                    sIcon: 'fa-calendar',
                    click: () => changeDisplay('calendar')
                },
                {
                    sClass: sDisplay == 'list' ? 'bulma-is-link bulma-is-selected' : '',
                    sTitle: 'Affichage liste',
                    sIcon: 'fa-list',
                    click: () => changeDisplay('list')
                }
            ]
        }
    } );

    /* -- Content */
    const oContent = $derived.by( () => {
        return {
            nWeek: aWeekData[0],
            sWeekKey: aWeekData.join('_'),
            nNow: nNow,
            aDates: aDates,
            dTimeNow: dTimeNow
        };
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
            aButtons: [
                Customer.hasCustomers() ? 
                    {
                        sClass: 'bulma-is-link',
                        sTitle: 'Ajouter une tâche',
                        sIcon: 'fa-calendar-plus',
                        sText: 'Ajouter',
                        click: () => Pages.oForm.open(TASK_FORM_TYPE.NEW_TASK)
                    } : 
                    {
                        sClass: 'bulma-is-link',
                        sTitle: 'Ajouter un client',
                        sIcon: 'fa-user-plus',
                        sText: 'Ajouter',
                        click: () => App.oContent.change('Customer', CUSTOMER_PAGE.FORM)
                    }
            ]
        }
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(dTimeNow).with(console.trace);
        // $inspect(oContent).with(console.trace);
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

            <!-- Content -->
            {#if Customer.hasCustomers()}
                <Content App={App} Pages={Pages} Item={oContent} />
            {:else}

                <!-- Empty Customer -->
                <div class="bulma-notification bulma-has-text-centered">
                    <span class="bulma-block bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-slash"></i>
                        </span>
                        <span>Aucun client trouvé</span>
                    </span>
                </div>
                
                <p class="fox-empty-notification bulma-block">
                    Tu dois d'abord créer un
                    <button class="bulma-block bulma-button bulma-is-small" onclick="{ () => App.oContent.change('Customer', CUSTOMER_PAGE.FORM) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </span>
                        <span>client</span>
                    </button>
                    avant de pouvoir lui ajouter une tâche !
                </p>
                <p class="fox-empty-notification bulma-block">
                    Et n'oublie pas de créer des
                    <button class="bulma-block bulma-button bulma-is-small" onclick="{ () => App.oContent.change('Schedule', SCHEDULE_PAGE.FORM) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-plus"></i>
                        </span>
                        <span>planifications</span>
                    </button>
                    afin de pouvoir remplir automatiquement ton agenda !
                </p>
            {/if}

        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar}>

        <!-- Week Nav -->
        <div class="fox-app-page-title-content bulma-is-align-items-center">
            <div class="fox-app-page-title-item bulma-buttons bulma-has-addons bulma-is-flex-wrap-nowrap">
                <button class="bulma-button" onclick="{ () => changeWeek(-1) }" title="Aller à la semaine précédente">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-left"></i>
                    </span>
                </button>
                <button class="bulma-is-flex-grow-1" onclick="{ () => changeWeek(0) }" title="Aller à la semaine courante">
                    <span class="bulma-is-size-7">{@html sHTMLSelector}</span>
                </button>
                <button class="bulma-button" onclick="{ () => changeWeek(1) }" title="Aller à la semaine suivante">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-right"></i>
                    </span>
                </button>
            </div>
        </div>
    </Navbar>
    
</section>

<style>
    .fox-empty-notification .bulma-button {
        vertical-align: middle;
    }
</style>