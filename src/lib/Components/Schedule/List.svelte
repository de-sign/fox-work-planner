<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../../Core/Type';
    import { CUSTOMER_PAGE, SCHEDULE_FORM_TYPE, SCHEDULE_WEEK_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import Customer from '../../Class/Customer.svelte';
    import Schedule from '../../Class/Schedule.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    const bCustomers = Customer.hasCustomers(),
        oSchedules = Schedule.getAll(),
        aSchedulesGrouped = $derived.by( () => {
            const aCopySchedule: Schedule[] = Object.values(oSchedules),
                aReturn: TObject[] = [],
                oDays: TObject<Schedule[]> = {};
            
            // Group and Sort
            aCopySchedule
                .sort( (oA, oB) => oA.nTimeStart - oB.nTimeStart )
                .forEach( oSchedule => {
                    let nDay = oSchedule.nDay;
                    if( !oDays[nDay] ){
                        oDays[nDay] = [];
                    }
                    oDays[nDay].push(oSchedule);
                } );

            console.log(oDays);

            Object.keys(oDays)
                .sort( (sA, sB) => sA.localeCompare(sB, 'fr', { numeric: true }) )
                .forEach( sDay => {
                    aReturn.push( {
                        sDay: CONFIG.SCHEDULE_CALENDAR_DAYS[parseInt(sDay) - 1],
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

<section class="fox-app-page">

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <div class="bulma-block">
                <h1 class="bulma-title">Emploi du temps</h1>
                <h2 class="bulma-subtitle">Définis ta semaine type</h2>
            </div>

            {#if bCustomers}

                <div class="bulma-buttons bulma-has-addons bulma-is-justify-content-flex-end">
                    <button class="bulma-button bulma-is-hovered" onclick="{ () => Pages.oDisplay.change('calendar') }" title="Affichage calendrier">
                        <span class="bulma-icon bulma-is-small">
                            <i class="fa-solid fa-calendar"></i>
                        </span>
                    </button>
                    <div class="bulma-button bulma-is-link bulma-is-selected" title="Affichage liste">
                        <span class="bulma-icon bulma-is-small">
                            <i class="fa-solid fa-list"></i>
                        </span>
                    </div>
                </div>

                {#if aSchedulesGrouped.length}
                    {#each aSchedulesGrouped as oGroup}
                        <section class="bulma-block">

                            <div class="fox-separator">
                                <span>{oGroup.sDay}</span>
                            </div>

                            <section class="fox-schedule-list">
                                {#each oGroup.aSchedules as oSchedule}
                                    <article class="fox-schedule-list-item">
                                        <button class="bulma-box" onclick={ () => Pages.oView.open(oSchedule) }>
                                            <div class="bulma-icon-text">
                                                {#if oSchedule.sWeekType != 'EVERY_WEEK'}
                                                    <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon-text">
                                                        <span class="bulma-icon bulma-is-small">
                                                            <i class="fa-solid fa-calendar-week"></i>
                                                        </span>
                                                        <span>{ CONFIG.SCHEDULE_CALENDAR_WEEK_TYPE[ SCHEDULE_WEEK_TYPE[oSchedule.sWeekType as keyof typeof SCHEDULE_WEEK_TYPE] ].sTag }</span>
                                                    </span>
                                                {/if}

                                                <span class="bulma-icon">
                                                    <i class="fa-solid fa-calendar-day fa-xl"></i>
                                                </span>
                                                <div class="bulma-ml-3 bulma-has-text-left">
                                                    <p>{oSchedule.oCustomer.sName}</p>
                                                    <p class="bulma-is-size-7">{oSchedule.sTimeStart.replace(':', 'h')} - {oSchedule.sTimeEnd.replace(':', 'h')} -> {oSchedule.sDuration}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </article>
                                {/each}
                            </section>

                        </section>
                    {/each}

                {:else}
                    <div class="bulma-notification bulma-has-text-centered">
                        <span class="bulma-icon-text">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-calendar-xmark"></i>
                            </span>
                            <span>Aucune heure programmée trouvée</span>
                        </span>
                    </div>
                {/if}

            {:else}
                <div class="bulma-notification bulma-has-text-centered">
                    <span class="bulma-block bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-slash"></i>
                        </span>
                        <span>Aucun client trouvé</span>
                    </span>
                </div>
                <p class="fox-calendar-notification bulma-block">
                    Tu dois d'abord créer un
                    <button class="bulma-block bulma-button bulma-is-small" onclick="{ () => App.oContent.change('Customer', CUSTOMER_PAGE.FORM) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </span>
                        <span>client</span>
                    </button>
                    avant de pouvoir lui ajouter une heure programmée !
                </p>
            {/if}
        </div>
    </div>

    <!-- Navbar -->
     <nav class="fox-app-page-navbar bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button bulma-is-hovered" onclick={App.oMenu.open} >
                    <span class="bulma-icon">
                        <i class="fa-solid fa-bars"></i>
                    </span>
                    <span>Menu</span>
                </button>
            </div>
            <div class="fox-app-page-navbar-item">
                {#if bCustomers}
                    <button class="bulma-button bulma-is-link" onclick="{ () => Pages.oForm.open(SCHEDULE_FORM_TYPE.NEW_SCHEDULE) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-plus"></i>
                        </span>
                        <span>Ajouter</span>
                    </button>
                {:else}
                    <button class="bulma-button bulma-is-link" onclick="{ () => App.oContent.change('Customer', CUSTOMER_PAGE.FORM) }">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </span>
                        <span>Ajouter</span>
                    </button>
                {/if}
            </div>
        </div>
    </nav>
</section>

<style>
</style>