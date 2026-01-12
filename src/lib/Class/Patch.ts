// Imports
import type { TObject, TData, TListeners } from '../Core/Type';
import { EVENT_NAME, PROPERTY_NAME } from '../Core/Constants';

import EventEmitter from 'eventemitter3';
import Store from '../Class/Store';

// Key Format -> YYYYMMDDHHMM
const CONFIG = {
    PATCH_LIST: {
        // Replace nId by sUUID for Contact and Customer in Store
        202511261830: () => {
            const oMapContact: TObject = {};

            // Contact
            const aContactsData = Store.get(PROPERTY_NAME.APP_DATA_CONTACT);
            if( aContactsData && aContactsData._aInstances ){
                aContactsData._aInstances.forEach( (oContactData: TObject) => {
                    oContactData._sUUID = crypto.randomUUID();
                    oMapContact[ oContactData._nId ] = oContactData._sUUID;
                    delete oContactData._nId;
                } );

                // console.log('202511261830 -> Contact', aContactsData._aInstances);
                Store.set(PROPERTY_NAME.APP_DATA_CONTACT, aContactsData._aInstances);
            }

            // Customer
            const aCustomersData = Store.get(PROPERTY_NAME.APP_DATA_CUSTOMER);
            if( aCustomersData && aCustomersData._aInstances ){
                aCustomersData._aInstances.forEach( (oCustomerData: TObject) => {
                    oCustomerData._sUUID = crypto.randomUUID();
                    oCustomerData.sMainContact = oMapContact[oCustomerData.nMainContact];
                    oCustomerData.aExtraContacts = oCustomerData.aExtraContacts.map( (nExtra: any) => oMapContact[nExtra] );
                    delete oCustomerData._nId;
                    delete oCustomerData.nMainContact;
                } );

                // console.log('202511261830 -> Customer', aCustomersData._aInstances);
                Store.set(PROPERTY_NAME.APP_DATA_CUSTOMER, aCustomersData._aInstances);
            }
        },

        // Add Price propertie 
        202511292230: () => {
            // Schedule
            const aScheduleData = Store.get(PROPERTY_NAME.APP_DATA_SCHEDULE);
            if( aScheduleData ){
                aScheduleData.forEach( (oScheduleData: TObject) => {
                    if( oScheduleData.nPrice == null ){
                        oScheduleData.nPrice = 17.00;
                    }
                } );

                // console.log('202511292230 -> Schedule', aScheduleData);
                Store.set(PROPERTY_NAME.APP_DATA_SCHEDULE, aScheduleData);
            }
        },

        // Add Customer Enable property
        202512041430: () => {
            const aCustomersData = Store.get(PROPERTY_NAME.APP_DATA_CUSTOMER);
            if( aCustomersData ){
                aCustomersData.forEach( (oCustomerData: TObject) => {
                    if( oCustomerData.bEnable == null ){
                        oCustomerData.bEnable = true;
                    }
                } );

                // console.log('202512041430 -> Customer', aCustomersData);
                Store.set(PROPERTY_NAME.APP_DATA_CUSTOMER, aCustomersData);
            }
        },

        // Change display calendar to calendar-week
        202512181050: () => {
            const sScheduleDisplay = Store.get(PROPERTY_NAME.APP_SCHEDULE_DISPLAY);
            if( sScheduleDisplay == 'calendar' ){
                Store.set(PROPERTY_NAME.APP_SCHEDULE_DISPLAY, 'calendar-week');
            }

            const sTaskDisplay = Store.get(PROPERTY_NAME.APP_TASK_DISPLAY);
            if( sTaskDisplay == 'calendar' ){
                Store.set(PROPERTY_NAME.APP_TASK_DISPLAY, 'calendar-week');
            }
        },

        // Add Task Service property
        202601082235: () => {
            const aTaskData = Store.get(PROPERTY_NAME.APP_DATA_TASK);
            if( aTaskData ){
                aTaskData.forEach( (oTaskData: TObject) => {
                    if( oTaskData.bService == null ){
                        oTaskData.bService = true;
                    }
                } );

                // console.log('202511292230 -> Task', aTaskData);
                Store.set(PROPERTY_NAME.APP_DATA_TASK, aTaskData);
            }
        },

        // Add Customer Date Start property
        202601122035: () => {
            const aCustomersData = Store.get(PROPERTY_NAME.APP_DATA_CUSTOMER),
                aTaskData = Store.get(PROPERTY_NAME.APP_DATA_TASK),
                oCustomersDate: TData = {};

            // Task by Customer
            if( aTaskData ){
                aTaskData.forEach( (oTaskData: TObject) => {
                    if( oTaskData.sState != 'CANCEL' ){
                        if( oCustomersDate[oTaskData.sCustomer] ){
                            const nDate = parseInt(oTaskData.sDate.replace('-', '')),
                                nLastDate = parseInt(oCustomersDate[oTaskData.sCustomer].replace('-', ''));
                            if( nDate < nLastDate ) {
                                oCustomersDate[oTaskData.sCustomer] = oTaskData.sDate;
                            }
                        } else {
                            oCustomersDate[oTaskData.sCustomer] = oTaskData.sDate;
                        }
                    }
                } );
                

                // Clear Useless Task
                const oNewTaskData = aTaskData.filter( (oTaskData: TObject) => oTaskData.sCustomer && oCustomersDate[oTaskData.sCustomer] );
                // console.log('202601122035 -> Task', oNewTaskData );
                Store.set(PROPERTY_NAME.APP_DATA_TASK, oNewTaskData);

            }

            // Add first Task Date
            if( aCustomersData ){
                aCustomersData.forEach( (oCustomerData: TObject) => {
                    if( oCustomerData.sDateStart == null ){
                        oCustomerData.sDateStart = oCustomersDate[oCustomerData._sUUID] || (new Date()).toJSON().split('T')[0];
                    }
                } );

                // console.log('202601122035 -> Customer', aCustomersData);
                Store.set(PROPERTY_NAME.APP_DATA_CUSTOMER, aCustomersData);
            }
        }
    }
};

/**
 * Patch Manager class.
 * 
 * @class
 */

class Patch extends EventEmitter {

    /** Singleton instance. **/
    private static _oInstance: Patch;
    /** Data saved by the manager. **/
    private _oData: TListeners;
    
    
    /** Constructor */
    private constructor(oPatchs: TListeners) {
        super();
        this._oData = oPatchs;
    }

    /** Instance getter */
    public static get oInstance(): Patch {
        if (!Patch._oInstance) {
            Patch._oInstance = new Patch(CONFIG.PATCH_LIST);
        }

        return Patch._oInstance;
    }

    /** Destructor */
    public destroy(): void {
        // Remove listeners
        this.removeAllListeners();
    }

    /** Apply all patch who not patched */
    public apply(nApplyVersion?: number): void {
        const nLastVersion = nApplyVersion || Store.get(PROPERTY_NAME.APP_LAST_PATCH) || 0,
            aPatchApply: number[] = [];

        for( let sVersion in this._oData ){
            const fPatch = this._oData[sVersion],
                nVersion = parseInt(sVersion) ;

            if( nLastVersion < nVersion ){
                fPatch();
                aPatchApply.push(nVersion);
            }
        }

        if( !nApplyVersion && aPatchApply.length ){
            Store.set(PROPERTY_NAME.APP_LAST_PATCH, aPatchApply[aPatchApply.length - 1] );
            this.emit(EVENT_NAME.PATCH_APPLY, aPatchApply); // Trigger
        }
    }
}

export default Patch.oInstance;