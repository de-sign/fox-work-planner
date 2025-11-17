<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import Store from '../../Core/Store';
    import { PROPERTY_NAME } from '../../Core/Constants';

    /* -- Svelte */
    import * as Svelte from 'svelte';

    /* ---- Component */
    /* -- Theme Switch */
    let bDarkMode = $state(!!Store.get(PROPERTY_NAME.APP_DARK_MODE));

    function updateTheme(bValue?: boolean): void {
        if( bDarkMode != bValue ){
            if( bValue !== undefined ){
                bDarkMode = bValue;
            }
            document.documentElement.dataset.bulmaTheme = bDarkMode ? 'dark' : 'light';
            Store.set(PROPERTY_NAME.APP_DARK_MODE, bDarkMode);
        }
    }

    Svelte.onMount( () => updateTheme() );

</script>

<li class="fox-app-menu-theme">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" class="bulma-is-flex bulma-is-align-items-center">
        <span class="bulma-is-flex-grow-1">Thème</span>
        <div class="fox-app-menu-theme-buttons bulma-is-flex-grow-0 bulma-buttons bulma-has-addons">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span class="bulma-button {bDarkMode ? 'bulma-is-hovered' : 'bulma-is-link bulma-is-selected'}" onclick={ () => updateTheme(false) } title="Thème clair">
                <span class="bulma-icon bulma-is-small">
                    <i class="fa-solid fa-sun"></i>
                </span>
            </span>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span class="bulma-button {bDarkMode ? 'bulma-is-link bulma-is-selected' : 'bulma-is-hovered'}" onclick={ () => updateTheme(true) } title="Thème sombre">
                <span class="bulma-icon bulma-is-small">
                    <i class="fa-solid fa-moon"></i>
                </span>
            </span>
        </div>
    </a>
</li>

<style>
    .fox-app-menu-theme-buttons {
        /* --bulma-menu-list-link-padding: 0.5em 0.75em; */
        margin: -0.5em -0.75em -0.5em 0.5em;
    }
</style>