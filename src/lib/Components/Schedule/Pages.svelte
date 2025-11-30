<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { Component } from 'svelte';
    import { PROPERTY_NAME } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import Store from '../../Core/Store';
    
    /* -- Svelte */
    import List from './List.svelte';
    import Calendar from './Calendar.svelte';
    import View from './View.svelte';
    import Form from './Form.svelte';

    /* ---- Component */
    let {
        App
    } = $props();

    const oDisplays: TObject = {
        'calendar': Calendar,
        'list': List
    };
    
    /* -- Theme Switch */
    let sDisplay: string = $state( Store.get(PROPERTY_NAME.APP_SCHEDULE_DISPLAY) || 'calendar'),
        Display: Component = $derived( oDisplays[sDisplay] );

    function changeDisplay(sValue: string): void {
        if( sDisplay != sValue ){
            sDisplay = sValue;
            Store.set(PROPERTY_NAME.APP_SCHEDULE_DISPLAY, sDisplay);
        }
    }

    /* ---- Pages Encapsulation */
    const oPages: TObject = $state( {
        oDisplay: {
            change: changeDisplay
        },
        oView: null,
        oForm: null
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(App.oContent.oForm).with(console.trace);
    }
</script>

<div>
    <!-- Page #1 - List / Calendar -->
    <Display App={App} Pages={oPages} />

    <!-- Page #2 - View -->
    <View App={App} Pages={oPages} bind:this={oPages.oView} />

    <!-- Page #3 - Form -->
    <Form App={App} Pages={oPages} bind:this={oPages.oForm} />
</div>

<style>
</style>