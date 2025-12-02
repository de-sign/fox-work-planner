<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../Core/Type';
    import { CUSTOMER_FORM_TYPE } from '../Core/Constants';
    import { CONFIG } from '../Core/Config';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();
    
    /* TODO Component script */
    function callToAction(): void {
        alert('Vous avez pressé sur le bouton Call To Action :D');
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
            <div class="fox-app-title">
                <h1 class="bulma-title">Template</h1>
                <h2 class="bulma-subtitle">Page modèle pour création de composant rapide</h2>
            </div>
            <div class="bulma-content">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam eligendi sequi veniam odio.
                    Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                </p>
            </div>
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
                <button class="bulma-button bulma-is-link" onclick="{callToAction}">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-plus"></i>
                    </span>
                    <span>Call to Action</span>
                </button>
            </div>
        </div>
    </nav>
</section>

<style>
</style>