<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject, TData, TFlag } from '../../../Core/Type';
    import { CONFIG } from '../../../Core/Config';

    import * as Svelte from 'svelte';
    import * as DATE from '../../../Core/Date';

    /* ---- Component */

    /* -- Interface */
    export interface ICalendarColumn {
        nKey: number,
        sText: string,
        
        bGutter: boolean,
        sGutterText?: string,
        
        sClass: string,
        bBreak?: boolean
    };

    export interface ICalendarRow {
        nKey: number,
        sGutterText?: string,
        bBreak?: boolean
    };

    export interface ICalendarOptions {
        // Grid Options
        sType: string,
        aColumns: ICalendarColumn[],
        aRows: ICalendarRow[],
        nCellHeight: number,

        // Item Options
        oCells: TObject<TObject[]>,
        oComponent: any,
        clickOnItem: Function,
        clickOnCell: Function,

        // Date and Time Options
        oOutCells?: TFlag,
        oDates?: TObject<Date>,
        oTime?: TObject
    };

    interface ICalendarProperties {
        App: TObject,
        Pages: TObject,
        Item: ICalendarOptions
    };

    let {
        App,
        Pages,
        Item
    }: ICalendarProperties = $props();


    /* -- Today cell */
    const dDateNow = DATE.toDateOnly( new Date() ),
        sCellNow = $derived.by( () => {
            let sReturn = '-1:-1';
            if( Item.oDates ){
                Object.entries(Item.oDates).forEach( ([sKey, dDate]) => {
                    if( dDate.toJSON() == dDateNow.toJSON() ){
                        sReturn = sKey;
                    }
                } );
            }
            return sReturn;
        } );
    

    /* -- Public Holidays cell */
    const oHolidays = $derived.by( () => {
        const oResult: TData = {};

        if( Item.oDates ){
            Object.entries(Item.oDates).forEach( ([sCellKey, dDate]) => {
                if( sCellKey.split(':').length == 1 ){
                    sCellKey += ':' + Item.aRows[0].nKey;
                }
                oResult[sCellKey] = DATE.PUBLIC_HOLIDAYS[ DATE.toISO8601(dDate) ];
            } );
        }

        return oResult;
    } );

    /* -- Select cell */
    let sCellSelected = $state('-1:-1');

    function selectCell(nKeyX: number, nKeyY: number): void {
        sCellSelected = nKeyX + ':' + nKeyY;
    }

    function unselectCell(): void {
        sCellSelected = '-1:-1';
    }

    Svelte.onMount( () => App.oEmitter.on('fox-app-page--click', unselectCell) );
    Svelte.onDestroy( () => App.oEmitter.removeListener('fox-app-page--click', unselectCell) );
    

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item.oCells).with(console.log);
    }
</script>

<!-- Variable CSS -->
<div class="fox-calendar fox-calendar--is-{Item.sType} bulma-block bulma-fixed-grid bulma-has-{ Item.aColumns.length }-cols" style="--fox-calendar-cell-height: {Item.nCellHeight}px">
    <div class="bulma-grid bulma-is-gap-0">

        <!-- Header -->
        {#each Item.aColumns as oColumn}
            <div id="fox-calendar-cell--{oColumn.nKey}" class={ ['bulma-cell', 'fox-calendar-header', oColumn.sClass, { 'fox-calendar-gutter': oColumn.bGutter, 'fox-calendar--is-today': sCellNow.split(':')[0] == oColumn.nKey.toString() }] }>
                {#if oColumn.sGutterText}
                    <span class="bulma-is-size-7 fox-calendar-gutter-text">{oColumn.sGutterText}</span>
                {/if}
                <div class="fox-calendar-header-text">{oColumn.sText}</div>
                {#if Item.oDates?.[oColumn.nKey] }
                    <div class="bulma-is-size-7 bulma-my-2 fox-calendar-date">{Item.oDates[oColumn.nKey].getDate()}</div>
                {/if}
            </div>
        {/each}

        <!-- Row -->
        {#each Item.aRows as oRow}
            {#each Item.aColumns as oColumn}

                <!-- Gutter: Hour / Week -->
                {#if oColumn.bGutter}
                    <div id="fox-calendar-cell--{oColumn.nKey + ':' + oRow.nKey}" class={ ['bulma-cell', 'fox-calendar-gutter', oColumn.sClass, { 'fox-calendar--is-today': sCellNow == oColumn.nKey + ':' + oRow.nKey }] }>
                        <span class="bulma-is-size-7 fox-calendar-gutter-text">{oRow.sGutterText}</span>
                        {#if Item.oDates?.[oColumn.nKey + ':' + oRow.nKey] }
                            <div class="bulma-is-size-7 bulma-my-2 fox-calendar-date">{Item.oDates[oColumn.nKey + ':' + oRow.nKey].getDate()}</div>
                        {/if}
                    </div>

                {:else}
                    <div id="fox-calendar-cell--{oColumn.nKey + ':' + oRow.nKey}" class={ ['bulma-cell', 'fox-calendar-cell', {
                        'fox-calendar--is-today': sCellNow == oColumn.nKey + ':' + oRow.nKey,
                        'fox-calendar--is-out-of-scope': Item.oOutCells?.[oColumn.nKey + ':' + oRow.nKey],
                        'fox-calendar--is-break':
                            oRow.bBreak
                            || oColumn.bBreak // Is Break Column or Row
                            || oHolidays[oColumn.nKey + ':' + oRow.nKey] // Or is Public Holiday
                    }] }>

                        <div>
                            <!-- Time Cursor -->
                            {#if Item.oTime?.sCell == oColumn.nKey + ':' + oRow.nKey }
                                <div class="fox-calendar-time" style:top={Item.oTime.sTop} ></div>
                            {/if}

                            <!-- Date -->
                            {#if Item.oDates?.[oColumn.nKey + ':' + oRow.nKey] }
                                <div class="fox-calendar-date bulma-is-size-7 bulma-my-2">{Item.oDates[oColumn.nKey + ':' + oRow.nKey].getDate()}</div>
                            {/if}

                            <!-- Holiday -->
                            {#if oHolidays[oColumn.nKey + ':' + oRow.nKey] }
                                <div class="fox-calendar-holidays bulma-my-2">{oHolidays[oColumn.nKey + ':' + oRow.nKey]}</div>
                            {/if}


                            <!-- Cell with Item -->
                            {#if Item.oCells[oColumn.nKey + ':' + oRow.nKey] }
                                {#each Item.oCells[oColumn.nKey + ':' + oRow.nKey] as oItem}
                                    <Item.oComponent sType="calendar-{Item.sType}" Item={{ ...oItem, click: () => Item.clickOnItem(oItem) }} />
                                {/each}

                            <!-- Cell selected -->
                            {:else if sCellSelected == oColumn.nKey + ':' + oRow.nKey}
                                <button
                                    class="bulma-button bulma-is-link bulma-is-outlined" title="Ajouter une planification"
                                    onclick={ oEvent => { oEvent.stopPropagation(); Item.clickOnCell(oColumn.nKey, oRow.nKey); } }
                                >
                                    <span class="bulma-icon bulma-is-small">
                                        <i class="fa-solid fa-plus"></i>
                                    </span>
                                </button>
                            
                            <!-- Cell empty -->
                            {:else if !Item.oOutCells?.[oColumn.nKey + ':' + oRow.nKey]}
                                <button
                                    class="bulma-button bulma-is-ghost" title="Selectionner la cellule"
                                    onclick={ oEvent => { oEvent.stopPropagation(); selectCell(oColumn.nKey, oRow.nKey); } }
                                ></button>
                            {/if}
                            
                        </div>
                    </div>
                {/if}
            {/each}
        {/each}
    </div>
</div>

<style>
/* ---- General */
    /* -- Calendar */
    /* .fox-calendar {} */
    /* .fox-calendar--is-week {} */
    /* .fox-calendar--is-month {} */

    .bulma-cell {
        position: relative;
        min-height: var(--fox-calendar-cell-height);
        border-bottom: 1px solid var(--bulma-border);
        border-right: 1px solid var(--bulma-border);
    }
    
    /* -- Type */
    .fox-calendar--is-right {
        border-right: none;
    }

    .fox-calendar--is-break {
        color: var(--bulma-text-weak) !important;
    }

    .fox-calendar--is-out-of-scope > * {
        opacity: 0.25;
    }

    .fox-calendar--is-today {
        color: var(--bulma-danger) !important;
        border-bottom-color: var(--bulma-danger) !important;
    }

    /* -- Date */
    .fox-calendar-date {
        position: relative;
        z-index: 10;
        display: block;
        text-align: center;
    }

    .fox-calendar-holidays {
        font-size: 0.5rem;
        text-align: center;
    }


/* ---- Header */
    .fox-calendar-header {
        min-height: 45px;
    }

    .fox-calendar-header > * {
        position: relative;
        z-index: 10;
    }

    .fox-calendar-header-text {
        line-height: 45px;
        font-weight: bold;
        text-align: center;
    }

    .fox-calendar-header .fox-calendar-date {
        margin-top: -0.5rem !important;
    }

/* ---- Gutter */
    .fox-calendar-gutter {
        color: var(--bulma-border);
    }

    .fox-calendar-gutter-text {
        white-space: pre;
        color: var(--bulma-text-weak);

        background-color: var(--bulma-body-background-color);
        padding: 0 calc( var(--bulma-block-spacing) / 2 ) 0 0;
        
        position: absolute;
        z-index: 10;
        bottom: 0;
        left: 0;

        transform: translateY(50%);
    }

    .fox-calendar--is-right .fox-calendar-gutter-text {
        padding: 0 0 0 calc( var(--bulma-block-spacing) / 2 );
        left: auto;
        right: 0;
    }


/* ---- Cell */
    /* .fox-calendar-cell {} */

    .fox-calendar-cell.fox-calendar--is-break {
        background-color: var(--bulma-border-weak);
    }

    .fox-calendar-cell .bulma-button {
        vertical-align: middle;
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 1px;
        right: 1px;
    }


/* ---- Time */
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