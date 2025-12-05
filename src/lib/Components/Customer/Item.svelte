<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CONFIG } from '../../Core/Config';

    import Customer from '../../Class/Customer.svelte';

    /* ---- Component */
    let {
        Item
    } = $props();

    const oIcons = $derived(
        Item.bEnable ? 
            {
                sCustomer: 'fa-user-tie fa-xl',
                sContact: 'fa-user-group fa-lg'
            } : {
                sCustomer: 'fa-user-slash fa-xl',
                sContact: 'fa-users-slash fa-lg'
            }
        ),
        sIcon = $derived( Item.oTarget instanceof Customer ? oIcons.sCustomer : oIcons.sContact );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item).with(console.trace);
    }
</script>

<article id="{Item.oTarget.sId}" class="fox-list-item { Item.bEnable ? '' : 'fox-customer-disable' }">
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
    .fox-customer-disable .bulma-box {
        background-color: transparent;
        border: 1px solid var(--bulma-border);
        box-shadow: none;
        margin: -1px;
    }
</style>