/* ---- Import */
import type { TObject } from './Type';


/* ---- Test */
export function isDefined(uValue: any): boolean {
    return uValue != null;
}

export function isText(sValue: string): boolean {
    return !!( sValue && sValue.trim() );
}

export function isNumber(nValue: number): boolean {
    return !!( nValue && !isNaN(nValue) );
}

export function isPostalCode(sValue: string): boolean {
    const rPostaCode = new RegExp(/^(?:0[1-9]|[1-8]\d|9[0-8])\s?\d{3}$/i);
    return isText(sValue) && rPostaCode.test( sValue.trim() );
}

export function isPhoneNumber(sValue: string): boolean {
    const rPhoneNumber = new RegExp(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/i);
    return isText(sValue) && rPhoneNumber.test( sValue.trim() );
}

export function checkData(oData: TObject, oFields: TObject<TObject>, oError: TObject): boolean {

    // Clear Error
    let bError: boolean = false;
    for (let sProperty in oError){
        delete oError[sProperty];
    }

    // Check all Field
    for( let sField in oFields ){
        const oField = oFields[sField];
        if( oField.fCheck ){
            if( oField.bIsArrayData ){
                oError[sField] = [];
                oData[sField].forEach( (sValue: string, nIndex: number) => {
                    if( !oField.fCheck(sValue) ){
                        oError[sField][nIndex] = true;
                        bError = true;
                    }
                } );
            }
            else if( !oField.fCheck(oData[sField]) ){
                oError[sField] = true;
                bError = true;
            }
        }
    }

    return !bError;
}


/* ---- Transform */
export function toUpperCase(sValue: string): string {
    return sValue?.trim().toUpperCase();
}

export function toLowerCase(sValue: string): string {
    return sValue?.trim().toLowerCase();
}

export function toCapitalize(sValue: string): string {
    return sValue ? (sValue?.trim().charAt(0).toUpperCase() + sValue?.trim().slice(1) ) : '';
}

export function toTrim(sValue: string): string {
    return sValue?.trim();
}

export function toPostalCode(sValue: string): string {
    return sValue
        .replaceAll(/[\s.-]/g, '')
        .replace(/^(0[1-9]|[1-8]\d|9[0-8])/i, '$1 ');
}

export function toPhoneNumber(sValue: string): string {
    return sValue
        .replaceAll(/[\s.-]/g, '') // Delete white space, dot or minus
        .replace(/^(?:(?:\+|00)33|0)([1-9])/i, '+33$1 ') // Add prefix
        .replace(/(\d{2})/g, '$1 ')
        .trim();
}

export function transformData(oData: TObject, oFields: TObject<TObject>): TObject {
    
    const oReturn: TObject = {};

    for( let sField in oFields ){
        const oField = oFields[sField];
        if( oField.fTransform ){
            if( oField.bIsArrayData ){
                oReturn[sField] = [];
                oData[sField].forEach( (sValue: string) => {
                    oReturn[sField].push( oField.fTransform(sValue) );
                } );
            } else {
                oReturn[sField] = oField.fTransform( oData[sField] );
            }
        } else {
            oReturn[sField] = oData[sField];
        }
    }

    return oReturn;
}

/* From -> https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php */
export function toWeekData(dDate: Date): number[] {
    const dCopyDate = new Date( Date.UTC(dDate.getFullYear(), dDate.getMonth(), dDate.getDate()) );
    dCopyDate.setUTCDate( dCopyDate.getUTCDate() + 4 - (dCopyDate.getUTCDay() || 7) );
    const dFirstDay = new Date( Date.UTC(dCopyDate.getUTCFullYear(), 0, 1) );
    return [
        Math.ceil( ( ( (dCopyDate.valueOf() - dFirstDay.valueOf()) / 86400000 ) + 1 ) / 7 ),
        dCopyDate.getUTCFullYear()
    ];
}