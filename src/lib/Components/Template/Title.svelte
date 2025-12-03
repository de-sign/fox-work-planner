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

<!-- Page Title -->
<header class="fox-app-page-title bulma-section">
    <div class="bulma-container bulma-is-max-tablet">

        <!-- Title + SubTitle -->
        <div class="fox-app-page-title-item">
            <h1 class="bulma-title { Item.aButtons ? '' : 'fox--has-text-ellipsis' }">{@html Item.sTitle}</h1>
            <h2 class="bulma-subtitle { Item.aButtons ? '' : 'fox--has-text-ellipsis' }">{@html Item.sSubTitle}</h2>
        </div>

        <!-- Buttons -->
        {#if Item.aButtons}
            <div class="fox-app-page-title-item { Item.aButtons.length > 1 ? 'bulma-buttons bulma-has-addons' : '' }">
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
</header>

<style>
</style>