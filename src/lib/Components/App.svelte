<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../Core/Type';
    import { CONFIG } from '../Core/Config';

    /* -- Svelte */
    import Menu from './Menu/Menu.svelte';

    /* -- Style */
    
    /* ---- Component */
    /* -- Menu Opening */
    let bOpenMenu: boolean = $state(false);

    function openMenu(): void {
        bOpenMenu = true;
    }

    function closeMenu(): void {
        bOpenMenu = false;
    }

    /* -- Content Component */
    let hContent: HTMLElement | null = $state(null),
        sContentSelected: string = $state(CONFIG.CONTENT_DEFAULT),
        oContentSelected: TObject = $derived(CONFIG.CONTENT_ITEMS[sContentSelected]);

    function changeContent( sValue: string) {
        if( sContentSelected != sValue ){
            sContentSelected = sValue;
            goToPage(1);
            closeMenu();
        }
    }

    /* -- Content Page */
    let nPageSelected: number = $state(1),
        nMaxPage: number = $derived(oContentSelected.nPagesCount);

    function goToPage(nValue: number, bScrollTop: boolean = false) {
        if( nPageSelected != nValue ){
            nPageSelected = Math.min( Math.max(1, nValue), nMaxPage );
            if( bScrollTop && hContent ){
                hContent.querySelectorAll('.fox-app-page-content')[nPageSelected - 1]?.scrollTo(0, 0);
            }
        }
    }

</script>

<div class="fox-app-view { bOpenMenu ? 'fox-app--is-menu-open' : '' }" >
    <!-- Menu -->
    <Menu
        {sContentSelected}

        App_closeMenu={closeMenu}
        App_changeContent={changeContent}
    />
    <!-- Main content -->
    <main class="fox-app-content">
        <div bind:this="{hContent}" class="fox-app-pages fox-app--has-{nMaxPage}-pages fox-app--is-page-{nPageSelected}">
            <!-- Selected tab content -->
            {#key oContentSelected.oComponent}
                <oContentSelected.oComponent
                    App_openMenu={openMenu}
                    App_goToPage={goToPage}
                />
            {/key}
        </div>
    </main>
</div>

<style>
    .fox-app-content {
        overflow: hidden;
    }
</style>