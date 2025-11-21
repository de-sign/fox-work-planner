<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CONFIG } from '../../Core/Config';

    /* -- Style */

    /* ---- Component */
    let {
        App,
        sContentSelected
    } = $props();
</script>

<aside class="fox-app-menu">
    <!-- Background -->
    <button class="fox-app-menu-background bulma-is-clickable" onclick={App.oMenu.close} title="Fermer"></button>
    <!-- Content -->
    <div class="fox-app-menu-content bulma-container bulma-is-max-tablet bulma-card">

        <header class="bulma-hero bulma-is-small">
            <div class="bulma-hero-head bulma-has-text-right">
                <button class="bulma-button bulma-is-ghost bulma-has-text-current"
                    onclick={App.oMenu.close}
                >
                    <span class="bulma-icon-text">
                        <!--<span>Fermer</span>--> 
                        <span class="bulma-icon">
                            <i class="fa-solid fa-xmark"></i>
                        </span>
                    </span>
                </button>
            </div>
            <div class="bulma-hero-body">
                <h1 class="bulma-title">Work Planner</h1>
                <h2 class="bulma-subtitle">Plan your working hours</h2>
            </div>
        </header>
        
        <div class="bulma-card-content">
            <section class="bulma-menu">
            	{#each CONFIG.MENU_LIST_ITEMS as oMenuList}
                    <p class="bulma-menu-label">{@html oMenuList.sLabel}</p>
                    <ul class="bulma-menu-list">
            	        {#each oMenuList.aItems as oMenuItem}
                            {#if oMenuItem.bIsComponent}
                                <oMenuItem.oComponent />
                            {:else}
                                <li>
                                    <!-- svelte-ignore a11y_invalid_attribute -->
                                    <a href="#" class={ oMenuItem.sContent == sContentSelected ? 'bulma-is-active' : ''} onclick="{ () => App.oContent.change(oMenuItem.sContent) }" >
                                        {oMenuItem.sLabel}
                                    </a>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                {/each}
            </section>
        </div>

    </div>
</aside>

<style>
    .fox-app-menu-background {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>