// Imports
import type { TObject } from '../Core/Type';
import { PROPERTY_NAME, TASK_STATE, DATE_SELECTOR_TYPE } from '../Core/Constants';
import { CONFIG } from '../Core/Config';

import * as DATE from '../Core/Date';

import Store from './Store';
import Customer from './Customer.svelte';
import Schedule from './Schedule.svelte';


/**
 * Task options supplied to constructor.
 */
export interface ITaskOptions {
    _sUUID?: string;
    sCustomer: string;
    sSchedule?: string;

    bService: boolean;
    sDate: string;
    sTimeStart: string;
    sTimeEnd: string;
    nPrice: number;
    sState: string;
    sInformations?: string;
};

/**
 * Task options supplied to getOnPeriod.
 */
export interface ITaskPeriodOptions {
    dDate: Date;
    nPeriodType?: number;
    bInMonthOnly?: boolean;
    bServiceOnly?: boolean;
    bFromSchedule?: boolean;
}

const oTaskPeriodOptionsDefault: ITaskPeriodOptions = {
    dDate: DATE.getToday(),
    nPeriodType: DATE_SELECTOR_TYPE.MONTH,
    bInMonthOnly: false,
    bServiceOnly: false,
    bFromSchedule: true
};


/**
 * Task Manager class.
 * @class
 */

const _oInstances: TObject<Task> = $state({});

class Task {

    /** Manager properties.  **/
    private static _bRestored: boolean = false;
    public static oPlaceholder: Task;

    /** Manager Methods */
    public static store(): void {
        if( Task._bRestored ){
            Store.set(
                PROPERTY_NAME.APP_DATA_TASK,
                Object.values(_oInstances).map( oTask => oTask.clone() )
            );
        }
    }

    public static restore(): void {
        if( !Task._bRestored ){

            const aTasksData = Store.get(PROPERTY_NAME.APP_DATA_TASK);
            aTasksData?.forEach( (oTaskData: ITaskOptions) => {
                new Task(oTaskData);
            } );

            Task.oPlaceholder = new Task( CONFIG.TASK_PLACEHOLDER, false );
            Task._bRestored = true;
        }
    }

    public static clear(): void {
        for( let sUUID in _oInstances ){
            delete _oInstances[sUUID];
        }
        Task._bRestored = false;
    }

    public static from(oSchedule: Schedule, dDate: Date): Task {
        const oData: TObject = oSchedule.clone();

        // Add Task properties
        Object.assign( oData, {
            sSchedule: oData._sUUID,
            sDate: dDate.toJSON(),
            bService: true,
            sState: 'WAIT'
        } );

        // Add Schedule properties
        delete oData._sUUID;
        delete oData.nDay;
        delete oData.sWeekType;

        // Create Task from Schedule
        return new Task(<ITaskOptions>oData, false);
    }

    public static getAll(): TObject<Task> {
        return _oInstances;
    }

    public static get(sUUID: string): Task {
        return _oInstances[sUUID] || Task.oPlaceholder;
    }

    public static getOnPeriod(oOptions: ITaskPeriodOptions): Task[] {

        // Define Options from Default and Variables
        oOptions = Object.assign( {}, oTaskPeriodOptionsDefault, oOptions );
        const sWeekKeyTarget = DATE.getWeekData(oOptions.dDate).join('_'),
            sMonthKeyTarget = oOptions.dDate.getMonth() + '_' + oOptions.dDate.getFullYear();
        

        // Find Dates of Period, split by Weeks
        let oPeriodDates: TObject<Date[]> = {},
            aWeekKeys: string[] = [];
        
        switch( oOptions.nPeriodType ){
            case DATE_SELECTOR_TYPE.WEEK:
                oPeriodDates[sWeekKeyTarget] = DATE.getDatesOfWeek(oOptions.dDate);
                aWeekKeys.push(sWeekKeyTarget);
                break;

            case DATE_SELECTOR_TYPE.MONTH:
                oPeriodDates = DATE.getDatesOfMonth(oOptions.dDate);
                aWeekKeys = Object.keys(oPeriodDates);
                break;
        }


        // Filter Task with Options
        const aResults = Object.values( Task.getAll() )
            .filter( oTask => {
                return aWeekKeys.indexOf(oTask.sWeekKey) != -1 // Only Task in Weeks of period
                    && ( !oOptions.bInMonthOnly || oTask.sMonthKey == sMonthKeyTarget ) // Filter on Month Only if Needed
                    && ( !oOptions.bServiceOnly || oTask.bService ); // Filter Service Only if Needed
            } );
        

        // Add Tasks From Schedule
        if( oOptions.bFromSchedule ){

            // Regroup by Week
            const oTaskByWeek: TObject<Task[]> = {};
            aResults.forEach( oTask => {
                const sWeekKey = oTask.sWeekKey;
                if( !oTaskByWeek[sWeekKey] ){
                    oTaskByWeek[sWeekKey] = [];
                }
                oTaskByWeek[sWeekKey].push(oTask);
            } );

            // For all Week
            Object
                .entries(oPeriodDates)
                .forEach( ([sWeekKey, aDates]) => {
                    const nWeek = parseInt( sWeekKey.split('_')[1] ),
                        aFromSchedule: Schedule[] = [];

                    // Add enable Schedule without Task created by his 
                    oTaskByWeek[sWeekKey]?.forEach( oTask => oTask.oSchedule ? aFromSchedule.push(oTask.oSchedule) : null );
                    Object.values( Schedule.getAll() )
                        .filter( oSchedule => {
                            return oSchedule.isEnable(sWeekKey) // Customer Enable and Not delete for this week
                                && aFromSchedule.indexOf(oSchedule) == -1 // No task created
                                && oSchedule.oWeekType.fFilter(nWeek); // Good Week number for pair/impair
                        } )
                        .forEach( oSchedule => {
                            const dDate = aDates[oSchedule.nDay];
                            if(
                                oSchedule.oCustomer.dDateStart <= dDate // Only Schedule after Start Date of Customer
                                && ( !oOptions.bInMonthOnly || dDate.getMonth() == oOptions.dDate.getMonth() ) // Filter on Month Only if Needed
                            ){
                                aResults.push( Task.from( oSchedule, dDate ) );
                            }
                        } );
                } );
        }

        // Sort by Date and Return
        return aResults.sort( (oA, oB) => oA.nDate - oB.nDate || oA.nTimeStart - oB.nTimeStart );
    }
    
    /** Instance Properties */
    private _sUUID: string = '';
    public oCustomer: Customer = $state(Customer.oPlaceholder);
    public oSchedule: Schedule | undefined = $state();
    public bService: boolean = $state(true);
    public dDate: Date = $state( new Date('1970-01-01T00:00:00Z') );
    public sTimeStart: string = $state('');
    public sTimeEnd: string = $state('');
    public nPrice: number = $state(0.0);
    public sState: string = $state('');
    public sInformations: string | undefined = $state();

    public get sId(): string {
        return this.constructor.name + '-' + this._sUUID;
    }

    public get sUUID() {
        return this._sUUID;
    }

    public get nDay(): number {
        return this.dDate.getDay();
    }

    public get nDate(): number {
        return this.dDate.getDate();
    }

    public get nWeek(): number {
        return DATE.getWeekData(this.dDate)[1];
    }

    public get sWeekKey(): string {
        return DATE.getWeekData(this.dDate).join('_');
    }

    public get sMonthKey(): string {
        return this.dDate.getMonth() + '_' + this.dDate.getFullYear();
    }

    public get sDate(): string {
        return DATE.toISO8601(this.dDate);
    }

    public get sShortDate(): string {
        return CONFIG.CALENDAR_DAYS_ABBR[this.dDate.getDay()] + ' ' + this.dDate.getDate();
    }

    public get sFullDate(): string {
        return CONFIG.CALENDAR_DAYS[this.dDate.getDay()] + ' ' + this.dDate.getDate() + ' ' + CONFIG.CALENDAR_MONTHS_ABBR[this.dDate.getMonth()] + ' ' + this.dDate.getFullYear();
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

    public get nTotalPrice(): number {
        return (this.nDuration / 60 * this.nPrice);
    }

    public get sTotalPrice(): string {
        return (this.nDuration / 60 * this.nPrice).toFixed(2).replace('.', ',');
    }
    
    public get oState(): TObject {
        return CONFIG.TASK_STATE[ TASK_STATE[this.sState as keyof typeof TASK_STATE] ];
    }

    /** Constructor */
    public constructor(oData: ITaskOptions, bStore: boolean = true) {
        this._sUUID = oData._sUUID != null ? oData._sUUID : crypto.randomUUID();
        this.update(oData, bStore);
    }

    /** Destructor */
    public destroy(): void {
        // Update Schedule
        if( this.oSchedule ){
            this.oSchedule.addIgnoredWeek( this.sWeekKey );
        }

        // Delete Task
        delete _oInstances[this._sUUID];
        Task.store();
    }

    /** Instance Methods */
    private _store(): void {
        _oInstances[this._sUUID] = this;
        Task.store();
    }

    public clone(): ITaskOptions {
        return {
            _sUUID: this._sUUID,
            sCustomer: this.oCustomer.sUUID,
            sSchedule: this.oSchedule?.sUUID,
            bService: this.bService,
            sDate: this.sDate,
            sTimeStart: this.sTimeStart,
            sTimeEnd: this.sTimeEnd,
            sState:  this.sState,
            nPrice: this.nPrice,
            sInformations: this.sInformations
        };
    }

    public update(oData: ITaskOptions, bStore: boolean = true): void {
        this.oCustomer = Customer.get(oData.sCustomer);
        this.oSchedule = oData.sSchedule ? Schedule.get(oData.sSchedule) : undefined;
        this.bService = oData.bService;
        this.dDate = new Date(oData.sDate);
        this.sTimeStart = oData.sTimeStart;
        this.sTimeEnd = oData.sTimeEnd;
        this.nPrice = oData.nPrice;
        this.sState = oData.sState;
        this.sInformations = oData.sInformations;

        if( bStore ){
            this._store();
        }
    }

    public changeState(sValue: string): void {
        this.sState = sValue;
        this._store();
    }

    public wrapToStateTag(sValue: string): string {
        const sHTMLTag = this.oState.sHTMLTag;
        return `<${sHTMLTag}>${sValue}<${sHTMLTag}/>`;
    }
};

export default Task;