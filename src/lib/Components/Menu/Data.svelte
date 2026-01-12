<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { PROPERTY_NAME } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';
    import { CLASS } from '../../Core/Import';
    
    import * as Svelte from 'svelte';
    import Store from '../../Class/Store';
    import Patch from '../../Class/Patch';

    /* ---- Component */
    /* -- Export */
    let hDownload: HTMLAnchorElement | null;
    function exportData(): void {
        if( hDownload ){
            // Get DATA
            const oData: TObject = {
                nPatchVersion: Store.get(PROPERTY_NAME.APP_LAST_PATCH)
            };
            CONFIG.EXPORT_KEYS_STORE.forEach( sStoreKey => {
                oData[sStoreKey] = Store.get(sStoreKey);
            } );

            // Create File
            const sJSON = JSON.stringify(oData),
                oBlob = new Blob([sJSON], { type: 'octet/stream'} ),
                sUrl = window.URL.createObjectURL(oBlob),
                sFileName = 'fox-wp-data--' + ( new Date() ).toDateString().toLowerCase().replaceAll(' ', '-') + '.json';

            // Download File
            hDownload.href = sUrl;
            hDownload.download = sFileName;
            hDownload.click();

            // Clear
            window.URL.revokeObjectURL(sUrl);
        }
    }

    /* -- Import */
    let hUpload: HTMLInputElement | null;
    function importData(): void {
        if( hUpload && hUpload.files ){
            // Get DATA
            const oReader = new FileReader();

            // Upload File
            oReader.onload = () => {
                try {
                    // Clear Data
                    Object.values(CLASS).forEach( (fClass: any) => fClass.clear() );

                    // Parse File
                    const oData = JSON.parse(<string>oReader.result);
                    CONFIG.EXPORT_KEYS_STORE.forEach( sStoreKey => {
                        if( oData[sStoreKey] ){
                            Store.set(sStoreKey, oData[sStoreKey]);
                        }
                    } );

                    // Apply Patch
                    Patch.apply( oData.nPatchVersion || -1 );

                    // Restore Data
                    Object.values(CLASS).forEach( (fClass: any) => fClass.restore() );

                    alert('Chargement du fichier de données terminé <3');

                }
                catch (oError) {
                    alert('Problème lors du chargement du fichier T-T');
                }
            };
            oReader.onerror = () => alert('Problème lors du chargement du fichier T-T');
            oReader.readAsText( hUpload.files[0] );
        }
    }

    Svelte.onMount( () => hUpload?.addEventListener('change', importData) );
    Svelte.onDestroy( () => hUpload?.removeEventListener('change', importData) );

</script>

<li class="fox-app-menu-data">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" bind:this={hDownload} class="bulma-is-hidden" title="Exporter les données"></a>
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" class="bulma-is-flex bulma-is-align-items-center" onclick={exportData}>
        <span class="bulma-is-flex-grow-1">Exporter les données</span>
        <span class="bulma-icon">
            <i class="fa-solid fa-cloud-arrow-down fa-lg"></i>
        </span>
    </a>
</li>
<li class="fox-app-menu-data">
    <input bind:this={hUpload} class="bulma-is-hidden" type="file" accept=".json" />
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" class="bulma-is-flex bulma-is-align-items-center" onclick={ () => hUpload?.click() }>
        <span class="bulma-is-flex-grow-1">Importer les données</span>
        <span class="bulma-icon">
            <i class="fa-solid fa-cloud-arrow-up fa-lg"></i>
        </span>
    </a>
</li>

<style>
</style>