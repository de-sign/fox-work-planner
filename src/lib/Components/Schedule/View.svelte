<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import { SCHEDULE_WEEK_TYPE, SCHEDULE_FORM_TYPE, SCHEDULE_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import Contact from '../../Class/Contact.svelte';
    import Schedule from '../../Class/Schedule.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();
    
    let oTarget: Schedule = $state(Schedule.oPlaceholder),
        oContactView: Contact = $derived( oTarget.oCustomer.oMainContact ),
        oWeekType = $derived( CONFIG.SCHEDULE_CALENDAR_WEEK_TYPE[ SCHEDULE_WEEK_TYPE[oTarget.sWeekType as keyof typeof SCHEDULE_WEEK_TYPE] ] ),
        sDay = $derived( CONFIG.SCHEDULE_CALENDAR_DAYS[oTarget.nDay - 1] );

    export function open(oNewTarget: Schedule) {
        oTarget = oNewTarget;
        App.oPage.open(SCHEDULE_PAGE.VIEW, true);
    }

    /* ---- Modal */
    let bOpenModal: boolean = $state(false);
    function openModal(): void {
        bOpenModal = true;
    }

    function closeModal(): void {
        bOpenModal = false;
    }

    function remove(): void {
        closeModal();
        oTarget.destroy();
        oTarget = Schedule.oPlaceholder;
        App.oPage.back();
    }

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
                <h1 class="bulma-title fox-is-text-ellipsis">{sDay} chez {oContactView.sShortName}</h1>
                <h2 class="bulma-subtitle">
                    <span class="bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-clock"></i>
                        </span>
                        <span>Durée de {oTarget.sDuration}</span>
                    </span>
                </h2>
            </div>
            <div class="bulma-block bulma-is-italic">
                <p>Chez {oContactView.sName}</p>
                <p>Tous les {sDay}s</p>
                <p>{oWeekType.sDescription}</p>
            </div>
            <div class="bulma-block bulma-is-italic">
                <p>De {oTarget.sTimeStart.replace(':', 'h')} à {oTarget.sTimeEnd.replace(':', 'h')}</p>
                <p>Durée de {oTarget.sDuration}</p>
                <p>À {oTarget.sPrice} € de l'heure</p>
            </div>
            {#if oTarget.sInformations}
                <div class="bulma-block">
                    <div class="bulma-content bulma-is-small bulma-mb-2">
                        <blockquote>{oTarget.sInformations}</blockquote>
                    </div>
                </div>
            {/if}
            <div class="bulma-field bulma-is-grouped bulma-is-grouped-right">
                <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={openModal}>
                    <span class="bulma-icon">
                        <i class="fa-solid fa-calendar-xmark"></i>
                    </span>
                    <span>Supprimer</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Navbar -->
    <nav class="fox-app-page-navbar bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button bulma-is-hovered" onclick={App.oPage.back} >
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-left"></i>
                    </span>
                    <span>Retour</span>
                </button>
            </div>
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button" onclick="{ () => Pages.oForm.open(SCHEDULE_FORM_TYPE.MODIFY_SCHEDULE, oTarget) }">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-calendar-day"></i>
                    </span>
                    <span>Modifier</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Modal -->
    <aside class="bulma-modal bulma-is-justify-content-flex-end { bOpenModal ? 'bulma-is-active' : '' }" >
        <div class="bulma-modal-background"></div>
        <div class="bulma-modal-content">
            <div class="bulma-box bulma-p-5">
                <p class="bulma-block">
                    Es-tu sûr de vouloir supprimer cette heure programmée
                    de <b>{oTarget.sTimeStart.replace(':', 'h')}</b> à <b>{oTarget.sTimeEnd.replace(':', 'h')}</b>
                    pour <b>{oContactView.sName}</b>&nbsp;?
                </p>
                <div class="bulma-field bulma-is-grouped bulma-is-grouped-right">
                    <button class="bulma-button" onclick={closeModal}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-xmark"></i>
                        </span>
                        <span>Annuler</span>
                    </button>
                    <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={remove}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </span>
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        </div>
    </aside>
</section>

<style>
</style>