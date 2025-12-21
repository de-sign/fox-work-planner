<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject, TFlag } from '../../../Core/Type';
    import type { ICalendarColumn, ICalendarRow } from './Item.svelte';
    import { CONFIG } from '../../../Core/Config';

    import * as DATE from '../../../Core/Date';

    import Calendar from './Item.svelte';


    /* ---- Component */

    /* -- Interface */
    interface IMonthCalendarOptions {
        // Item Options
        oComponent: any,
        oCells: TObject<TObject[]>,
        clickOnItem: Function,
        clickOnCell: Function,

        // Date Options
        dDate: Date
    };

    interface IMonthCalendarProperties {
        App: TObject,
        Pages: TObject,
        Item: IMonthCalendarOptions
    };

    let {
        App,
        Pages,
        Item
    }: IMonthCalendarProperties = $props();

    function formatWeek(sWeek: string): string {
        return ('S' + sWeek).padStart(3, ' ');
    }
    
    
    /* -- Dates */
    const oMonthDates = $derived( DATE.getDatesOfMonth(Item.dDate) ),
        aWeekNumbers = $derived( Object
            .keys(oMonthDates)
            .sort( (sA, sB) => sA.localeCompare(sB, 'fr', { numeric: true }) )
            .map( sWeekKey => sWeekKey.split('_')[1] )
        ),
        oDates: TObject<Date> = $derived.by( () => {
            const oResult: TObject<Date> = {};
            Object.keys(oMonthDates).forEach( sWeekKey => {
                oMonthDates[sWeekKey]
                    .map( (dDate, nIndex) => oResult[nIndex + ':' + sWeekKey.split('_')[1]] = dDate );
            } );
            return oResult;
        } ),
        oOutCells: TFlag = $derived.by( () => {
            const oResult: TFlag = {};
            Object.entries(oDates).map( ([sCellKey, dDate]) => {
                oResult[sCellKey] = dDate.getMonth() != Item.dDate.getMonth();
            } );
            return oResult;
        } );


    /* -- Columns */
    const aColumns: ICalendarColumn[] = $derived.by( () => {
        return CONFIG.CALENDAR_DAYS.map( (sValue, nIndex) => {

            let bGutter: boolean = CONFIG.CALENDAR_DAYS_BREAK.indexOf(nIndex) != -1,
                sGutterText = '',
                aClass: string[] = [];
                
            // Gutter
            if(bGutter){
                sGutterText = formatWeek(aWeekNumbers[0]);
            }

            // Class
            if(bGutter && nIndex){
                aClass.push('fox-calendar--is-right');
            }
            
            return {
                nKey: nIndex,
                sText: sValue.charAt(0),

                bGutter: bGutter,
                sGutterText: sGutterText,

                sClass: aClass.join(' ')
            };
        } )
    } );


    /* -- Rows */
    const aRows: ICalendarRow[] = $derived.by( () => {
        const aResult: ICalendarRow[] = [];

        aWeekNumbers.forEach( (sWeekNumber, nIndex) => {
            const sNextWeekKey = nIndex + 1 < aWeekNumbers.length ? aWeekNumbers[nIndex + 1] : '';
            aResult.push( {
                nKey: parseInt(sWeekNumber),
                sGutterText: sNextWeekKey ? formatWeek(sNextWeekKey) : undefined
            } );
        } );

        return aResult;
    } );


    /* -- Calendar */
    const oCalendar = $derived( {

        // Grid Options
        sType: 'month',
        aColumns: aColumns,
        aRows: aRows,
        nCellHeight: CONFIG.CALENDAR_CELL_HEIGHTS.MONTH,
        
        // Item Options
        ...Item,
        clickOnCell: (nKeyX: number, nKeyY: number) => Item.clickOnCell( {
            sDate: DATE.toISO8601(oDates[nKeyX + ':' + nKeyY])
        } ),

        // Date and Time Options
        oDates: oDates,
        oOutCells: oOutCells
    } );


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item.oCells).with(console.log);
    }

</script>

<Calendar App={App} Pages={Pages} Item={oCalendar} />

<style></style>