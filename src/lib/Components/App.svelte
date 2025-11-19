<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../Core/Type';
    import { CONFIG } from '../Core/Config';

    /* -- Svelte */
    import Menu from './Menu/Menu.svelte';

    /* -- Style */
    
    /* ---- Component */
    /* -- Content Component */
    let hContent: HTMLElement | null = $state(null),
        sContentSelected: string = $state(CONFIG.CONTENT_DEFAULT),
        oContentSelected: TObject = $derived(CONFIG.CONTENT_ITEMS[sContentSelected]);

    function changeContent(sValue: string) {
        if( sContentSelected != sValue ){
            sContentSelected = sValue;
            closeMenu();
            resetPages();
        }
    }

    /* -- Menu Opening */
    let bOpenMenu: boolean = $state(false);

    function openMenu(): void {
        bOpenMenu = true;
    }

    function closeMenu(): void {
        bOpenMenu = false;
    }

    /* -- Content Page */
    let aPagesHistory : number[] = [],
        nPageSelected: number = $state(1),
        nMaxPage: number = $derived(oContentSelected.nPagesCount);

    function openPage(nValue: number, bScrollTop: boolean = false) {
        nValue = Math.min( Math.max(1, nValue), nMaxPage );
        if( nPageSelected != nValue ){
            aPagesHistory.push(nPageSelected);
            nPageSelected = nValue;
            if( bScrollTop && hContent ){
                hContent.querySelectorAll('.fox-app-page-content')[nPageSelected - 1]?.scrollTo(0, 0);
            }
        }
    }

    function backPage(): void {
        const nLastPage = aPagesHistory.pop();
        if( nLastPage ){
            openPage(nLastPage);
            aPagesHistory.pop();
        }
    }

    function nextPage(): void {
        openPage(nPageSelected + 1);
    }

    function previousPage(): void {
        openPage(nPageSelected - 1);
    }

    function resetPages(): void {
        openPage(1);
        aPagesHistory = [];
    }

    /* ---- App Wrapper */
    const oApp = {
        oContent: {
            change: changeContent
        },
        oMenu: {
            open: openMenu,
            close: closeMenu
        },
        oPage: {
            open: openPage,
            next: nextPage,
            previous: previousPage,
            back: backPage
        }
    };

</script>

<div class="fox-app-view { bOpenMenu ? 'fox-app--is-menu-open' : '' }" >
    <!-- Menu -->
    <Menu
        sContentSelected={sContentSelected}
    
        App={oApp}
    />
    <!-- Main content -->
    <main class="fox-app-content">
        <div bind:this="{hContent}" class="fox-app-pages fox-app--has-{nMaxPage}-pages fox-app--is-page-{nPageSelected}">
            <!-- Selected tab content -->
            {#key oContentSelected.oComponent}
                <oContentSelected.oComponent App={oApp} />
            {/key}
        </div>
    </main>
</div>

<style>
    .fox-app-content {
        overflow: hidden;
    }
</style>