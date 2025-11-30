// Imports
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME } from '../Core/Constants';

import Store from '../Core/Store';
import Customer from './Customer.svelte';


// ### ERROR - Loop independancies issue
// import { CONFIG } from '../Core/Config';
const CONFIG = {
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
    }
};


/**
 * Schedule options supplied to constructor.
 */
export interface IScheduleOptions {
    _sUUID?: string;
    // sTitle?: string;
    sCustomer: string;
    nDay: number;
    sWeekType: string;
    sTimeStart: string;
    sTimeEnd: string;
    nPrice: number;
    sInformations?: string
};


/**
 * Schedule Manager class.
 * @class
 */

const _oInstances: TObject<Schedule> = $state({});

class Schedule {

    /** Manager properties.  **/
    private static _bRestored: boolean = false;
    public static oPlaceholder: Schedule;

    /** Manager Methods */
    public static store(): void {
        if( Schedule._bRestored ){
            Store.set(
                PROPERTY_NAME.APP_DATA_SCHEDULE,
                Object.values(_oInstances).map( oSchedule => oSchedule.clone() )
            );
        }
    }

    public static restore(): void {
        if( !Schedule._bRestored ){

            const aSchedulesData = Store.get(PROPERTY_NAME.APP_DATA_SCHEDULE);
            aSchedulesData?.forEach( (oScheduleData: IScheduleOptions) => {
                new Schedule(oScheduleData);
            } );

            Schedule.oPlaceholder = new Schedule( CONFIG.SCHEDULE_PLACEHOLDER );
            Schedule._bRestored = true;
        }
    }

    public static getAll(): TObject<Schedule> {
        return _oInstances;
    }

    public static get(sUUID: string): Schedule {
        return _oInstances[sUUID] || Schedule.oPlaceholder;
    }
    
    /** Instance Properties */
    private _sUUID: string = '';
    public oCustomer: Customer = $state(Customer.oPlaceholder);
    // public sTitle: string = $state('');
    public nDay: number = $state(0);
    public sWeekType: string = $state('');
    public sTimeStart: string = $state('');
    public sTimeEnd: string = $state('');
    public nPrice: number = $state(0.0);
    public sInformations: string | undefined = $state();

    public get sUUID() {
        return this._sUUID;
    }

    public get nTimeStart(): number {
        const [nHour, nMinute] = this.sTimeStart.split(':').map( (sValue: string) => parseInt(sValue) );
        return nHour * 60 + nMinute;
    }

    public get nTimeEnd(): number {
        const [nHour, nMinute] = this.sTimeEnd.split(':').map( (sValue: string) => parseInt(sValue) );
        return nHour * 60 + nMinute;
    }

    public get nDuration(): number {
        return this.nTimeEnd - this.nTimeStart;
    }

    public get sDuration(): string {
        const sHour = Math.floor(this.nDuration / 60) + 'h',
            sMin = this.nDuration % 60;
        return sHour + (sMin || '');
    }

    public get sPrice(): string {
        return this.nPrice.toFixed(2).replace('.', ',');
    }

    public get sTotalPrice(): string {
        return (this.nDuration / 60 * this.nPrice).toFixed(2).replace('.', ',');
    }

    /** Constructor */
    public constructor(oData: IScheduleOptions) {
        this._sUUID = oData._sUUID != null ? oData._sUUID : crypto.randomUUID();
        if( this._sUUID ){
            _oInstances[this._sUUID] = this;
        }
        
        this.update(oData);
    }

    /** Destructor */
    public destroy(): void {
        delete _oInstances[this._sUUID];
        Schedule.store();
    }

    /** Instance Methods */
    public clone(): IScheduleOptions {
        return {
            _sUUID: this._sUUID,
            sCustomer: this.oCustomer.sUUID,
            // sTitle: this.sTitle,
            nDay: this.nDay,
            sWeekType: this.sWeekType,
            sTimeStart: this.sTimeStart,
            sTimeEnd: this.sTimeEnd,
            nPrice: this.nPrice,
            sInformations: this.sInformations
        };
    }

    public update(oData: IScheduleOptions): void {
        this.oCustomer = Customer.get(oData.sCustomer);
        // this.sTitle = oData.sTitle;
        this.nDay = oData.nDay;
        this.sWeekType = oData.sWeekType;
        this.sTimeStart = oData.sTimeStart;
        this.sTimeEnd = oData.sTimeEnd;
        this.nPrice = oData.nPrice;
        this.sInformations = oData.sInformations;

        Schedule.store();
    }
};

export default Schedule;