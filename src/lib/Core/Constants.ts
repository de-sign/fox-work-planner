/** ----- EVENT_NAME */
export enum EVENT_NAME {

    // ---- Core
    // -- Store
    STORE_SET = 'StoreSet',
    STORE_UPDATE = 'StoreUpdate',
    STORE_REMOVE = 'StoreRemove',

    // --- Components
    // -- Menu
    MENU_OPEN = 'MenuOpen',
    MENU_CLOSE = 'MenuClose'
}

/* ----- PROPERTY_NAME */
export enum PROPERTY_NAME {
    APP_DARK_MODE = 'dark-mode',
    APP_DATA_CUSTOMER = 'customers',
    APP_DATA_CONTACT = 'contacts'
}

/* ----- CUSTOMER_FORM */
export enum CUSTOMER_PAGE {
    LIST = 1,
    VIEW,
    FORM
}

export enum CUSTOMER_FORM_TYPE {
    NEW_CUSTOMER = 'NewCustomer',
    NEW_CONTACT = 'NewContact',
    MODIFY_CONTACT = 'ModifyContact'
}