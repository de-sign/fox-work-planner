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
        id="{Item.oTarget.sId}" 
        class="fox-calendar-task bulma-is-size-7 bulma-button bulma-is-light {Item.oTarget.oState.sClass}"
        style="{Object.keys(Item.oStyle).map(sStyle => `${sStyle}: ${Item.oStyle[sStyle]}`).join(';')}"
        title="Voir une planification"
        onclick={Item.click}
    >
        <span class="bulma-icon bulma-is-small">
            <i class="fa-solid {Item.oTarget.oState.sTag}"></i>
        </span>
        {Item.oTarget.sDuration}<br/>
        {Item.oTarget.oCustomer.sShortName}
    </button>

{:else if sType == 'list'}
    <article id="{Item.oTarget.sId}" class="fox-list-item">
        <button class="bulma-box" onclick={Item.click}>
            <div class="bulma-icon-text">
                <span class="bulma-tag bulma-is-light bulma-icon-text {Item.oTarget.oState.sClass}">
                    <span class="bulma-icon bulma-is-small">
                        <i class="fa-solid {Item.oTarget.oState.sTag}"></i>
                    </span>
                </span>
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
    <div id="{Item.oTarget.sId}" >
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

    .fox-calendar-task .bulma-icon {
        position: absolute;
        top: 8px;
        left: 0;
    }
</style>