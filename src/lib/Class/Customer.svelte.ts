// Imports
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME } from '../Core/Constants';

import Store from '../Core/Store';
import Contact from './Contact.svelte';


// ### ERROR - Loop independancies issue
// import { CONFIG } from '../Core/Config';
const CONFIG = {
    CUSTOMER_PLACHOLDER: {
        _nId: 0,
        nMainContact: 0
    }
};


/**
 * Customer options supplied to constructor.
 */
export interface ICustomerOptions {
    _nId?: number;
    nMainContact: number;
    aExtraContacts?: number[];
}


/**
 * Customer Manager class.
 * @class
 */

const _oInstances: TObject<Customer> = $state({});

class Customer {

    /** Manager properties.  **/
    private static _nUid: number = 0;
    private static _bRestored: boolean = false;
    public static oPlaceholder: Customer;

    /** Manager Methods */
    public static store(): void {
        if( Customer._bRestored ){
            Store.set(PROPERTY_NAME.APP_DATA_CUSTOMER, {
                _aInstances: Object.values(_oInstances).map( oCustomer => oCustomer.serialize() ),
                _nUid: Customer._nUid
            } );
        }
    }

    public static restore(): void {
        if( !Customer._bRestored ){

            const oManagerData = Store.get(PROPERTY_NAME.APP_DATA_CUSTOMER);
            if( oManagerData ){
                Customer._nUid = oManagerData._nUid;
                oManagerData._aInstances.forEach( (oCustomerData: ICustomerOptions) => {
                    new Customer(oCustomerData);
                } );
            }

            Customer.oPlaceholder = new Customer( CONFIG.CUSTOMER_PLACHOLDER );
            Customer._bRestored = true;
        }
    }
    
    public static getCustomers(): TObject<Customer> {
        return _oInstances;
    }
    
    /* Instance Properties */
    private _nId: number = 0;
    public oMainContact: Contact;
    public aExtraContacts: Contact[] = $state([]);

    /** Constructor */
    public constructor(oData: ICustomerOptions) {

        this._nId = oData._nId != null ? oData._nId : ++Customer._nUid;
        if( this._nId ){
            _oInstances[this._nId] = this;
        }
        
        const oContacts = Contact.getContacts(),
            oMainContact = oContacts[oData.nMainContact] || Contact.oPlaceholder;

        this.oMainContact = $state(oMainContact);
        oMainContact.oIsCustomer = this;

        oData.aExtraContacts?.forEach( nId => {
            const oExtraContact = oContacts[nId];
            this.aExtraContacts.push(oExtraContact);
            oExtraContact.oIsExtraOf = this;
        } );
    }

    /** Destructor */
    public destroy(): void {
        /* Destroy Contact */
        this.oMainContact.destroy();
        this.aExtraContacts.map( oContact => oContact.destroy() );

        /* Destroy Instance */
        delete _oInstances[this._nId];
        Customer.store();
    }

    /** Instance Methods */
    public serialize(): ICustomerOptions {
        return {
            _nId: this._nId,
            nMainContact: this.oMainContact.nId,
            aExtraContacts: this.aExtraContacts.map( oContact => oContact.nId )
        };
    }

    public addExtraContact(oTarget: Contact): void {
        this.aExtraContacts.push(oTarget);
        oTarget.oIsExtraOf = this;
        Customer.store();
    }

    public removeExtraContact(oTarget: Contact): void {
        this.aExtraContacts.splice( this.aExtraContacts.indexOf(oTarget), 1);
        oTarget.oIsExtraOf = null;
        Customer.store();
    }

    public getMainName(): string {
        return this.oMainContact.getName();
    }

    public hasMainKey(): boolean {
        return this.oMainContact.bHasKey;
    }

}

export default Customer;