<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CONFIG } from '../../Core/Config';

    /* ---- Component */
    let {
        sType,

        Item
    } = $props();

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(Item).with(console.trace);
    }
</script>

{#if sType == 'calendar'}
    <button
        title="Voir une heure programmée"
        class="fox-calendar-task bulma-button bulma-is-link bulma-is-light bulma-is-size-7"
        style="{Object.keys(Item.oStyle).map(sStyle => `${sStyle}: ${Item.oStyle[sStyle]}`).join(';')}"
        onclick={Item.click}
    >
        {#if Item.oTarget.sWeekType == 'EVERY_WEEK'}
            {Item.oTarget.sDuration}<br/>
            {Item.oTarget.oCustomer.sShortName}
        {:else}
            {Item.oTarget.oCustomer.sShortName} - {Item.oTarget.sDuration}
        {/if}
    </button>

{:else if sType == 'list'}
    <article class="fox-list-item">
        <button class="bulma-box" onclick={Item.click}>
            <div class="bulma-icon-text">
                {#if Item.oTarget.sWeekType != 'EVERY_WEEK'}
                    <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon-text">
                        <span class="bulma-icon bulma-is-small">
                            <i class="fa-solid fa-calendar-week"></i>
                        </span>
                        <span>{Item.oTarget.oWeekType.sTag}</span>
                    </span>
                {/if}

                <span class="bulma-icon">
                    <i class="fa-solid fa-calendar-day fa-xl"></i>
                </span>
                <div class="bulma-ml-3 bulma-has-text-left">
                    <p>{Item.oTarget.oCustomer.sName}</p>
                    <p class="bulma-is-size-7">{Item.oTarget.sTime} -> {Item.oTarget.sDuration}</p>
                </div>
            </div>
        </button>
    </article>
    
{:else if sType == 'simple'}
    <div>
        <b>{Item.oTarget.sDay} : </b>
        {#if Item.oTarget.sWeekType != 'EVERY_WEEK'}
            <span class="bulma-tag bulma-is-link bulma-is-light bulma-icon-text">
                <span class="bulma-icon bulma-is-small">
                    <i class="fa-solid fa-calendar-week"></i>
                </span>
                <span>{Item.oTarget.oWeekType.sTag}</span>
            </span>
        {/if}
        {Item.oTarget.sTime}<i class="bulma-is-size-7">-> {Item.oTarget.sDuration}</i>
    </div>
{/if}

<style>
    .fox-calendar-task {
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 1px;
        right: 1px;
        z-index: 10;

        border-width: 1px;
        padding: calc(var(--bulma-button-padding-vertical) - var(--bulma-button-border-width)) 0;
        
        display: block;
        writing-mode: vertical-lr;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>