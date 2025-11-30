// ---- Import
// ### ERROR - Loop independancies issue
// import { PROPERTY_NAME } from './Constants';
import type { TObject } from '../Core/Type';

// ---- Application
import Theme from '../Components/Menu/Theme.svelte';
import Todo from '../Components/Todo.svelte';

import Customer from '../Components/Customer/Pages.svelte';
import Schedule from '../Components/Schedule/Pages.svelte';

// ---- Interface TS
interface MenuItem {
    sLabel?: string,
    sContent?: string,
    bIsComponent?: boolean,
    oComponent?: any
}

// ---- Export
export const CONFIG = {

    // ---- Core
    // -- Debug
    DEBUG_PRINT_LOG: true,
    DEBUG_WINDOW_PROPERTY: true,
    DEBUG_WINDOW_PROPERTY_NAME: 'oFoxDebug',

    // ### ERROR - Loop independancies issue
    
    // -- Store
    // STORE_STORABLE_KEYS: Object.values(PROPERTY_NAME),
    // STORE_PREFIX_KEY: 'fox-app-',

    // -- Class
    // CONTACT_PLACEHOLDER: {
    //     _sUUID: 0,
    //     sFirstName: 'Jésabelle',
    //     sLastName: 'FONTAINE',
    //     sAddress: '6 rue Georges Bizet',
    //     sAddressSupplement: 'Appt 430 - 4ème étages',
    //     sPostalCode: '90000',
    //     sCity: 'BELFORT',
    //     aPhoneNumbers: ['0681544117'],
    //     sInformations: 'Contact de Poupi <3 servant de substitut',
    //     bHasKey: true
    // },

    // CUSTOMER_PLACHOLDER: {
    //     _sUUID: 0,
    //     sMainContact: 0
    // },

    // ---- Application
    // -- Menu Item
    MENU_LIST_ITEMS: [
        {
            sLabel: 'Menu',
            aItems: <MenuItem[]>[
                {
                    sLabel: 'Clients',
                    sContent: 'Customer'
                },
                {
                    sLabel: 'Emploi du temps',
                    sContent: 'Schedule'
                },
                {
                    sLabel: 'Programme',
                    sContent: 'Planning'
                },
                {
                    sLabel: 'Rémunération',
                    sContent: 'Income'
                }
            ]
        }, 
        {
            sLabel: '<br/>Paramètres',
            aItems: <MenuItem[]> [
                // Special - Switch Theme 
                {
                    bIsComponent: true,
                    oComponent: Theme
                }
            ]
        }
    ],

    // -- Component Content
    // CONTENT_DEFAULT: 'Planning',
    CONTENT_DEFAULT: 'Schedule',
    CONTENT_ITEMS: <TObject<TObject>> {
        Planning: {
            oComponent: Todo,
            nPagesCount: 3
        },
        Income: {
            oComponent: Todo,
            nPagesCount: 3
        },
        Customer: {
            oComponent: Customer,
            nPagesCount: 3
        },
        Schedule: {
            oComponent: Schedule,
            nPagesCount: 3
        }
    },
    CONTENT_PAGE_SCROLLTOP_SELECTOR: '.fox-app-page-content',

    // -- Schedule calendar
    SCHEDULE_CALENDAR_DAYS: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    SCHEDULE_CALENDAR_HOUR_START: 8,
    SCHEDULE_CALENDAR_HOUR_MAX_BY_DAY: 10,
    SCHEDULE_CALENDAR_HOUR_BREAK: [8, 12, 13, 17],
    SCHEDULE_CALENDAR_WEEK_TYPE: [
        { sValue: 'EVERY_WEEK', sText: 'Hebdomadaire', sDescription: 'Toutes les semaines' },
        { sValue: 'EVEN_WEEK', sText: 'Bimensuel paire', sDescription: 'En semaine paire', sTag: 'Paire' },
        { sValue: 'ODD_WEEK', sText: 'Bimensuel impaire', sDescription: 'En semaine impaire', sTag: 'Imp.' }
    ]
}