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
        sMainContact: '',
        bEnable: false
    },

    SCHEDULE_PLACEHOLDER: {
        _sUUID: '',
        sCustomer: '',
        nDay: 1,
        sWeekType: 'EVERY_WEEK',
        sTimeStart: '09:00',
        sTimeEnd: '12:00',
        nPrice: 17.00,
        sInformations: 'Horae laboris Poupi, amoris mei, fungens ut substitutus.',
    },

    TASK_PLACEHOLDER: {
        _sUUID: '',
        sCustomer: '',
        sSchedule: '',
        sDate: '1970-01-01T00:00:00Z',
        sTimeStart: '09:00',
        sTimeEnd: '12:00',
        nPrice: 17.00,
        sState: 'WAIT',
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
                    sContent: 'Task'
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
    CONTENT_DEFAULT: 'Task',
    CONTENT_ITEMS: <TObject<TObject>> {
        Task: {
            sComponent: 'Task',
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
    CALENDAR_CELL_HEIGHT: 45,

    CALENDAR_HOURS_START: 8,
    CALENDAR_HOURS_MAX_BY_DAY: 10,
    CALENDAR_HOURS_BREAK: [8, 12, 13, 17],

    CALENDAR_DAYS: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    CALENDAR_DAYS_BREAK: [0, 6],

    CALENDAR_MONTHS: [ 'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],

    // -- Schedule
    SCHEDULE_WEEK_TYPE: [
        { sValue: 'EVERY_WEEK', sText: 'Hebdomadaire', sDescription: 'Toutes les semaines', sTag: '', fFilter: (nWeek: number) => true },
        { sValue: 'EVEN_WEEK', sText: 'Bimensuel paire', sDescription: 'En semaine paire', sTag: 'Paire', fFilter: (nWeek: number) => nWeek % 2 == 0 },
        { sValue: 'ODD_WEEK', sText: 'Bimensuel impaire', sDescription: 'En semaine impaire', sTag: 'Imp.', fFilter: (nWeek: number) => nWeek % 2 == 1 }
    ],

    // -- Task
    TASK_STATE: [
        { sValue: 'WAIT', sText: 'En attente', sDescription: 'Attente de validation', sClass: 'bulma-is-link', sTag: 'fa-hourglass-half' },
        { sValue: 'VALID', sText: 'Validée', sDescription: 'Travaillée et validée', sClass: 'bulma-is-success', sTag: 'fa-check' },
        { sValue: 'CANCEL', sText: 'Annulée', sDescription: 'Annulée par le client', sClass: 'bulma-is-danger', sTag: 'fa-xmark' }
    ]
}