<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { Component } from 'svelte';
    import { PROPERTY_NAME, CUSTOMER_PAGE, SCHEDULE_PAGE, TASK_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';
    import { toWeekData } from '../../Core/Form';

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
    let dNow = new Date(),
        dMonday = new Date();
        
    dNow = new Date( Date.UTC(dNow.getFullYear(), dNow.getMonth(), dNow.getDate()) );
    dMonday.setDate( (dNow.getDate() - dNow.getDay() + 1) );
    dMonday = new Date( Date.UTC(dMonday.getFullYear(), dMonday.getMonth(), dMonday.getDate()) );


    // Go to first Monday Day of current Week
    let dMondayOfWeek = $state( new Date(dMonday.toJSON()) ),
        aWeekData = $derived( toWeekData(dMondayOfWeek) ),
        aDates = $derived.by( () => {
            const aDays: Date[] = [],
                dDay = new Date( dMondayOfWeek.toJSON() );

            // Go To Sunday
            dDay.setDate( dDay.getDate() - 1 );

            // Add All days
            for( let nAdd = 0; nAdd < 7; nAdd++ ){
                aDays.push( new Date(dDay.toJSON()) );
                dDay.setDate( dDay.getDate() + 1 );
            }

            return aDays;
        } ),
        nNow = $derived.by( () => {
            let nResult = -1;
            aDates.forEach( (dDate, nIndex) => {
                if( dDate.toJSON() == dNow.toJSON() ){
                    nResult = nIndex;
                }
            } );
            return nResult;
        } ),
        sHTMLSelector = $derived.by( () => {
            const dFirst = aDates[0],
                dLast = aDates[ aDates.length - 1 ];

            return 'Du <span class="bulma-is-size-5">' + dFirst.getDate() +  ' ' + CONFIG.CALENDAR_MONTHS[dFirst.getMonth()] + '</span> ' +
                'au <span class="bulma-is-size-5">' + dLast.getDate() + ' ' + CONFIG.CALENDAR_MONTHS[dLast.getMonth()] + '</span> ' + dLast.getFullYear();
        } );

    function changeWeek(nRatio: number): void {
        if( nRatio ){
            dMondayOfWeek.setDate( dMondayOfWeek.getDate() + (7 * nRatio) );
            dMondayOfWeek = new Date( dMondayOfWeek.toJSON() );
        } else {
            dMondayOfWeek = new Date( dMonday.toJSON() );
        }
    }
    
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
            sSubTitle: 'Gère tes tâches à venir',
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
            aDates: aDates
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
        // $inspect(dMondayOfWeek).with(console.trace);
        // $inspect(oContent).with(console.trace);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="fox-app-page" onclick={ () => App.oEmitter.emit('fox-app-page--click') }>

    <!-- Page Title -->
    <Title Item={oTitle}>

        <!-- Week Nav -->
        <nav class="fox-app-page-title-content bulma-is-align-items-center">
            <button class="fox-app-page-title-item bulma-has-text-left" onclick="{ () => changeWeek(0) }" title="Aller à la semaine courante">
                <span class="bulma-is-size-7">{@html sHTMLSelector}</span>
            </button>
            <div class="fox-app-page-title-item bulma-buttons bulma-has-addons">
                <button class="bulma-button" onclick="{ () => changeWeek(-1) }" title="Aller à la semaine précédente">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-left"></i>
                    </span>
                </button>
                <button class="bulma-button" onclick="{ () => changeWeek(1) }" title="Aller à la semaine suivante">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-right"></i>
                    </span>
                </button>
            </div>
        </nav>
    </Title>

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
                            <i class="fa-solid calendar-plus"></i>
                        </span>
                        <span>planifications</span>
                    </button>
                    afin de pouvoir remplir automatiquement ton agenda !
                </p>
            {/if}

        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar} />
    
</section>

<style>
    .fox-empty-notification .bulma-button {
        vertical-align: middle;
    }
</style>