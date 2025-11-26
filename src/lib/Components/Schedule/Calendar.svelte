<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { CUSTOMER_PAGE, SCHEDULE_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import Customer from '../../Class/Customer.svelte';
    import Schedule from '../../Class/Schedule.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    const bCustomers = Customer.hasCustomers(),
        oSchedules = Schedule.getAll(),
        aDays = CONFIG.SCHEDULE_CALENDAR_DAYS.map( sValue => sValue.charAt(0) ),
        nStartHour = CONFIG.SCHEDULE_CALENDAR_HOUR_START,
        nMaxHourForDay = CONFIG.SCHEDULE_CALENDAR_HOUR_MAX_BY_DAY,
        aHours = Array.from(
            { length: nMaxHourForDay },
            (uValue, nIndex) => nStartHour + nIndex
        ),
        nCellHeight = 45;

    // -- Organize Cell and Task
    const oWeekStyle: TObject<TObject> = {
            EVERY_WEEK: { left: '1px', right: '1px' },
            EVEN_WEEK: { left: '1px', right: 'calc(50% + 1px)' },
            ODD_WEEK: { left: 'calc(50% + 1px)', right: '1px' }
        },
        oSchedulesGrouped = $derived.by( () => {
            const aCopySchedule: Schedule[] = Object.values(oSchedules),
                oCells: TObject<TObject[]> = {};
        
            // Group and Sort
            aCopySchedule
                .sort( (oA, oB) => oB.nTimeStart - oA.nTimeStart )
                .forEach( oSchedule => {

                    const [nHour, nMinute] = oSchedule.sTimeStart.split(':').map( (sValue: string) => parseInt(sValue) ),
                        sCell = (oSchedule.nDay - 1) + ':' + nHour,
                        nCell = Math.ceil( oSchedule.nDuration / 60 );

                    // Cell start
                    if( !oCells[sCell] ){
                        oCells[sCell] = [];
                    }
                    oCells[sCell].push( {
                        oStyle: Object.assign(
                            {
                                top: (( nMinute * nCellHeight / 60 ) + 1) + 'px',
                                height: (( oSchedule.nDuration * nCellHeight / 60 ) - 3) + 'px',
                                bottom: 'initial'
                            },
                            oWeekStyle[ oSchedule.sWeekType ]
                        ),
                        oTarget: oSchedule
                    } );

                    // Cell duration
                    for( let nIndex = 1; nIndex < nCell; nIndex++ ){
                        let sKeyCell = (oSchedule.nDay - 1) + ':' + ( nHour + nIndex);
                        if( !oCells[sKeyCell] ){
                            oCells[sKeyCell] = [];
                        }
                    }
                } );

            return oCells;
        } );

    // -- Select cell 
    let sCellSelected = $state('0:0');

    function selectCell(nDay: number, nHour: number): void {
        sCellSelected = nDay + ':' + nHour;
    }

    function unselectCell(): void {
        sCellSelected = '0:0';
    }

    function parseCellToForm(nDay: number, nHour: number): TObject {
        return {
            nDay: nDay + 1, // 0 is Sunday !
            sTimeStart: nHour.toString().padStart(2, '0') + ':00',
            sTimeEnd: (nHour + 1).toString().padStart(2, '0') + ':00'
        };
    }

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oSchedulesGrouped).with(console.trace);
        // $inspect(sCellSelected).with(console.trace);
    }
</script>

<!-- Variable CSS -->
<section class="fox-app-page" style="--fox-calendar-cell-height: {nCellHeight - 1}px">

    <!-- Page Content -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fox-app-page-content bulma-section" onclick={unselectCell}>
        <div class="bulma-container bulma-is-max-tablet">
            <div class="bulma-block">
                <h1 class="bulma-title">Emploi du temps</h1>
                <h2 class="bulma-subtitle">Définis ta semaine type</h2>
            </div>

            {#if bCustomers}
                <div class="fox-calendar bulma-block bulma-fixed-grid bulma-has-7-cols bulma-mt-6">
                    <div class="bulma-grid bulma-is-gap-0">
                        <div class="bulma-cell bulma-is-size-7 fox-calendar-hour">
                            <span>{nStartHour}h</span>
                        </div>
                        {#each aDays as sDay}
                            <div class="bulma-cell fox-calendar-header">
                                {sDay}
                            </div>
                        {/each}
                        <div class="bulma-cell bulma-is-size-7 fox-calendar-hour fox-calendar-is-right">
                            <span>{nStartHour}h</span>
                        </div>

                        {#each aHours as nHour}
                            <div class="bulma-cell bulma-is-size-7 fox-calendar-hour">
                                <span>{nHour + 1}h</span>
                            </div>
                            {#each aDays as sDay, nDay}
                                {#if oSchedulesGrouped[nDay + ':' + nHour] }
                                    <div class="bulma-cell fox-calendar-cell { CONFIG.SCHEDULE_CALENDAR_HOUR_BREAK.indexOf(nHour) == -1 ? '' : 'fox-calendar-is-break' }">
                                        {#each oSchedulesGrouped[nDay + ':' + nHour] as oSchedule}
                                            <button
                                                title="Modifier une heure programmée"
                                                class="fox-calendar-task bulma-button bulma-is-link bulma-is-light bulma-is-size-7"
                                                style="{Object.keys(oSchedule.oStyle).map(sStyle => `${sStyle}: ${oSchedule.oStyle[sStyle]}`).join(';')}"
                                                onclick={ oEvent => {
                                                    oEvent.stopPropagation();
                                                    Pages.oView.open(oSchedule.oTarget);
                                                } }
                                            >
                                                {#if oSchedule.oTarget.sWeekType == 'everyWeek'}
                                                    {oSchedule.oTarget.sDuration}<br/>
                                                    {oSchedule.oTarget.oCustomer.sShortName}
                                                {:else}
                                                    {oSchedule.oTarget.oCustomer.sShortName} - {oSchedule.oTarget.sDuration}
                                                {/if}
                                            </button>
                                        {/each}
                                    </div>
                                {:else if sCellSelected == nDay + ':' + nHour}
                                    <div class="bulma-cell fox-calendar-cell { CONFIG.SCHEDULE_CALENDAR_HOUR_BREAK.indexOf(nHour) == -1 ? '' : 'fox-calendar-is-break' }">
                                        <button
                                            class="bulma-button bulma-is-link bulma-is-outlined" title="Ajouter une heure programmée"
                                            onclick={ oEvent => {
                                                oEvent.stopPropagation();
                                                Pages.oForm.open(SCHEDULE_FORM_TYPE.NEW_SCHEDULE, parseCellToForm(nDay, nHour) );
                                            } }
                                        >
                                            <span class="bulma-icon bulma-is-small">
                                                <i class="fa-solid fa-plus"></i>
                                            </span>
                                        </button>
                                    </div>
                                {:else}
                                    <button class="bulma-cell fox-calendar-cell { CONFIG.SCHEDULE_CALENDAR_HOUR_BREAK.indexOf(nHour) == -1 ? '' : 'fox-calendar-is-break' }" title="Selectionner la cellule" onclick={ oEvent => { oEvent.stopPropagation(); selectCell(nDay, nHour) } }></button>
                                {/if}
                            {/each}
                            <div class="bulma-cell bulma-is-size-7 fox-calendar-hour fox-calendar-is-right">
                                <span>{nHour + 1}h</span>
                            </div>
                        {/each}
                    </div>
                </div>
            {:else}
                <div class="bulma-notification bulma-has-text-centered">
                    <span class="bulma-block bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-slash"></i>
                        </span>
                        <span>Aucun client trouvé</span>
                    </span>
                </div>
                <p class="fox-calendar-notification bulma-block">
                    Tu dois d'abord créer un
                    <button class="bulma-block bulma-button bulma-is-small" onclick="{ () => App.oContent.change('Customer', CUSTOMER_PAGE.FORM) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </span>
                        <span>client</span>
                    </button>
                    avant de pouvoir lui ajouter une heure programmée !
                </p>
            {/if}

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
                {#if bCustomers}
                    <button class="bulma-button bulma-is-link" onclick="{ () => Pages.oForm.open(SCHEDULE_FORM_TYPE.NEW_SCHEDULE) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-plus"></i>
                        </span>
                        <span>Ajouter</span>
                    </button>
                {:else}
                    <button class="bulma-button bulma-is-link" onclick="{ () => App.oContent.change('Customer', CUSTOMER_PAGE.FORM) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </span>
                        <span>Ajouter</span>
                    </button>
                {/if}
            </div>
        </div>
    </nav>
</section>

<style>
    .fox-calendar-notification .bulma-button {
        vertical-align: middle;
    }

    .fox-calendar .bulma-cell {
        position: relative;
        min-height: var(--fox-calendar-cell-height);
        border-bottom: 1px solid var(--bulma-border);
        border-right: 1px solid var(--bulma-border);
        line-height: var(--fox-calendar-cell-height);
        text-align: center;
    }

    .fox-calendar-header {
        font-weight: bold;
    }

    .fox-calendar-hour {
        text-align: left !important;
        color: var(--bulma-text-weak);
    }

    .fox-calendar-hour > * {
        display: inline-block;
        padding-right: calc( var(--bulma-block-spacing) / 2 );
        background-color: var(--bulma-body-background-color);
        transform: translateY( calc( var(--fox-calendar-cell-height) / 2) );
        position: relative;
        z-index: 10;
    }

    .fox-calendar-hour.fox-calendar-is-right {
        text-align: right !important;
        border-right: none !important;
    }

    .fox-calendar-hour.fox-calendar-is-right > * {
        padding: 0 0 0 calc( var(--bulma-block-spacing) / 2 );
    }

    .fox-calendar-cell .bulma-button {
        vertical-align: middle;
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 1px;
        right: 1px;
    }

    .fox-calendar-cell.fox-calendar-is-break {
        background-color: var(--bulma-border-weak);
        border-right-color: var(--bulma-border);
    }

    .fox-calendar-task {
        z-index: 10;
        border-width: 1px;
        padding: calc(var(--bulma-button-padding-vertical) - var(--bulma-button-border-width)) 0;
        
        display: block;
        writing-mode: vertical-lr;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>