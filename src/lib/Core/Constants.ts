/** ----- EVENT_NAME */
export enum EVENT_NAME {

    // ---- Core
    // -- Store
    STORE_SET = 'StoreSet',
    STORE_UPDATE = 'StoreUpdate',
    STORE_REMOVE = 'StoreRemove',

    // -- Patch
    PATCH_APPLY = 'PatchApply',

    // --- Components
    // -- Menu
    MENU_OPEN = 'MenuOpen',
    MENU_CLOSE = 'MenuClose'
}

/* ----- PROPERTY_NAME */
export enum PROPERTY_NAME {
    APP_LAST_PATCH = 'patch',
    APP_DARK_MODE = 'dark-mode',

    APP_DATA_CUSTOMER = 'customers',
    APP_DATA_CONTACT = 'contacts',
    APP_DATA_SCHEDULE = 'schedules',
    APP_DATA_TASK = 'tasks',

    APP_SCHEDULE_DISPLAY = 'schedule-display',
    APP_TASK_DISPLAY = 'task-display'
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

/* ----- SCHEDULE_FORM */
export enum SCHEDULE_PAGE {
    CONTENT = 1,
    VIEW,
    FORM
}

export enum SCHEDULE_FORM_TYPE {
    NEW_SCHEDULE = 'NewSchedule',
    MODIFY_SCHEDULE = 'ModifySchedule'
}

export enum SCHEDULE_WEEK_TYPE {
    EVERY_WEEK = 0,
    EVEN_WEEK,
    ODD_WEEK
}

/* ----- TASK_FORM */
export enum TASK_PAGE {
    CONTENT = 1,
    VIEW,
    FORM
}

export enum TASK_FORM_TYPE {
    NEW_TASK = 'NewTask',
    MODIFY_TASK = 'ModifyTask'
}

export enum TASK_STATE {
    WAIT = 0,
    VALID,
    CANCEL
}