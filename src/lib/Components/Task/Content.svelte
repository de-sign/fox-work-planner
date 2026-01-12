<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { Component } from 'svelte';
    import { PROPERTY_NAME, CUSTOMER_PAGE, SCHEDULE_PAGE, TASK_FORM_TYPE, DATE_SELECTOR_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import * as DATE from '../../Core/Date';
    import Store from '../../Class/Store';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';
    import DateSelector from '../Template/DateSelector.svelte';

    /* -- Content */
    import Customer from '../../Class/Customer.svelte';
    import Schedule from '../../Class/Schedule.svelte';
    import Task from '../../Class/Task.svelte';

    import List from './List.svelte';
    import Calendar from './Calendar.svelte';


    /* ---- Component */
    let {
        App,
        Pages
    } = $props();
    

    const dDateNow = DATE.getToday(),
        oDisplays: TObject<TObject> = {
            'calendar-week': {
                oComponent: Calendar,
                nDateType: DATE_SELECTOR_TYPE.WEEK
            },
            'calendar-month': {
                oComponent: Calendar,
                nDateType: DATE_SELECTOR_TYPE.MONTH
            },
            'list': {
                oComponent: List,
                nDateType: DATE_SELECTOR_TYPE.MONTH
            }
        };


    /* -- Theme Switch */
    let sDisplay: string = $state( Store.get(PROPERTY_NAME.APP_TASK_DISPLAY) || 'calendar-week'),
        Content: Component = $derived( oDisplays[sDisplay].oComponent );

    function changeDisplay(sValue: string): void {
        if( sDisplay != sValue ){
            sDisplay = sValue;
            Store.set(PROPERTY_NAME.APP_TASK_DISPLAY, sDisplay);
            App.oPage.scrollTop();
        }
    }

    
    /* -- DateSelector */
    let hPage: HTMLElement | null = $state(null),
        oDateSeletorComponent: DateSelector | null = $state(null);

    const nDateType = $derived( oDisplays[sDisplay].nDateType ),
        oDateSelector = {
            dDate: dDateNow,
            changeDate: (dDateSelected: Date) => {
                dTasksDate = dDateSelected;
                App.oPage.scrollTop();
                Svelte.tick().then( () => App.oEmitter.emit('fox-app-page--change-date') );
            }
        };

    Svelte.onMount( () => oDateSeletorComponent?.initTouch(hPage) );
    Svelte.onDestroy( () => oDateSeletorComponent?.destroyTouch() );
    

    /* -- Task */
    let dTasksDate = $state(dDateNow);
    const aTasks: Task[] = $derived.by( () => {

        const sWeekKeyOfTask = DATE.getWeekData(dTasksDate).join('_');
        let oMonthDates: TObject<Date[]> = {},
            aWeekKeys: string[] = [];
        
        switch( nDateType ){
            case DATE_SELECTOR_TYPE.WEEK:
                oMonthDates[sWeekKeyOfTask] = DATE.getDatesOfWeek(dTasksDate);
                aWeekKeys.push(sWeekKeyOfTask);
                break;

            case DATE_SELECTOR_TYPE.MONTH:
                oMonthDates = DATE.getDatesOfMonth(dTasksDate);
                aWeekKeys = Object.keys(oMonthDates);
                break;
        }
            
        const aResults = Object.values( Task.getAll() ).filter( oTask => aWeekKeys.indexOf(oTask.sWeekKey) != -1 ),
            oTaskByWeek: TObject<Task[]> = {};

        // Regroup by Week
        aResults.forEach( oTask => {
            const sWeekKey = oTask.sWeekKey;
            if( !oTaskByWeek[sWeekKey] ){
                oTaskByWeek[sWeekKey] = [];
            }
            oTaskByWeek[sWeekKey].push(oTask);
        } );

        // For all Week
        Object
            .entries(oMonthDates)
            .forEach( ([sWeekKey, aDates]) => {
                const nWeek = parseInt( sWeekKey.split('_')[1] ),
                    aFromSchedule: Schedule[] = [];

                // Add enable Schedule without Task created by his 
                oTaskByWeek[sWeekKey]?.forEach( oTask => oTask.oSchedule ? aFromSchedule.push(oTask.oSchedule) : null );
                Object.values( Schedule.getAll() )
                    .filter( oSchedule => oSchedule.oCustomer.bEnable && aFromSchedule.indexOf(oSchedule) == -1 && oSchedule.oWeekType.fFilter(nWeek) )
                    .forEach( oSchedule => {
                        const dDate = aDates[oSchedule.nDay];
                        if( oSchedule.oCustomer.dDateStart <= dDate ){
                            aResults.push( Task.from( oSchedule, dDate ) );
                        }
                    } );
            } );

        return aResults;
    } );


    /* ---- Template */
    /* -- Title */
    const oTitle = $derived.by( () => {
        return {
            sTitle: 'Agenda',
            sSubTitle: 'Organise tes tâches',
            aButtons: [
                {
                    sClass: sDisplay == 'calendar-week' ? 'bulma-is-link bulma-is-selected' : '',
                    sTitle: 'Affichage calendrier hebdomadaire',
                    sIcon: 'fa-calendar-week',
                    click: () => changeDisplay('calendar-week')
                },
                {
                    sClass: sDisplay == 'calendar-month' ? 'bulma-is-link bulma-is-selected' : '',
                    sTitle: 'Affichage calendrier mensuel',
                    sIcon: 'fa-calendar-days',
                    click: () => changeDisplay('calendar-month')
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
    const oContent = $derived( {
        nDateType: nDateType,
        dDate: dTasksDate,
        aTasks: aTasks
    } );

    /* -- Navbar */
    const oNavbar = $derived( {
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
                    click: () => Pages.oForm.open(TASK_FORM_TYPE.NEW_TASK, {
                        sDate: DATE.toISO8601( dTasksDate ),
                    } )
                } : 
                {
                    sClass: 'bulma-is-link',
                    sTitle: 'Ajouter un client',
                    sIcon: 'fa-user-plus',
                    sText: 'Ajouter',
                    click: () => App.oContent.change('Customer', CUSTOMER_PAGE.FORM)
                }
        ]
    } );


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(dTasksDate).with(console.trace);
        // $inspect(oContent).with(console.trace);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section bind:this={hPage} class="fox-app-page" onclick={ () => App.oEmitter.emit('fox-app-page--click') }>

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
        <!-- Date Nav -->
        <div class="fox-app-page-navbar-content bulma-is-align-items-center">
            <div class="fox-app-page-navbar-item">
                <DateSelector bind:this={oDateSeletorComponent} nType={nDateType} Item={oDateSelector} />
            </div>
        </div>
    </Navbar>
    
</section>

<style>
    .fox-empty-notification .bulma-button {
        vertical-align: middle;
    }
</style>