<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../Core/Type';
    import { EVENT_NAME } from '../Core/Constants';
    import { CONFIG } from '../Core/Config';
    import { COMPONENTS } from '../Core/Import';

    import EventEmitter from 'eventemitter3';
    import * as Svelte from 'svelte';

    /* -- Svelte */
    import Menu from './Menu/Menu.svelte';
    Object.values(CONFIG.CONTENT_ITEMS).forEach( oContentItem => {
        oContentItem.oComponent = COMPONENTS[ oContentItem.sComponent ];
    } );
    
    
    /* ---- Component */
    /* -- Menu Opening */
    let bOpenMenu: boolean = $state(false);

    function openMenu(): void {
        bOpenMenu = true;
    }

    function closeMenu(): void {
        bOpenMenu = false;
    }


    // -- History */
    let bBackwardHistory = false;
    function addHistoryEntrie(oData: TObject, bReplace: boolean = false): boolean {
        if( !bBackwardHistory ){
            const oState: TObject = Object.assign(
                    {
                        sContent: sContentSelected,
                        nPage: nPageSelected
                    },
                    oData
                ),
                oURL = new URL(
                    oContentSelected.URL[nPageSelected].replaceAll(
                        /\$\{(.*?)\}/g,
                        (sMatch: string, sCatch: string) => oState[sCatch] || '.'
                    ) + '#',
                    window.location.origin
                );

            if(bReplace) {
                history.replaceState(oState, '', oURL);
            } else {
                history.pushState(oState, '', oURL);
            }
        }

        return !bBackwardHistory;
    }

    window.addEventListener('popstate', (oEvent) => {
        bBackwardHistory = true;
        changePage( oEvent.state.sContent );
        Svelte.tick().then( () => {
            oApp.oEmitter.emit(EVENT_NAME.URL_REDIRECTION + '_' + oEvent.state.sContent + '_' + oEvent.state.nPage, oEvent.state);
            bBackwardHistory = false;
            oApp.oEmitter.emit(EVENT_NAME.URL_REDIRECTION_SUCCESS);
        } );
    }, false);

    Svelte.onMount( () => addHistoryEntrie({}, true) );


    /* -- Content Component and Page */
    let hContent: HTMLElement | null = $state(null),
        sContentSelected: string = $state(CONFIG.CONTENT_DEFAULT),
        oContentSelected: TObject = $derived(CONFIG.CONTENT_ITEMS[sContentSelected]),
        nPageSelected: number = $state(1),
        nMaxPage: number = $derived(oContentSelected.nPagesCount);

    function changePage(sValue: string): void {
        if( sContentSelected != sValue ){
            sContentSelected = sValue;
            nPageSelected = 0;
            openPage(1);
        }
        closeMenu();
    }

    function openPage(nValue: number, oDataHistory: TObject = {}, bForce: boolean = false): void {
        nValue = Math.min( Math.max(1, nValue), nMaxPage );
        if( bForce || nPageSelected != nValue ){
            nPageSelected = nValue;
            
            if( addHistoryEntrie(oDataHistory) ){
                scrollTop();
            }
        }
    }

    function backPage(): Promise<void> {
        return new Promise( ( fResolve: Function ) => {
            oApp.oEmitter.once(EVENT_NAME.URL_REDIRECTION_SUCCESS, () => fResolve() );
            history.back();
        } );
    }

    function nextPage(oDataHistory: TObject = {}): void {
        openPage(nPageSelected + 1, oDataHistory);
    }

    function previousPage(oDataHistory: TObject = {}): void {
        openPage(nPageSelected - 1, oDataHistory);
    }

    function scrollTop(): void {
        hContent?.querySelectorAll( CONFIG.CONTENT_PAGE_SCROLLTOP_SELECTOR )[nPageSelected - 1]?.scrollTo(0, 0);
    }

    
    /* ---- App Encapsulation */
    const oApp = {
        oMenu: {
            open: openMenu,
            close: closeMenu
        },
        oHistory: {
            add: addHistoryEntrie
        },
        oPage: {
            change: changePage,
            open: openPage,
            next: nextPage,
            previous: previousPage,
            back: backPage,
            scrollTop: scrollTop
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
        <div bind:this={hContent} class="fox-app-pages fox-app--has-{nMaxPage}-pages fox-app--is-page-{nPageSelected}">
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