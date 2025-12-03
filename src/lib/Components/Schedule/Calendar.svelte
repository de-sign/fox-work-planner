<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { SCHEDULE_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';
    import * as Svelte from 'svelte';

    /* -- Content */
    import Schedule from '../../Class/Schedule.svelte';

    import Item from '../Schedule/Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    /* -- Calendar */
    const oSchedules = Schedule.getAll(),
        aDays = CONFIG.CALENDAR_DAYS.map( sValue => sValue.charAt(0) ),
        nStartHour = CONFIG.CALENDAR_HOUR_START,
        nMaxHourForDay = CONFIG.CALENDAR_HOUR_MAX_BY_DAY,
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
                .sort( (oA, oB) => oA.nTimeStart - oB.nTimeStart )
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

    function unselectCell(): void { // ???
        sCellSelected = '0:0';
    }

    function parseCellToForm(nDay: number, nHour: number): TObject {
        return {
            nDay: nDay + 1, // 0 is Sunday !
            sTimeStart: nHour.toString().padStart(2, '0') + ':00',
            sTimeEnd: (nHour + 1).toString().padStart(2, '0') + ':00'
        };
    }

    Svelte.onMount( () => App.oEmitter.on('fox-app-page--click', unselectCell) );
    Svelte.onDestroy( () => App.oEmitter.removeListener('fox-app-page--click', unselectCell) );
    

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oSchedulesGrouped).with(console.trace);
        // $inspect(sCellSelected).with(console.trace);
    }
</script>

<!-- Variable CSS -->
<div class="fox-calendar bulma-block bulma-fixed-grid bulma-has-7-cols" style="--fox-calendar-cell-height: {nCellHeight}px">
    <div class="bulma-grid bulma-is-gap-0">
        <div class="bulma-cell fox-calendar-header">
            <span class="bulma-is-size-7 fox-calendar-hour">{nStartHour}h</span>
            <span>D</span>
        </div>
        {#each aDays as sDay}
            <div class="bulma-cell fox-calendar-header">
                {sDay}
            </div>
        {/each}
        <div class="bulma-cell fox-calendar-header fox-calendar-is-right">
            <span class="bulma-is-size-7 fox-calendar-hour">{nStartHour}h</span>
            <span>S</span>
        </div>

        {#each aHours as nHour}
            <div class="bulma-cell">
                <span class="bulma-is-size-7 fox-calendar-hour">{nHour + 1}h</span>
            </div>
            {#each aDays as sDay, nDay}
                {#if oSchedulesGrouped[nDay + ':' + nHour] }
                    <div class="bulma-cell fox-calendar-cell { CONFIG.CALENDAR_HOUR_BREAK.indexOf(nHour) == -1 ? '' : 'fox-calendar-is-break' }">
                        {#each oSchedulesGrouped[nDay + ':' + nHour] as oSchedule}
                            <Item sType="calendar" Item={{ ...oSchedule, click: () => Pages.oView.open(oSchedule.oTarget) }}
                            />
                        {/each}
                    </div>
                {:else if sCellSelected == nDay + ':' + nHour}
                    <div class="bulma-cell fox-calendar-cell { CONFIG.CALENDAR_HOUR_BREAK.indexOf(nHour) == -1 ? '' : 'fox-calendar-is-break' }">
                        <button
                            class="bulma-button bulma-is-link bulma-is-outlined" title="Ajouter une planification"
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
                    <button class="bulma-cell fox-calendar-cell { CONFIG.CALENDAR_HOUR_BREAK.indexOf(nHour) == -1 ? '' : 'fox-calendar-is-break' }" title="Selectionner la cellule" onclick={ oEvent => { oEvent.stopPropagation(); selectCell(nDay, nHour) } }></button>
                {/if}
            {/each}
            <div class="bulma-cell fox-calendar-is-right">
                <span class="bulma-is-size-7 fox-calendar-hour">{nHour + 1}h</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .fox-calendar .bulma-cell {
        position: relative;
        min-height: var(--fox-calendar-cell-height);
        border-bottom: 1px solid var(--bulma-border);
        border-right: 1px solid var(--bulma-border);
        line-height: var(--fox-calendar-cell-height);
        text-align: center;
    }

    .fox-calendar .bulma-cell.fox-calendar-is-right {
        border-right: none;
    }

    .fox-calendar-header {
        font-weight: bold;
    }

    .fox-calendar-header > * {
        position: relative;
        z-index: 10;
        color: var(--bulma-border);
    }

    .fox-calendar-hour {
        font-weight: normal;
        color: var(--bulma-text-weak);
        padding-right: calc( var(--bulma-block-spacing) / 2 );
        background-color: var(--bulma-body-background-color);
        position: absolute;
        z-index: 10;
        top: calc( var(--fox-calendar-cell-height) / 2);
        left: 0;
    }

    .fox-calendar-is-right .fox-calendar-hour {
        left: auto;
        right: 0;
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
</style>