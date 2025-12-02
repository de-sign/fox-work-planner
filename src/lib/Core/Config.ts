// ---- Import
// ### ERROR - Loop independancies issue
// import { PROPERTY_NAME } from './Constants';
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME } from './Constants';

// ---- Application
// -- > Move to 'Import.ts
// import Theme from '../Components/Menu/Theme.svelte';
// import Todo from '../Components/Todo.svelte';
// import Customer from '../Components/Customer/Pages.svelte';
// import Schedule from '../Components/Schedule/Pages.svelte';

// ---- Interface TS
interface MenuItem {
    sLabel: string,
    sContent?: string,
    bIsComponent?: boolean,
    sComponent?: string,
    oComponent?: any
}

// ---- Export
export const CONFIG = {

    // ---- Core
    // -- Debug
    DEBUG_PRINT_LOG: true,
    DEBUG_WINDOW_PROPERTY: true,
    DEBUG_WINDOW_PROPERTY_NAME: 'oFoxDebug',
    
    // -- Store
    STORE_STORABLE_KEYS: Object.values(PROPERTY_NAME),
    STORE_PREFIX_KEY: 'fox-app-',

    // -- Class
    CONTACT_PLACEHOLDER: {
        _sUUID: '',
        sFirstName: 'Jésabelle',
        sLastName: 'FONTAINE',
        sAddress: '6 rue Georges Bizet',
        sAddressSupplement: 'Appt 430 - 4ème étages',
        sPostalCode: '90 000',
        sCity: 'BELFORT',
        aPhoneNumbers: ['+33 6 81 54 41 17'],
        sInformations: 'Contactus Poupi, amoris mei, fungens ut substitutus.',
        bHasKey: true
    },

    CUSTOMER_PLACHOLDER: {
        _sUUID: '',
        sMainContact: ''
    },

    SCHEDULE_PLACEHOLDER: {
        _sUUID: '',
        // sTitle: 'Ménage à fond',
        sCustomer: '',
        nDay: 1,
        sWeekType: 'EVERY_WEEK',
        sTimeStart: '09:00',
        sTimeEnd: '12:00',
        nPrice: 17.00,
        sInformations: 'Horae laboris Poupi, amoris mei, fungens ut substitutus.',
    },

    // ---- Application
    // -- Menu Item
    MENU_LIST_ITEMS: [
        {
            sLabel: 'Menu Principal',
            aItems: <MenuItem[]>[
                {
                    sLabel: 'Agenda',
                    sContent: 'Agenda'
                },
                {
                    sLabel: 'Rémunération',
                    sContent: 'Income'
                }
            ]
        },
        {
            sLabel: 'Administration',
            aItems: <MenuItem[]>[
                {
                    sLabel: 'Clients',
                    sContent: 'Customer'
                },
                {
                    sLabel: 'Planification',
                    sContent: 'Schedule'
                },
            ]
        }, 
        {
            sLabel: 'Paramètres',
            aItems: <MenuItem[]> [
                // Special - Switch Theme 
                {
                    sLabel: 'Thème',
                    bIsComponent: true,
                    sComponent: 'Theme',
                }
            ]
        }
    ],

    // -- Component Content
    // CONTENT_DEFAULT: 'Agenda',
    CONTENT_DEFAULT: 'Schedule',
    CONTENT_ITEMS: <TObject<TObject>> {
        Agenda: {
            sComponent: 'Agenda',
            nPagesCount: 3
        },
        Income: {
            sComponent: 'Income',
            nPagesCount: 3
        },
        Customer: {
            sComponent: 'Customer',
            nPagesCount: 3
        },
        Schedule: {
            sComponent: 'Schedule',
            nPagesCount: 3
        }
    },
    CONTENT_PAGE_SCROLLTOP_SELECTOR: '.fox-app-page-content',

    // -- Calendar
    CALENDAR_DAYS: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    CALENDAR_HOUR_START: 8,
    CALENDAR_HOUR_MAX_BY_DAY: 10,
    CALENDAR_HOUR_BREAK: [8, 12, 13, 17],
    CALENDAR_WEEK_TYPE: [
        { sValue: 'EVERY_WEEK', sText: 'Hebdomadaire', sDescription: 'Toutes les semaines', sTag: '' },
        { sValue: 'EVEN_WEEK', sText: 'Bimensuel paire', sDescription: 'En semaine paire', sTag: 'Paire' },
        { sValue: 'ODD_WEEK', sText: 'Bimensuel impaire', sDescription: 'En semaine impaire', sTag: 'Imp.' }
    ]
}