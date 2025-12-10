<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../../Core/Type';
    import { CONFIG } from '../../Core/Config';

    /* -- Content */
    import Schedule from '../../Class/Schedule.svelte';
    import Task from '../../Class/Task.svelte';

    import ItemTask from './Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages,
        Item
    } = $props();

    const aTasks: Task[] = $derived.by( () => {
        // Get All enable Task of this Week
        const aResults = Object.values( Task.getAll() ).filter( oTask => oTask.sWeekKey == Item.sWeekKey ),
            aFromSchedule: Schedule[] = [];

        // Add enable Schedule without Task created by his and 
        aResults.forEach( oTask => oTask.oSchedule ? aFromSchedule.push(oTask.oSchedule) : null );
        Object.values( Schedule.getAll() )
            .filter( oSchedule => oSchedule.oCustomer.bEnable && aFromSchedule.indexOf(oSchedule) == -1 && oSchedule.oWeekType.fFilter(Item.nWeek) )
            .forEach( oSchedule => aResults.push( Task.from( oSchedule, Item.aDates[oSchedule.nDay] ) ) );

        return aResults;
    } );

    const aTasksGrouped = $derived.by( () => {
        const aReturn: TObject[] = [],
            oDays: TObject<Task[]> = {};
        
        // Add Group for Today
        if( Item.nNow >= 0 ){
            oDays[Item.nNow] = [];
        }

        // Group and Sort
        aTasks
            .sort( (oA, oB) => oA.nTimeStart - oB.nTimeStart )
            .forEach( oTask => {
                let nDay = oTask.nDay;
                if( !oDays[nDay] ){
                    oDays[nDay] = [];
                }
                oDays[nDay].push(oTask);
            } );

        Object.keys(oDays)
            .sort( (sA, sB) => sA.localeCompare(sB, 'fr', { numeric: true }) )
            .forEach( sDay => {
                const nDay = parseInt(sDay),
                    dDate = Item.aDates[nDay];

                aReturn.push( {
                    sDay: CONFIG.CALENDAR_DAYS[dDate.getDay()] + ' ' + dDate.getDate(),
                    sMonth: CONFIG.CALENDAR_MONTHS_ABBR[dDate.getMonth()] + ' ' + dDate.getFullYear(),
                    aTasks: oDays[sDay],
                    bToday: Item.nNow == nDay
                } );
            } );

        return aReturn;
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item).with(console.log);
    }
</script>

{#each aTasksGrouped as oGroup}
    <section class="bulma-block">
        <div class="fox-separator">
            <span>
                {#if oGroup.bToday}
                    <span class="bulma-tag bulma-is-white bulma-mr-2">Aujourd'hui</span>
                {/if}
                {oGroup.sDay}
                <span class="bulma-is-size-7">{oGroup.sMonth}</span>
            </span>
        </div>
        <section class="fox-list">
            {#each oGroup.aTasks as oTask}
                <ItemTask sType="list" Item={{ oTarget: oTask, click: () => Pages.oView.open(oTask) }}/>
            {:else}
                <div class="bulma-notification bulma-has-text-centered">
                    <span class="bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </span>
                        <span>Aucune tâche ! Bonne journée XO</span>
                    </span>
                </div>
            {/each}
        </section>
    </section>
{:else}
    <div class="bulma-notification bulma-has-text-centered">
        <span class="bulma-icon-text">
            <span class="bulma-icon">
                <i class="fa-solid fa-calendar-xmark"></i>
            </span>
            <span>Aucune tâche trouvée</span>
        </span>
    </div>
{/each}

<style>
</style>