<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import * as DATE from '../../Core/Date';

    /* ---- Component */
    let {
        App,
        Pages,
        Item
    } = $props();

    /* -- Calendar */
    const aDays: TObject[] = $derived.by( () => {
            return CONFIG.CALENDAR_DAYS.map( (sValue, nIndex) => {
                const bBreakDay = CONFIG.CALENDAR_DAYS_BREAK.indexOf(nIndex) != -1,
                    aClass = [];

                if( bBreakDay ){
                    aClass.push('fox-calendar-is-break');
                    if( nIndex ){
                        aClass.push('fox-calendar-is-right');
                    }
                }

                if( Item.nNow == nIndex ){
                    aClass.push('fox-calendar-is-today');
                }
                
                return {
                    nDay: nIndex,
                    sClass: aClass.join(' '),
                    bHour: bBreakDay,
                    sText: sValue.charAt(0),
                    sDate: Item.aDates ? Item.aDates[nIndex].getDate() : null
                }
            } )
        } ),
        nStartHour = CONFIG.CALENDAR_HOURS_START,
        nMaxHourForDay = CONFIG.CALENDAR_HOURS_MAX_BY_DAY,
        aHours = Array.from(
            { length: nMaxHourForDay },
            (uValue, nIndex) => nStartHour + nIndex
        );

    function formatHour(nHour: number): string {
        return (nHour + 'h').padStart(3, ' ');
    }

    // -- Time
    let sCellTime = $derived.by( () => {
            let sReturn = '-1:0';
            if( Item.dTimeNow ){
                sReturn = Item.nNow + ':' + Math.max( nStartHour, Math.min( Item.dTimeNow.getHours(), nStartHour + nMaxHourForDay - 1) );
            }
            return sReturn;
        } ),
        sTimeTop = $derived.by( () => {
            let sResult = '100%';
            if( Item.dTimeNow.getHours() < nStartHour ){
                sResult = '-2px';
            }
            else if( Item.dTimeNow.getHours() < nStartHour + nMaxHourForDay ){
                sResult = (( Item.dTimeNow.getMinutes() * CONFIG.CALENDAR_CELL_HEIGHT / 60 ) - 1) + 'px';
            }
            return sResult;
        } );

    // -- Select cell 
    let sCellSelected = $state('-1:0');

    function selectCell(nDay: number, nHour: number): void {
        sCellSelected = nDay + ':' + nHour;
    }

    function unselectCell(): void {
        sCellSelected = '-1:0';
    }

    function parseCellToForm(nDay: number, nHour: number): TObject {
        return {
            nDay: nDay,
            sDate: Item.aDates ? DATE.toISO8601(Item.aDates[nDay]) : null,
            sTimeStart: nHour.toString().padStart(2, '0') + ':00',
            sTimeEnd: (nHour + 1).toString().padStart(2, '0') + ':00'
        };
    }

    Svelte.onMount( () => App.oEmitter.on('fox-app-page--click', unselectCell) );
    Svelte.onDestroy( () => App.oEmitter.removeListener('fox-app-page--click', unselectCell) );
    

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(sTimeTop).with(console.trace);
        // $inspect(sCellSelected).with(console.trace);
    }
</script>

<!-- Variable CSS -->
<div class="fox-calendar bulma-block bulma-fixed-grid bulma-has-7-cols" style="--fox-calendar-cell-height: {CONFIG.CALENDAR_CELL_HEIGHT}px">
    <div class="bulma-grid bulma-is-gap-0">

        <!-- Header -->
        {#each aDays as oDay}
            <div class="bulma-cell fox-calendar-header {oDay.sClass}">
                {#if oDay.bHour}
                    <span class="bulma-is-size-7 fox-calendar-hour">{formatHour(nStartHour)}</span>
                    <span>{oDay.sText}</span>
                {:else}
                    {oDay.sText}
                {/if}
                {#if oDay.sDate}
                    <span class="bulma-is-size-7 fox-calendar-date">{oDay.sDate}</span>
                {/if}
            </div>
        {/each}

        <!-- Row -->
        {#each aHours as nHour}
            {#each aDays as oDay}

                <!-- Hour -->
                {#if oDay.bHour}
                    <div class="bulma-cell {oDay.sClass}">
                        <span class="bulma-is-size-7 fox-calendar-hour">{formatHour(nHour + 1)}</span>
                    </div>

                {:else}
                    <div class="bulma-cell fox-calendar-cell { CONFIG.CALENDAR_HOURS_BREAK.indexOf(nHour) == -1 ? '' : 'fox-calendar-is-break' }">

                        <!-- Time Cursor -->
                        {#if sCellTime == oDay.nDay + ':' + nHour }
                            <div class="fox-calendar-time" style:top={sTimeTop} ></div>
                        {/if}

                        <!-- With Item -->
                        {#if Item.oItems[oDay.nDay + ':' + nHour] }
                            {#each Item.oItems[oDay.nDay + ':' + nHour] as oItem}
                                <Item.oComponent sType="calendar" Item={{ ...oItem, click: () => Item.clickOnItem(oItem) }} />
                            {/each}

                        <!-- Selected -->
                        {:else if sCellSelected == oDay.nDay + ':' + nHour}
                            <button
                                class="bulma-button bulma-is-link bulma-is-outlined" title="Ajouter une planification"
                                onclick={ oEvent => { oEvent.stopPropagation(); Item.clickOnEmpty( parseCellToForm(oDay.nDay, nHour) ); } }
                            >
                                <span class="bulma-icon bulma-is-small">
                                    <i class="fa-solid fa-plus"></i>
                                </span>
                            </button>
                        
                        <!-- Empty -->
                        {:else}
                            <button
                                class="bulma-button bulma-is-ghost" title="Selectionner la cellule"
                                onclick={ oEvent => { oEvent.stopPropagation(); selectCell(oDay.nDay, nHour); } }
                            ></button>
                        {/if}
                    </div>
                {/if}
            {/each}
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

    .fox-calendar-header.fox-calendar-is-break {
        color: var(--bulma-border);
    }

    .fox-calendar-header.fox-calendar-is-today {
        color: var(--bulma-danger) !important;
        border-bottom-color: var(--bulma-danger) !important;
    }

    .fox-calendar-header > * {
        position: relative;
        z-index: 10;
    }

    .fox-calendar-date {
        display: block;
        line-height: normal;
        margin: -0.5rem 0 0.5rem;
        font-weight: normal;
    }

    .fox-calendar-hour {
        color: var(--bulma-border);
        white-space: pre;
        font-weight: normal;
        color: var(--bulma-text-weak);
        padding-right: calc( var(--bulma-block-spacing) / 2 );
        background-color: var(--bulma-body-background-color);
        position: absolute;
        z-index: 10;
        bottom: calc( var(--fox-calendar-cell-height) / -2);
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

    .fox-calendar-time {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--bulma-danger);
    }

    .fox-calendar-time::before {
        content: '';
        display: block;

        position: absolute;
        left: -5px;
        top: -5px;

        width: 0; 
        height: 0;

        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 6px solid var(--bulma-danger);
    }
</style>