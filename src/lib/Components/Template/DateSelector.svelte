<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { CONFIG } from '../../Core/Config';
    import { DATE_SELECTOR_TYPE } from '../../Core/Constants';

    import * as DATE from '../../Core/Date';

    /* ---- Component */
    let {
        nType,

        Item
    } = $props();

    let dStartDate = $derived.by( () => {
            const dDate = DATE.toDateOnly( Item.dDate );
            // Go to first Monday Day of current Week
            dDate.setDate( dDate.getDate() - dDate.getDay() + 1 );
            return dDate;
        } ),
        dDate = $derived( new Date( dStartDate.toJSON() ) ),
        sHTMLSelector = $derived.by( () => {
            let sResult = '';
            switch(nType) {
                case DATE_SELECTOR_TYPE.WEEK:
                    const aWeekDates = DATE.getDatesOfWeek(dDate),
                        dFirst = aWeekDates[0],
                        dLast = aWeekDates[ aWeekDates.length - 1 ];

                    sResult = '<span class="bulma-is-size-7">Du</span> ' + dFirst.getDate() +  ' ' + CONFIG.CALENDAR_MONTHS_ABBR[dFirst.getMonth()] + ' ' +
                        '<span class="bulma-is-size-7">au</span> ' + dLast.getDate() + ' ' + CONFIG.CALENDAR_MONTHS_ABBR[dLast.getMonth()] + ' <span class="bulma-is-size-7">' + dLast.getFullYear() + '</span>';

                    break;
                    
                case DATE_SELECTOR_TYPE.MONTH:
                    sResult = CONFIG.CALENDAR_MONTHS[dDate.getMonth()] + ' ' + dDate.getFullYear();
                    break;
            }

            return sResult;
        } );

    function change(nRatio: number): void {
        const dNewDate = new Date( dDate.toJSON() );

        switch(nType) {
            case DATE_SELECTOR_TYPE.WEEK:
                // Go to first Monday Day of current Week
                dNewDate.setDate( dNewDate.getDate() - dNewDate.getDay() + 1 );
                // Add one Week
                dNewDate.setDate( dNewDate.getDate() + (7 * nRatio) );
                dDate = dNewDate;
                break;

            case DATE_SELECTOR_TYPE.MONTH:
                // Go to first Day of current Month
                dNewDate.setDate(1);
                // Add one Month
                dNewDate.setMonth( dNewDate.getMonth() + nRatio );
                dDate = dNewDate;
                break;
        }

        Item.changeDate( new Date( dDate.toJSON() ) );
    }

    function reset(): void {
        dDate = new Date( dStartDate.toJSON() );
        Item.changeDate( new Date( dDate.toJSON() ) );
    }


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(dTimeNow).with(console.trace);
        // $inspect(oContent).with(console.trace);
    }
</script>

<div class="bulma-buttons bulma-has-addons bulma-is-flex-wrap-nowrap">
    <button class="bulma-button" onclick="{ () => change(-1) }" title="Précédent">
        <span class="bulma-icon">
            <i class="fa-solid fa-chevron-left"></i>
        </span>
    </button>
    <button class="bulma-is-flex-grow-1" onclick={reset} title="Réinitialiser">
        <span class="bulma-is-size-5">{@html sHTMLSelector}</span>
    </button>
    <button class="bulma-button" onclick="{ () => change(1) }" title="Suivant">
        <span class="bulma-icon">
            <i class="fa-solid fa-chevron-right"></i>
        </span>
    </button>
</div>

<style></style>