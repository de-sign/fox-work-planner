<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { Component } from 'svelte';
    import { TASK_FORM_TYPE, DATE_SELECTOR_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    /* -- Content */
    import Task from '../../Class/Task.svelte';

    import CalendarWeek from '../Template/Calendar/Week.svelte';
    import CalendarMonth from '../Template/Calendar/Month.svelte';
    import ItemTask from './Item.svelte';

    /* ---- Component */
    interface ITaskCalendarProperties {
        App: TObject,
        Pages: TObject,
        Item: {
            nDateType: number,
            dDate: Date,
            aTasks: Task[]
        }
    };

    let {
        App,
        Pages,
        Item
    }: ITaskCalendarProperties = $props();

    const oCalendars: TObject = {
            [DATE_SELECTOR_TYPE.WEEK]: CalendarWeek,
            [DATE_SELECTOR_TYPE.MONTH]: CalendarMonth
        },
        Calendar: Component = $derived( oCalendars[Item.nDateType] );
        

    /* -- Organize Cell and Task */
    const oTasksByCell = $derived.by( () => {
        const oResults: TObject<TObject[]> = {};

        switch(Item.nDateType) {
            case DATE_SELECTOR_TYPE.WEEK:
                Item.aTasks
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
                                top: (( nMinute * CONFIG.CALENDAR_CELL_HEIGHTS.WEEK / 60 ) + 1) + 'px',
                                height: (( oTask.nDuration * CONFIG.CALENDAR_CELL_HEIGHTS.WEEK / 60 ) - 3) + 'px',
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
                break;
            
            case DATE_SELECTOR_TYPE.MONTH:
                Item.aTasks
                    .forEach( oTask => {
                        const sCell = oTask.nDay + ':' + oTask.nWeek;
                        if( !oResults[sCell] ){
                            oResults[sCell] = [];
                        }
                        oResults[sCell].push( { oTarget: oTask } );
                    } );
                break;
        }

        return oResults;
    } );
    
    /* -- Calendar component */
    const oCalendar = $derived.by( () => {
        return {
            oComponent: ItemTask,
            oCells: oTasksByCell,
            clickOnItem: (oTask: TObject) => Pages.oView.open(oTask.oTarget),
            clickOnCell: (oCellData: TObject) => Pages.oForm.open(TASK_FORM_TYPE.NEW_TASK, oCellData),

            dDate: Item.dDate
        };
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item.sDateType).with(console.trace);
    }
</script>

<Calendar App={App} Pages={Pages} Item={oCalendar} />

<style>
</style>