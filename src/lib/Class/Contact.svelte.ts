// Imports
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME } from '../Core/Constants';
import { CONFIG } from '../Core/Config';

import Store from '../Core/Store';
import Customer from './Customer.svelte';


/**
 * Contact options supplied to constructor.
 */
export interface IContactOptions {
    _sUUID?: string;
    sFirstName: string;
    sLastName: string;
    sAddress: string;
    sAddressSupplement?: string;
    sPostalCode: string;
    sCity: string;
    aPhoneNumbers: string[];
    sInformations?: string,
    bHasKey: boolean
};


/**
 * Contact Manager class.
 * @class
 */

const _oInstances: TObject<Contact> = $state({});

class Contact {

    /** Manager properties.  **/
    private static _bRestored: boolean = false;
    public static oPlaceholder: Contact;

    /** Manager Methods */
    public static store(): void {
        if( Contact._bRestored ){
            Store.set(
                PROPERTY_NAME.APP_DATA_CONTACT,
                Object.values(_oInstances).map( oContact => oContact.clone() )
            );
        }
    }

    public static restore(): void {
        if( !Contact._bRestored ){

            const aContactsData = Store.get(PROPERTY_NAME.APP_DATA_CONTACT);
            aContactsData?.forEach( (oContactData: IContactOptions) => {
                new Contact(oContactData);
            } );

            Contact.oPlaceholder = new Contact( CONFIG.CONTACT_PLACEHOLDER );
            Contact._bRestored = true;
        }
    }

    public static getAll(): TObject<Contact> {
        return _oInstances;
    }

    public static get(sUUID: string): Contact {
        return _oInstances[sUUID] || Contact.oPlaceholder;
    }
    
    /* Instance Properties */
    private _sUUID: string = '';
    public oIsCustomer: Customer | null = null;
    public oIsExtraOf: Customer | null = null;

    public sFirstName: string = $state('');
    public sLastName: string = $state('');
    public sAddress: string = $state('');
    public sAddressSupplement: string | undefined = $state();
    public sPostalCode: string = $state('');
    public sCity: string = $state('');
    public aPhoneNumbers: string[] = $state([]);
    public sInformations: string | undefined = $state();
    public bHasKey: boolean = $state(false);

    public get sUUID() {
        return this._sUUID;
    }

    /** Constructor */
    public constructor(oData: IContactOptions) {
        this._sUUID = oData._sUUID != null ? oData._sUUID : crypto.randomUUID();
        if( this._sUUID ){
            _oInstances[this._sUUID] = this;
        }
        
        this.update(oData);
    }

    /** Destructor */
    public destroy(): void {
        this.oIsExtraOf?.removeExtraContact(this);
        delete _oInstances[this._sUUID];
        Contact.store();
    }

    /** Instance Methods */
    public clone(): IContactOptions {
        return {
            _sUUID: this._sUUID,
            sFirstName: this.sFirstName,
            sLastName: this.sLastName,
            sAddress: this.sAddress,
            sAddressSupplement: this.sAddressSupplement,
            sPostalCode: this.sPostalCode,
            sCity: this.sCity,
            aPhoneNumbers: this.aPhoneNumbers,
            sInformations: this.sInformations,
            bHasKey: this.bHasKey
        };
    }

    public update(oData: IContactOptions): void {
        this.sFirstName = oData.sFirstName;
        this.sLastName = oData.sLastName;
        this.sAddress = oData.sAddress;
        this.sAddressSupplement = oData.sAddressSupplement;
        this.sPostalCode = oData.sPostalCode;
        this.sCity = oData.sCity;
        this.aPhoneNumbers = oData.aPhoneNumbers;
        this.sInformations = oData.sInformations;
        this.bHasKey = !!oData.bHasKey;

        Contact.store();
    }

    public get sName(): string {
        return this.sFirstName + ' ' + this.sLastName;
    }

    public get sShortName(): string {
        return this.sFirstName.charAt(0) + '. ' + this.sLastName;
    }

    public get sReverseName(): string {
        return this.sLastName + ' ' + this.sFirstName;
    }

    public get sMapsQuery(): string {
        return this.sAddress + ' ' + this.sPostalCode.replace(' ', '') + ' ' + this.sCity;
    }

    public getAddress(bAddPhoneNumbers: boolean = true): string[] {

        const aResult = [this.sAddress];
        if( this.sAddressSupplement ){
            aResult.push(this.sAddressSupplement);
        }
        aResult.push(this.sPostalCode + ' ' + this.sCity);

        if( bAddPhoneNumbers ){
            aResult.push( ...this.aPhoneNumbers );
        }
        return aResult;
    }

    public getMobilePhoneNumbers(): string[] {
        const rMobilePhone = new RegExp(/^\+33 [6|7]/i);
        return this.aPhoneNumbers.filter( sValue => rMobilePhone.test(sValue) );
    }
};

export default Contact;