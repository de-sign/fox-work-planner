<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../../Core/Type';
    import { CONFIG } from '../../Core/Config';

    /* -- Content */
    import Schedule from '../../Class/Schedule.svelte';

    import Item from './Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    const aSchedules = $derived( Object.values( Schedule.getAll() ).filter( oSchedule => oSchedule.oCustomer.bEnable ) ),
        aSchedulesGrouped = $derived.by( () => {
            const aReturn: TObject[] = [],
                oDays: TObject<Schedule[]> = {};
            
            // Group and Sort
            aSchedules
                .sort( (oA, oB) => oA.nTimeStart - oB.nTimeStart )
                .forEach( oSchedule => {
                    let nDay = oSchedule.nDay;
                    if( !oDays[nDay] ){
                        oDays[nDay] = [];
                    }
                    oDays[nDay].push(oSchedule);
                } );

            Object.keys(oDays)
                .sort( (sA, sB) => sA.localeCompare(sB, 'fr', { numeric: true }) )
                .forEach( sDay => {
                    aReturn.push( {
                        sDay: CONFIG.CALENDAR_DAYS[parseInt(sDay)],
                        aSchedules: oDays[sDay]
                    } )
                } );

            return aReturn;
        } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(uVariable).with(console.trace);
    }
</script>

{#each aSchedulesGrouped as oGroup}
    <section class="bulma-block">
        <div class="fox-separator">
            <span>{oGroup.sDay}</span>
        </div>
        <section class="fox-list">
            {#each oGroup.aSchedules as oSchedule}
                <Item sType="list" Item={{ oTarget: oSchedule, click: () => Pages.oView.open(oSchedule) }}/>
            {/each}
        </section>
    </section>
{:else}
    <div class="bulma-notification bulma-has-text-centered">
        <span class="bulma-icon-text">
            <span class="bulma-icon">
                <i class="fa-solid fa-calendar-xmark"></i>
            </span>
            <span>Aucune planification trouvée</span>
        </span>
    </div>
{/each}

<style>
</style>