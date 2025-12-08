<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { TASK_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    /* -- Content */
    import Schedule from '../../Class/Schedule.svelte';
    import Task from '../../Class/Task.svelte';

    import Calendar from '../Template/Calendar.svelte';
    import ItemTask from './Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages,
        Item
    } = $props();

    /* -- Calendar */
    const aTasks: Task[] = $derived.by( () => {
        // Get All enable Task of this Week
        const aResults = Object.values( Task.getAll() ).filter( oTask => oTask.sWeekKey == Item.sWeekKey ),
            aFromSchedule: Schedule[] = [];

        // Add enable Schedule without Task created by his and 
        aResults.forEach( oTask => oTask.oSchedule ? aFromSchedule.push(oTask.oSchedule) : null );
        Object.values( Schedule.getAll() )
            .filter( oSchedule => {
                return oSchedule.oCustomer.bEnable && aFromSchedule.indexOf(oSchedule) == -1 && oSchedule.oWeekType.fFilter(Item.nWeek);
            } )
            .forEach( oSchedule => aResults.push( Task.from( oSchedule, Item.aDates[oSchedule.nDay] ) ) );

        return aResults;
    } );

    /* -- Organize Cell and Task */
    const oTasksByCell = $derived.by( () => {
            const oResults: TObject<TObject[]> = {};
        
            // Group and Sort
            aTasks
                .sort( (oA, oB) => oA.nTimeStart - oB.nTimeStart )
                .forEach( oTask => {

                    const [nHour, nMinute] = oTask.sTimeStart.split(':').map( (sValue: string) => parseInt(sValue) ),
                        sCell = oTask.nDay + ':' + nHour,
                        nCell = Math.ceil( oTask.nDuration / 60 );

                    // Cell start
                    if( !oResults[sCell] ){
                        oResults[sCell] = [];
                    }
                    oResults[sCell].push( {
                        oStyle: {
                            top: (( nMinute * CONFIG.CALENDAR_CELL_HEIGHT / 60 ) + 1) + 'px',
                            height: (( oTask.nDuration * CONFIG.CALENDAR_CELL_HEIGHT / 60 ) - 3) + 'px',
                            bottom: 'initial'
                        },
                        oTarget: oTask
                    } );

                    // Cell duration
                    for( let nIndex = 1; nIndex < nCell; nIndex++ ){
                        let sKeyCell = oTask.nDay + ':' + ( nHour + nIndex);
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
            oComponent: ItemTask,
            oItems: oTasksByCell,
            aDates: Item.aDates,
            nNow: Item.nNow,

            clickOnItem: (oTask: TObject) => Pages.oView.open(oTask.oTarget),
            clickOnEmpty: (oCellData: TObject) => Pages.oForm.open(TASK_FORM_TYPE.NEW_TASK, oCellData)
        };
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oCalendar).with(console.trace);
        // $inspect(sCellSelected).with(console.trace);
    }
</script>

<Calendar App={App} Pages={Pages} Item={oCalendar} />

<style>
</style>