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

{#if sType == 'calendar-week'}
    <button
        id="{Item.oTarget.sId}" 
        class="fox-calendar-week-task bulma-is-size-7 bulma-button bulma-is-light {Item.oTarget.oState.sClass}"
        style="{Object.keys(Item.oStyle).map(sStyle => `${sStyle}: ${Item.oStyle[sStyle]}`).join(';')}"
        title="Voir une tâche"
        onclick={Item.click}
    >
        {#if Item.oTarget.bService}
            <span class="bulma-icon bulma-is-small">
                <i class="fa-solid {Item.oTarget.oState.sTag}"></i>
            </span>
            {Item.oTarget.sDuration}<br/>
            {Item.oTarget.oCustomer.sShortName}
        {:else}
            <span class="bulma-icon bulma-is-small">
                <i class="fa-solid fa-bell"></i>
            </span>
            <br/>
            {Item.oTarget.oCustomer.sShortName}
        {/if}
    </button>

{:else if sType == 'calendar-month'}
    <button
        id="{Item.oTarget.sId}"
        class="fox-calendar-month-task bulma-button bulma-is-small bulma-is-light {Item.oTarget.oState.sClass}"
        title="Voir une tâche"
        onclick={Item.click}
    >
        <div class="fox--has-text-ellipsis">{Item.oTarget.oCustomer.sShortName}</div>
        <div class="bulma-icon-text bulma-is-align-items-center bulma-is-justify-content-center">
            <span class="bulma-icon bulma-is-small">
                <i class="fa-solid {Item.oTarget.bService ? Item.oTarget.oState.sTag : 'fa-bell'}"></i>
            </span>
            <span>{Item.oTarget.sTimeStart.replace(':', 'h')}</span>
        </div>
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
                    <i class="fa-solid fa-xl { Item.oTarget.bService ? 'fa-calendar-day' : 'fa-bell'}"></i>
                </span>
                <div class="bulma-ml-3 bulma-has-text-left">
                    <p>{Item.oTarget.oCustomer.sName}</p>
                    <p class="bulma-is-size-7">
                        {#if Item.oTarget.bService}
                            {Item.oTarget.sTime} -> {Item.oTarget.sDuration}
                        {:else}
                            {Item.oTarget.sTimeStart.replace(':', 'h')} -> Rendez-vous
                        {/if}
                    </p>
                </div>
            </div>
        </button>
    </article>

{:else if sType == 'tablerow'}
    <tr class="fox-table-task bulma-has-text-right">
        <td class="bulma-has-text-left">
            <span class="bulma-tag bulma-is-light bulma-icon-text {Item.oTarget.oState.sClass}">
                <span class="bulma-icon bulma-is-small">
                    <i class="fa-solid {Item.oTarget.oState.sTag}"></i>
                </span>
                <span>{Item.oTarget.sShortDate}</span>
            </span>
        </td>
        <td class="bulma-has-text-left">{Item.oTarget.sTime + ' -> ' + Item.oTarget.sDuration}</td>
        <!-- <td>{@html Item.oTarget.wrapToStateTag(Item.oTarget.sPrice + '&nbsp;€/h')}</td> -->
        <td class="bulma-is-size-6">{@html Item.oTarget.wrapToStateTag(Item.oTarget.sTotalPrice + '&nbsp;€')}</td>
    </tr>
{/if}

<style>
    .fox-calendar-week-task {
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

    .fox-calendar-week-task .bulma-icon {
        position: absolute;
        top: 8px;
        left: 0;
    }

    .fox-calendar-month-task {
        font-size: 0.5rem;
        white-space: normal;

        display: block;
        width: calc(100% - 2px);
        
        margin: 1px;
        padding: calc(var(--bulma-button-padding-vertical) - 1px);
        border-width: 1px;
    }

    @media screen and (max-width: 768px) {
        .fox-calendar-month-task {
            max-width: 45px;
            margin: 1px auto;
        }
    }

    .fox-calendar-month-task .bulma-icon-text {
        line-height: initial;
    }

    .fox-calendar-month-task .bulma-icon {
        transform: translateX(2.5px);
    }

    .fox-table-task td {
        vertical-align: middle;
    }
</style>