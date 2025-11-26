/* ---- Import */
// -- Core
import { CONFIG } from './lib/Core/Config';
import * as Svelte from 'svelte';

import Contact from './lib/Class/Contact.svelte';
import Customer from './lib/Class/Customer.svelte';
import Schedule from './lib/Class/Schedule.svelte';
import App from './lib/Components/App.svelte';

// -- Style
import 'bulma/css/versions/bulma-prefixed.css';
import './assets/style/App.scss';

/* ---- App */
// -- Patch System
import Patch from './lib/Core/Patch';
Patch.apply();

// -- Restore Data 
Contact.restore();
Customer.restore();
Schedule.restore();

/* -- Build App */
const oApp = Svelte.mount(App, {
    target: document.body!,
} );

/* ---- Debug Mode */
import Store from './lib/Core/Store';
if( CONFIG.DEBUG_WINDOW_PROPERTY ) {
    const sProp : string = CONFIG.DEBUG_WINDOW_PROPERTY_NAME;
    Object.assign( window, { [sProp]: {
        Core: {
            CONFIG,
            Store,
            Contact,
            Customer,
            Schedule
        },
        Svelte: {
            Svelte,
            oApp
        }
    } } );
}

export default oApp;