<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CONFIG } from '../../Core/Config';

    import Customer from '../../Class/Customer.svelte';

    /* ---- Component */
    let {
        Item
    } = $props();

    const sIcon = $derived( Item.oTarget instanceof Customer ? 'fa-user-tie fa-xl' : 'fa-user-group fa-lg' );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item).with(console.trace);
    }
</script>

<article class="fox-list-item">
    <button class="bulma-box" onclick={Item.click}>
        {#if Item.oTarget.bHasKey}
            <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon">
                <i class="fa-solid fa-key"></i>
            </span>
        {/if}
        <span class="bulma-icon-text">
            <span class="bulma-icon">
                <i class="fa-solid {sIcon}"></i>
            </span>
            <span class="bulma-mx-2">{Item.oTarget.sName}</span>
        </span>
    </button>
</article>

<style>
</style>