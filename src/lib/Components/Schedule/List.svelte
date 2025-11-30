<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../../Core/Type';
    import { CUSTOMER_PAGE, SCHEDULE_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import Customer from '../../Class/Customer.svelte';
    import Schedule from '../../Class/Schedule.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    const bCustomers = Customer.hasCustomers(),
        oSchedules = Schedule.getAll();

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

                <div class="bulma-content">
                    <h3>TODO List View</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsam eligendi sequi veniam odio.
                        Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                    </p>
                </div>

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