<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CONFIG } from '../../Core/Config';

    /* ---- Component */
    let {
        Item
    } = $props();

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item).with(console.trace);
    }
</script>

<!-- Page Navigation -->
<nav class="fox-app-page-navbar bulma-section">
    <div class="bulma-container bulma-is-max-tablet">

        <!-- Back Buttons -->
        <div class="fox-app-page-navbar-item">
            {#if Item.oBack}
                <button class="bulma-button bulma-is-hovered" onclick={Item.oBack.click} title="{Item.oBack.sTitle}" >
                    <span class="bulma-icon">
                        <i class="fa-solid {Item.oBack.sIcon}"></i>
                    </span>
                    {#if Item.oBack.sText}
                        <span>{Item.oBack.sText}</span>
                    {/if}
                </button>
            {/if}
        </div>

        <!-- Action Buttons -->
        {#if Item.aButtons}
            <div class="fox-app-page-navbar-item { Item.aButtons.length > 1 ? 'bulma-buttons bulma-has-addons' : '' }">
                {#each Item.aButtons as oButton}
                    {#if oButton.click}
                        <button class="bulma-button {oButton.sClass}" onclick="{oButton.click}" title="{oButton.sTitle}">
                            <span class="bulma-icon">
                                <i class="fa-solid {oButton.sIcon}"></i>
                            </span>
                            {#if oButton.sText}
                                <span>{oButton.sText}</span>
                            {/if}
                        </button>
                    {:else}
                        <div class="bulma-button {oButton.sClass}" title="{oButton.sTitle}">
                            <span class="bulma-icon">
                                <i class="fa-solid {oButton.sIcon}"></i>
                            </span>
                            {#if oButton.sText}
                                <span>{oButton.sText}</span>
                            {/if}
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</nav>

<style>
</style>