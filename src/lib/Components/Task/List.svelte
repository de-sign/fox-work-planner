<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../../Core/Type';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import * as DATE from '../../Core/Date';

    /* -- Content */
    import Task from '../../Class/Task.svelte';
    import ItemTask from './Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages,
        Item
    } = $props();

    const dDateNow = DATE.getToday(),
        aTasksGrouped = $derived.by( () => {
            const aReturn: TObject[] = [],
                oTasksByDate: TObject<Task[]> = {},
                sMonthKey = Item.dDate.getMonth() + '_' + Item.dDate.getFullYear(),
                sDateNow = DATE.toISO8601(dDateNow);
            
            // Add Group for Today
            if( dDateNow.getMonth() + '_' + dDateNow.getFullYear() == sMonthKey ){
                oTasksByDate[sDateNow] = [];
            }

            // Group and Sort
            (<Task[]>Item.aTasks)
                .forEach( oTask => {
                    if( oTask.sMonthKey == sMonthKey ){
                        let sDate = oTask.sDate;
                        if( !oTasksByDate[sDate] ){
                            oTasksByDate[sDate] = [];
                        }
                        oTasksByDate[sDate].push(oTask);
                    }
                } );

            Object.keys(oTasksByDate)
                .sort( (sA, sB) => sA.localeCompare(sB, 'fr', { numeric: true }) )
                .forEach( sDate => {
                    const dDate = new Date(sDate);

                    aReturn.push( {
                        sDay: CONFIG.CALENDAR_DAYS[dDate.getDay()] + ' ' + dDate.getDate(),
                        sMonth: CONFIG.CALENDAR_MONTHS_ABBR[dDate.getMonth()] + ' ' + dDate.getFullYear(),
                        aTasks: oTasksByDate[sDate],
                        bToday: sDate == sDateNow
                    } );
                } );

            return aReturn;
        } );

    function scrollIntoViewToday() {
        
        const hToday = document.querySelector('.fox-list--is-today'),
            hBefore = hToday?.previousElementSibling;

        hBefore?.querySelector('.bulma-is-invisible')?.scrollIntoView(true);
    }

    Svelte.onMount( () => { App.oEmitter.on('fox-app-page--change-date', scrollIntoViewToday); scrollIntoViewToday(); } );
    Svelte.onDestroy( () => App.oEmitter.removeListener('fox-app-page--change-date', scrollIntoViewToday) );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item.aTasks).with(console.log);
    }
</script>

{#each aTasksGrouped as oGroup}
    <section class={ ['bulma-block', { 'fox-list--is-today': oGroup.bToday }] } >
        <div class="fox-separator">
            <span>
                {#if oGroup.bToday}
                    <span class="bulma-tag bulma-is-link bulma-is-light bulma-mr-2">Aujourd'hui</span>
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
        <div class="bulma-is-invisible"></div>
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