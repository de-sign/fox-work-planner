<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../../Core/Type';
    import type { ICalendarColumn, ICalendarRow } from './Item.svelte';
    import { CONFIG } from '../../../Core/Config';

    import * as Svelte from 'svelte';
    import * as DATE from '../../../Core/Date';

    import Calendar from './Item.svelte';


    /* ---- Component */

    /* -- Interface */
    interface IWeekCalendarOptions {
        // Item Options
        oComponent: any,
        oCells: TObject<TObject[]>,
        clickOnItem: Function,
        clickOnCell: Function,

        // Date Options
        dDate?: Date
    };

    interface IWeekCalendarProperties {
        App: TObject,
        Pages: TObject,
        Item: IWeekCalendarOptions
    };

    let {
        App,
        Pages,
        Item
    }: IWeekCalendarProperties = $props();

    function formatHour(nHour: number): string {
        return (nHour + 'h').padStart(3, ' ');
    }
    
    
    /* -- Dates */
    const oDates: TObject<Date> | undefined = $derived.by( () => {
        let oResult;
        if( Item.dDate ){
            oResult = {};
            DATE.getDatesOfWeek(Item.dDate).map( (dDate, nIndex) => oResult[nIndex] = dDate );
        }
        return oResult;
    } );


    /* -- Columns */
    const aColumns: ICalendarColumn[] = $derived.by( () => {
        return CONFIG.CALENDAR_DAYS.map( (sValue, nIndex) => {

            let bGutter: boolean = CONFIG.CALENDAR_DAYS_BREAK.indexOf(nIndex) != -1,
                sGutterText = '',
                bBreak: boolean = false,
                aClass: string[] = [];
                
            // Gutter
            if(bGutter){
                sGutterText = formatHour(CONFIG.CALENDAR_HOURS_START);
            }

            // Class
            if( bGutter && nIndex ){
                aClass.push('fox-calendar--is-right');
            }

            // Break
            if(oDates){
                const dDateDay = oDates[nIndex];
                if( DATE.PUBLIC_HOLIDAYS[ DATE.toISO8601(dDateDay) ] ){
                    bBreak = true;
                    aClass.push('fox-calendar--is-break');
                }
            }
            
            return {
                nKey: nIndex,
                sText: sValue.charAt(0),

                bGutter: bGutter,
                sGutterText: sGutterText,

                sClass: aClass.join(' '),
                bBreak: bBreak
            };
        } )
    } );


    /* -- Rows */
    const aRows: ICalendarRow[] = [];
    for( let nHour = CONFIG.CALENDAR_HOURS_START; nHour < CONFIG.CALENDAR_HOURS_START + CONFIG.CALENDAR_HOURS_MAX_BY_DAY; nHour++ ) {
        aRows.push( {
            nKey: nHour,
            sGutterText: formatHour(nHour + 1),
            bBreak: CONFIG.CALENDAR_HOURS_BREAK.indexOf(nHour) != -1
        } );
    }


    /* -- Time */
    let dTimeNow = $state( DATE.getNow() ),
        nTimeout = 0;

    const oTime: TObject | undefined = $derived.by( () => {
        let oResult;

        if( oDates ){

            // Find Cell
            let sCell = '';
            Object.entries(oDates).forEach( ([sKey, dDate]) => {
                if( DATE.toISO8601(dDate) == DATE.toISO8601(dTimeNow) ){
                    sCell = sKey;
                }
            } );

            // Calculate Top
            if( sCell ){
                let sTop = '100%';
                if( dTimeNow.getHours() < CONFIG.CALENDAR_HOURS_START ){
                    sTop = '-2px';
                }
                else if( dTimeNow.getHours() < CONFIG.CALENDAR_HOURS_START + CONFIG.CALENDAR_HOURS_MAX_BY_DAY ){
                    sTop = (( dTimeNow.getMinutes() * CONFIG.CALENDAR_CELL_HEIGHTS.WEEK / 60 ) - 1) + 'px';
                }

                oResult = {
                    sCell: sCell + ':' + Math.max(
                        CONFIG.CALENDAR_HOURS_START,
                        Math.min(
                            dTimeNow.getHours(),
                            CONFIG.CALENDAR_HOURS_START + CONFIG.CALENDAR_HOURS_MAX_BY_DAY - 1
                        )
                    ),
                    sTop: sTop
                };
            }
        }

        return oResult;
    } );

    function updateTime(): void {
        dTimeNow = DATE.getNow();
        nTimeout = setTimeout(updateTime, (61 - dTimeNow.getSeconds()) * 1000 );
    }

    Svelte.onMount(updateTime);
    Svelte.onDestroy( () => clearTimeout(nTimeout) );


    /* -- Calendar */
    const oCalendar = $derived( {

        // Grid Options
        sType: 'week',
        aColumns: aColumns,
        aRows: aRows,
        nCellHeight: CONFIG.CALENDAR_CELL_HEIGHTS.WEEK,
        
        // Item Options
        ...Item,
        clickOnCell: (nKeyX: number, nKeyY: number) => Item.clickOnCell( {
            nDay: nKeyX,
            sDate: oDates ? DATE.toISO8601(oDates[nKeyX]) : null,
            sTimeStart: nKeyY.toString().padStart(2, '0') + ':00',
            sTimeEnd: (nKeyY + 1).toString().padStart(2, '0') + ':00'
        } ),

        // Date and Time Options
        oDates: oDates,
        oTime: oTime
    } );


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item.oCells).with(console.log);
    }

</script>

<Calendar App={App} Pages={Pages} Item={oCalendar} />

<style></style>