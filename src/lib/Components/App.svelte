<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../Core/Type';
    import { CONFIG } from '../Core/Config';
    import { COMPONENTS } from '../Core/Import';

    import EventEmitter from 'eventemitter3';

    /* -- Svelte */
    import Menu from './Menu/Menu.svelte';
    Object.values(CONFIG.CONTENT_ITEMS).forEach( oContentItem => {
        oContentItem.oComponent = COMPONENTS[ oContentItem.sComponent ];
    } );
    
    /* ---- Component */
    /* -- Content Component */
    let hContent: HTMLElement | null = $state(null),
        sContentSelected: string = $state(CONFIG.CONTENT_DEFAULT),
        oContentSelected: TObject = $derived(CONFIG.CONTENT_ITEMS[sContentSelected]);

    function changeContent(sValue: string, nPage?: number): void {
        if( sContentSelected != sValue ){
            sContentSelected = sValue;
            if( nPage == undefined ){
                resetPages();
            } else {
                openPage(nPage);
            }
        }
        closeMenu();
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

    function openPage(nValue: number, bScrollTop: boolean = false): void {
        nValue = Math.min( Math.max(1, nValue), nMaxPage );
        if( nPageSelected != nValue ){
            aPagesHistory.push(nPageSelected);
            nPageSelected = nValue;
            if( bScrollTop && hContent ){
                hContent.querySelectorAll( CONFIG.CONTENT_PAGE_SCROLLTOP_SELECTOR )[nPageSelected - 1]?.scrollTo(0, 0);
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

    /* ---- App Encapsulation */
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
        },
        oEmitter: new EventEmitter()
    };

</script>

<div class="fox-app-view { bOpenMenu ? 'fox-app--has-menu-open' : '' }" >
    <!-- Menu -->
    <Menu
        sContentSelected={sContentSelected}
    
        App={oApp}
    />
    <!-- Main content -->
    <main class="fox-app-content">
        <div bind:this="{hContent}" class="fox-app-pages fox-app--has-{nMaxPage}-pages fox-app--is-page-{nPageSelected}">
            <!-- Selected tab content -->
            <oContentSelected.oComponent App={oApp} />
        </div>
    </main>
</div>

<style>
    .fox-app-content {
        overflow: hidden;
    }
</style>