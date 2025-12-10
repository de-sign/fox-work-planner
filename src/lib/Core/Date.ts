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

export function getDaysOfWeek(dDate: Date): Date[] {
    const aDays: Date[] = [],
        dDay = new Date( dDate.toJSON() );

    // Go To Sunday
    dDay.setDate( dDay.getDate() - dDay.getDay() );

    // Add All days
    for( let nAdd = 0; nAdd < 7; nAdd++ ){
        aDays.push( new Date( Date.UTC(dDay.getFullYear(), dDay.getMonth(), dDay.getDate()) ) );
        dDay.setDate( dDay.getDate() + 1 );
    }

    return aDays;
}