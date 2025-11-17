// Imports
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME } from '../Core/Constants';

import Store from '../Core/Store';
import Customer from './Customer.svelte';


// ### ERROR - Loop independancies issue
// import { CONFIG } from '../Core/Config';
const CONFIG = {
    CONTACT_PLACEHOLDER: {
        _nId: 0,
        sFirstName: 'Jésabelle',
        sLastName: 'FONTAINE',
        sAddress: '6 rue Georges Bizet',
        sAddressSupplement: 'Appt 430 - 4ème étages',
        sPostalCode: '90000',
        sCity: 'BELFORT',
        aPhoneNumbers: ['+33 6 81 54 41 17'],
        sInformations: 'Contactus Poupi, amoris mei, fungens ut substitutus.',
        bHasKey: true
    }
};


/**
 * Contact options supplied to constructor.
 */
export interface IContactOptions {
    _nId?: number;
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
    private static _nUid: number = 0;
    private static _bRestored: boolean = false;
    public static oPlaceholder: Contact;

    /** Manager Methods */
    public static store(): void {
        if( Contact._bRestored ){
            Store.set(PROPERTY_NAME.APP_DATA_CONTACT, {
                _aInstances: Object.values(_oInstances).map( oContact => oContact.clone() ),
                _nUid: Contact._nUid
            } );
        }
    }

    public static restore(): void {
        if( !Contact._bRestored ){

            const oManagerData = Store.get(PROPERTY_NAME.APP_DATA_CONTACT);
            if( oManagerData ){
                Contact._nUid = oManagerData._nUid;
                oManagerData._aInstances.forEach( (oContactData: IContactOptions) => {
                    new Contact(oContactData);
                } );
            }

            Contact.oPlaceholder = new Contact( CONFIG.CONTACT_PLACEHOLDER );
            Contact._bRestored = true;
        }
    }

    public static getContacts(): TObject<Contact> {
        return _oInstances;
    }
    
    /* Instance Properties */
    private _nId: number = 0;
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

    public get nId() {
        return this._nId;
    }

    /** Constructor */
    public constructor(oData: IContactOptions) {
        this._nId = oData._nId != null ? oData._nId : ++Contact._nUid;
        if( this._nId ){
            _oInstances[this._nId] = this;
        }
        
        this.update(oData);
    }

    /** Destructor */
    public destroy(): void {
        this.oIsExtraOf?.removeExtraContact(this);
        delete _oInstances[this._nId];
        Contact.store();
    }

    /** Instance Methods */
    public clone(): IContactOptions {
        return {
            _nId: this._nId,
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
        this.bHasKey = oData.bHasKey;

        Contact.store();
    }

    public getName(): string {
        return this.sFirstName + ' ' + this.sLastName;
    }

    public getAddress(bAddPhoneNumbers: boolean = true): string[] {

        const aResult = [this.sAddress];
        if( this.sAddressSupplement ){
            aResult.push(this.sAddressSupplement);
        }
        aResult.push(this.sPostalCode + ' ' +this.sCity);

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