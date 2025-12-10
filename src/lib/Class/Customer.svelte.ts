// Imports
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME } from '../Core/Constants';
import { CONFIG } from '../Core/Config';

import Store from '../Core/Store';
import Contact from './Contact.svelte';


/**
 * Customer options supplied to constructor.
 */
export interface ICustomerOptions {
    _sUUID?: string;
    sMainContact: string;
    aExtraContacts?: string[];
    bEnable?: boolean;
}


/**
 * Customer Manager class.
 * @class
 */

const _oInstances: TObject<Customer> = $state({});

class Customer {

    /** Manager properties.  **/
    private static _bRestored: boolean = false;
    public static oPlaceholder: Customer;

    /** Manager Methods */
    public static store(): void {
        if( Customer._bRestored ){
            Store.set(
                PROPERTY_NAME.APP_DATA_CUSTOMER,
                Object.values(_oInstances).map( oCustomer => oCustomer.serialize() )
            );
        }
    }

    public static restore(): void {
        if( !Customer._bRestored ){

            const aCustomersData = Store.get(PROPERTY_NAME.APP_DATA_CUSTOMER);
            aCustomersData?.forEach( (oCustomerData: ICustomerOptions) => {
                new Customer(oCustomerData);
            } );

            Customer.oPlaceholder = new Customer( CONFIG.CUSTOMER_PLACHOLDER );
            Customer._bRestored = true;
        }
    }

    public static clear(): void {
        for( let sUUID in _oInstances ){
            delete _oInstances[sUUID];
        }
        Customer._bRestored = false;
    }
    
    public static hasCustomers(): boolean {
        return !!Object.getOwnPropertyNames(_oInstances).length;
    }
    
    public static getAll(): TObject<Customer> {
        return _oInstances;
    }

    public static get(sUUID: string): Customer {
        return _oInstances[sUUID] || Customer.oPlaceholder;
    }
    
    /* Instance Properties */
    private _sUUID: string = '';
    public oMainContact: Contact;
    public aExtraContacts: Contact[] = $state([]);
    public bEnable: boolean = $state(true);

    public get sId(): string {
        return this.constructor.name + '-' + this._sUUID + '--' + this.oMainContact.sId;
    }

    public get sUUID(): string {
        return this._sUUID;
    }

    public get sName(): string {
        return this.oMainContact.sName;
    }

    public get sShortName(): string {
        return this.oMainContact.sShortName;
    }

    public get sReverseName(): string {
        return this.oMainContact.sReverseName;
    }

    public get bHasKey(): boolean {
        return this.oMainContact.bHasKey;
    }

    /** Constructor */
    public constructor(oData: ICustomerOptions) {

        this._sUUID = oData._sUUID != null ? oData._sUUID : crypto.randomUUID();
        if( this._sUUID ){
            _oInstances[this._sUUID] = this;
        }
        
        this.oMainContact = $state( Contact.get(oData.sMainContact) );
        this.oMainContact.oIsCustomer = this;

        oData.aExtraContacts?.forEach( sUUID => {
            const oExtraContact = Contact.get(sUUID);
            this.aExtraContacts.push(oExtraContact);
            oExtraContact.oIsExtraOf = this;
        } );

        if( oData.bEnable != null ){
            this.bEnable = oData.bEnable;
        }

        Customer.store();
    }

    /** Destructor */
    public destroy(): void {
        /* Destroy Contact */
        this.oMainContact.destroy();
        this.aExtraContacts.map( oContact => oContact.destroy() );

        /* Destroy Instance */
        delete _oInstances[this._sUUID];
        Customer.store();
    }

    /** Instance Methods */
    public serialize(): ICustomerOptions {
        return {
            _sUUID: this._sUUID,
            sMainContact: this.oMainContact.sUUID,
            aExtraContacts: this.aExtraContacts.map( oContact => oContact.sUUID ),
            bEnable: this.bEnable
        };
    }

    public changeEnable(bValue: boolean): void {
        this.bEnable = bValue;
        Customer.store();
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

}

export default Customer;