// Imports
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME, SCHEDULE_WEEK_TYPE } from '../Core/Constants';
import { CONFIG } from '../Core/Config';

import Store from '../Core/Store';
import Customer from './Customer.svelte';


/**
 * Schedule options supplied to constructor.
 */
export interface IScheduleOptions {
    _sUUID?: string;
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
    public nDay: number = $state(0);
    public sWeekType: string = $state('');
    public sTimeStart: string = $state('');
    public sTimeEnd: string = $state('');
    public nPrice: number = $state(0.0);
    public sInformations: string | undefined = $state();

    public get sId(): string {
        return this.constructor.name + '-' + this._sUUID;
    }

    public get sUUID() {
        return this._sUUID;
    }

    public get sDay(): string {
        return CONFIG.CALENDAR_DAYS[this.nDay - 1];
    }

    public get oWeekType(): TObject {
        return CONFIG.CALENDAR_WEEK_TYPE[ SCHEDULE_WEEK_TYPE[this.sWeekType as keyof typeof SCHEDULE_WEEK_TYPE] ];
    }

    public get nTimeStart(): number {
        const [nHour, nMinute] = this.sTimeStart.split(':').map( (sValue: string) => parseInt(sValue) );
        return nHour * 60 + nMinute;
    }

    public get nTimeEnd(): number {
        const [nHour, nMinute] = this.sTimeEnd.split(':').map( (sValue: string) => parseInt(sValue) );
        return nHour * 60 + nMinute;
    }

    public get sTime(): string {
        return this.sTimeStart.replace(':', 'h') + ' - ' + this.sTimeEnd.replace(':', 'h');
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