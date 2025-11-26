<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { CONFIG } from '../../Core/Config';
    
    /* -- Svelte */
    import Calendar from './Calendar.svelte';
    import View from './View.svelte';
    import Form from './Form.svelte';

    /* ---- Component */
    let {
        App
    } = $props();

    /* ---- Pages Encapsulation */
    const oPages: TObject = $state( {
        oView: null,
        oForm: null
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(App.oContent.oForm).with(console.trace);
    }
</script>

<div>
    <!-- Page #1 - Calendar -->
    <Calendar App={App} Pages={oPages} />

    <!-- Page #2 - View -->
    <View App={App} Pages={oPages} bind:this={oPages.oView} />

    <!-- Page #3 - Form -->
    <Form App={App} Pages={oPages} bind:this={oPages.oForm} />
</div>

<style>
</style>