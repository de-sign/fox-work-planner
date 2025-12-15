/* ---- Import */
// -- Core
import { CONFIG } from './lib/Core/Config';
import * as Svelte from 'svelte';

import App from './lib/Components/App.svelte';

// -- Style
import 'bulma/css/versions/bulma-prefixed.css';
import './assets/style/App.scss';

/* ---- App */
// -- Patch System
import Patch from './lib/Class/Patch';
Patch.apply();

// -- Restore Data 
import { CLASS } from './lib/Core/Import';
Object.values(CLASS).forEach( (fClass: any) => fClass.restore() );

/* -- Build App */
const oApp = Svelte.mount(App, {
    target: document.body!,
} );

/* ---- Debug Mode */
import Store from './lib/Class/Store';
if( CONFIG.DEBUG_WINDOW_PROPERTY ) {
    const sProp : string = CONFIG.DEBUG_WINDOW_PROPERTY_NAME;
    Object.assign( window, { [sProp]: {
        Core: {
            CONFIG,
            Store,
            ...CLASS
        },
        Svelte: {
            Svelte,
            oApp
        }
    } } );
}

export default oApp;