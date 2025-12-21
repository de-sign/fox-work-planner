import type { TObject, TData } from "./Type";

export function toDateOnly(dDate: Date): Date {
    return new Date( Date.UTC(dDate.getFullYear(), dDate.getMonth(), dDate.getDate()) );
}

export function toISO8601(dDate: Date): string {
    return dDate.toJSON().split('T')[0];
}

/* From -> https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php */
export function getWeekData(dDate: Date): number[] {
    const dCopyDate = toDateOnly(dDate);
    dCopyDate.setUTCDate( dCopyDate.getUTCDate() + 4 - (dCopyDate.getUTCDay() || 7) );
    const dFirstDay = new Date( Date.UTC(dCopyDate.getUTCFullYear(), 0, 1) );
    return [
        dCopyDate.getUTCFullYear(),
        Math.ceil( ( ( (dCopyDate.valueOf() - dFirstDay.valueOf()) / 86400000 ) + 1 ) / 7 )
    ];
}

// Get all Days of this Week
export function getDatesOfWeek(dDate: Date): Date[] {
    const aDays: Date[] = [],
        dDay = toDateOnly(dDate);

    // Go To Sunday
    dDay.setDate( dDay.getDate() - dDay.getDay() );

    // Add All days
    for( let nAdd = 0; nAdd < 7; nAdd++ ){
        aDays.push( toDateOnly(dDay) );
        dDay.setDate( dDay.getDate() + 1 );
    }

    return aDays;
}

// Get all Days of this Month by Week
export function getDatesOfMonth(dDate: Date): TObject<Date[]> {

    // Go to first Day of current Month
    const oDays: TObject<Date[]> = {},
        dDay = new Date( Date.UTC(dDate.getFullYear(), dDate.getMonth(), 1) );
        
        do {
            const oWeekDates = getDatesOfWeek(dDay),
                sWeekKey = getWeekData(oWeekDates[1]).join('_');
            oDays[sWeekKey] = oWeekDates;
            dDay.setDate( dDay.getDate() + 7 );
        } while( dDay.getMonth() == dDate.getMonth() || dDay.getDay() > dDay.getDate() );

    return oDays;
}

/* From -> https://calendrier.api.gouv.fr/jours-feries/metropole.json */
export const PUBLIC_HOLIDAYS: TData = {
  "2030-01-01": "1er janvier",
  "2030-04-22": "Lundi de Pâques",
  "2030-05-01": "1er mai",
  "2030-05-08": "8 mai",
  "2030-05-30": "Ascension",
  "2030-06-10": "Lundi de Pentecôte",
  "2030-07-14": "14 juillet",
  "2030-08-15": "Assomption",
  "2030-11-01": "Toussaint",
  "2030-11-11": "11 novembre",
  "2030-12-25": "Jour de Noël",
  "2029-01-01": "1er janvier",
  "2029-04-02": "Lundi de Pâques",
  "2029-05-01": "1er mai",
  "2029-05-08": "8 mai",
  "2029-05-10": "Ascension",
  "2029-05-21": "Lundi de Pentecôte",
  "2029-07-14": "14 juillet",
  "2029-08-15": "Assomption",
  "2029-11-01": "Toussaint",
  "2029-11-11": "11 novembre",
  "2029-12-25": "Jour de Noël",
  "2028-01-01": "1er janvier",
  "2028-04-17": "Lundi de Pâques",
  "2028-05-01": "1er mai",
  "2028-05-08": "8 mai",
  "2028-05-25": "Ascension",
  "2028-06-05": "Lundi de Pentecôte",
  "2028-07-14": "14 juillet",
  "2028-08-15": "Assomption",
  "2028-11-01": "Toussaint",
  "2028-11-11": "11 novembre",
  "2028-12-25": "Jour de Noël",
  "2027-01-01": "1er janvier",
  "2027-03-29": "Lundi de Pâques",
  "2027-05-01": "1er mai",
  "2027-05-06": "Ascension",
  "2027-05-08": "8 mai",
  "2027-05-17": "Lundi de Pentecôte",
  "2027-07-14": "14 juillet",
  "2027-08-15": "Assomption",
  "2027-11-01": "Toussaint",
  "2027-11-11": "11 novembre",
  "2027-12-25": "Jour de Noël",
  "2026-01-01": "1er janvier",
  "2026-04-06": "Lundi de Pâques",
  "2026-05-01": "1er mai",
  "2026-05-08": "8 mai",
  "2026-05-14": "Ascension",
  "2026-05-25": "Lundi de Pentecôte",
  "2026-07-14": "14 juillet",
  "2026-08-15": "Assomption",
  "2026-11-01": "Toussaint",
  "2026-11-11": "11 novembre",
  "2026-12-25": "Jour de Noël",
  "2025-01-01": "1er janvier",
  "2025-04-21": "Lundi de Pâques",
  "2025-05-01": "1er mai",
  "2025-05-08": "8 mai",
  "2025-05-29": "Ascension",
  "2025-06-09": "Lundi de Pentecôte",
  "2025-07-14": "14 juillet",
  "2025-08-15": "Assomption",
  "2025-11-01": "Toussaint",
  "2025-11-11": "11 novembre",
  "2025-12-25": "Jour de Noël",
  "2024-01-01": "1er janvier",
  "2024-04-01": "Lundi de Pâques",
  "2024-05-01": "1er mai",
  "2024-05-08": "8 mai",
  "2024-05-09": "Ascension",
  "2024-05-20": "Lundi de Pentecôte",
  "2024-07-14": "14 juillet",
  "2024-08-15": "Assomption",
  "2024-11-01": "Toussaint",
  "2024-11-11": "11 novembre",
  "2024-12-25": "Jour de Noël",
  "2023-01-01": "1er janvier",
  "2023-04-10": "Lundi de Pâques",
  "2023-05-01": "1er mai",
  "2023-05-08": "8 mai",
  "2023-05-18": "Ascension",
  "2023-05-29": "Lundi de Pentecôte",
  "2023-07-14": "14 juillet",
  "2023-08-15": "Assomption",
  "2023-11-01": "Toussaint",
  "2023-11-11": "11 novembre",
  "2023-12-25": "Jour de Noël",
  "2022-01-01": "1er janvier",
  "2022-04-18": "Lundi de Pâques",
  "2022-05-01": "1er mai",
  "2022-05-08": "8 mai",
  "2022-05-26": "Ascension",
  "2022-06-06": "Lundi de Pentecôte",
  "2022-07-14": "14 juillet",
  "2022-08-15": "Assomption",
  "2022-11-01": "Toussaint",
  "2022-11-11": "11 novembre",
  "2022-12-25": "Jour de Noël",
  "2021-01-01": "1er janvier",
  "2021-04-05": "Lundi de Pâques",
  "2021-05-01": "1er mai",
  "2021-05-08": "8 mai",
  "2021-05-13": "Ascension",
  "2021-05-24": "Lundi de Pentecôte",
  "2021-07-14": "14 juillet",
  "2021-08-15": "Assomption",
  "2021-11-01": "Toussaint",
  "2021-11-11": "11 novembre",
  "2021-12-25": "Jour de Noël",
  "2020-01-01": "1er janvier",
  "2020-04-13": "Lundi de Pâques",
  "2020-05-01": "1er mai",
  "2020-05-08": "8 mai",
  "2020-05-21": "Ascension",
  "2020-06-01": "Lundi de Pentecôte",
  "2020-07-14": "14 juillet",
  "2020-08-15": "Assomption",
  "2020-11-01": "Toussaint",
  "2020-11-11": "11 novembre",
  "2020-12-25": "Jour de Noël"
};