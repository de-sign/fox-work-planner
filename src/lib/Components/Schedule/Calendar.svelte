<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { SCHEDULE_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    /* -- Content */
    import Schedule from '../../Class/Schedule.svelte';

    import Calendar from '../Template/Calendar.svelte';
    import Item from './Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    /* -- Calendar */
    const aSchedules = Object.values( Schedule.getAll() ).filter( oSchedule => oSchedule.oCustomer.bEnable );

    /* -- Organize Cell and Schedule */
    const oWeekStyle: TObject<TObject> = {
            EVERY_WEEK: { left: '1px', right: '1px' },
            EVEN_WEEK: { left: '1px', right: 'calc(50% + 1px)' },
            ODD_WEEK: { left: 'calc(50% + 1px)', right: '1px' }
        },
        oSchedulesByCell = $derived.by( () => {
            const oResults: TObject<TObject[]> = {};
        
            // Group and Sort
            aSchedules
                .sort( (oA, oB) => oA.nTimeStart - oB.nTimeStart )
                .forEach( oSchedule => {

                    const [nHour, nMinute] = oSchedule.sTimeStart.split(':').map( (sValue: string) => parseInt(sValue) ),
                        sCell = oSchedule.nDay + ':' + nHour,
                        nCell = Math.ceil( oSchedule.nDuration / 60 );

                    // Cell start
                    if( !oResults[sCell] ){
                        oResults[sCell] = [];
                    }
                    oResults[sCell].push( {
                        oStyle: Object.assign(
                            {
                                top: (( nMinute * CONFIG.CALENDAR_CELL_HEIGHT / 60 ) + 1) + 'px',
                                height: (( oSchedule.nDuration * CONFIG.CALENDAR_CELL_HEIGHT / 60 ) - 3) + 'px',
                                bottom: 'initial'
                            },
                            oWeekStyle[ oSchedule.sWeekType ]
                        ),
                        oTarget: oSchedule
                    } );

                    // Cell duration
                    for( let nIndex = 1; nIndex < nCell; nIndex++ ){
                        let sKeyCell = oSchedule.nDay + ':' + ( nHour + nIndex);
                        if( !oResults[sKeyCell] ){
                            oResults[sKeyCell] = [];
                        }
                    }
                } );

            return oResults;
        } );
    
    /* -- Calendar component */
    const oCalendar = $derived.by( () => {
        return {
            oComponent: Item,
            oItems: oSchedulesByCell,

            clickOnItem: (oSchedule: TObject) => Pages.oView.open(oSchedule.oTarget),
            clickOnEmpty: (oCellData: TObject) => Pages.oForm.open(SCHEDULE_FORM_TYPE.NEW_SCHEDULE, oCellData)
        };
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oCells).with(console.trace);
        // $inspect(sCellSelected).with(console.trace);
    }
</script>

<Calendar App={App} Pages={Pages} Item={oCalendar} />

<style>
</style>