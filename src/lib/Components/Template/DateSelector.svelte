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

    let dDate = $derived( DATE.toDateOnly(Item.dDate) ),
        sHTMLSelector = $derived.by( () => {
            let sResult = '';
            switch(nType) {
                case DATE_SELECTOR_TYPE.WEEK:
                    const aWeekDates = DATE.getDatesOfWeek(dDate),
                        dFirst = aWeekDates[0],
                        dLast = aWeekDates[ aWeekDates.length - 1 ];

                    sResult = '<span class="bulma-is-size-7">Du</span> ' + dFirst.getDate() +  ' ' + CONFIG.CALENDAR_MONTHS_ABBR[dFirst.getMonth()] + ' ' +
                        '<span class="bulma-is-size-7">au</span> ' + dLast.getDate() + ' ' + CONFIG.CALENDAR_MONTHS_ABBR[dLast.getMonth()] + ' ' +
                        '<span class="bulma-is-size-7">' + dLast.getFullYear() + '</span>';
                    break;
                    
                case DATE_SELECTOR_TYPE.MONTH:
                    sResult = CONFIG.CALENDAR_MONTHS[dDate.getMonth()] + ' ' + dDate.getFullYear();
                    break;
            }

            return sResult;
        } );

    
    export function set(dNewDate: Date): void {
        dNewDate = DATE.toDateOnly(dNewDate);
        if( dDate.valueOf() != dNewDate.valueOf() ){
            dDate = dNewDate;
            Item.changeDate( new Date( dDate.toJSON() ) );
        }
    }

    function change(nRatio: number): void {
        let dNewDate = DATE.toDateOnly(dDate),
            bInScope = false;

        switch(nType) {
            case DATE_SELECTOR_TYPE.WEEK:
                dNewDate.setDate( dNewDate.getDate() - dNewDate.getDay() + 1 ); // Go to first Monday Day of current Week
                dNewDate.setDate( dNewDate.getDate() + (7 * nRatio) ); // Add one Week
                bInScope = DATE.getWeekData(dNewDate).join('_') == DATE.getWeekData(Item.dDate).join('_');
                break;
            
            case DATE_SELECTOR_TYPE.MONTH:
                dNewDate.setDate(1); // Go to first Day of current Month
                dNewDate.setMonth( dNewDate.getMonth() + nRatio ); // Add one Month
                bInScope = dNewDate.getMonth() == Item.dDate.getMonth();
                break;
        }

        set( bInScope ? Item.dDate : dNewDate );
    }

    function reset(): void {
        set(Item.dDate);
    }


    /* -- Swipper */
    let oTouch: Touch | null = null,
        hTouchArea: HTMLElement | null = null;

    // Result : -1: LEFT, 0: NONE, 1: RIGHT
    function getDirection(oChangedTouch: Touch): number {
        let nResult = 0;
        if( oTouch ){
            const nDelta = oChangedTouch.screenX - oTouch?.screenX;
            if( nDelta && Math.abs(nDelta) >= CONFIG.DATE_SELECTOR_SWIP_DISTANCE ){
                nResult = nDelta > 0 ? 1 : -1;
            }
        }
        return nResult;
    }

    function startTouch(oEvent: TouchEvent): void {
        if( !oTouch ){
            oTouch = oEvent.changedTouches[0];
        }
    }

    function moveTouch(oEvent: TouchEvent): void {
        [...oEvent.changedTouches].forEach( oChangedTouch => {
            if( hTouchArea && oTouch?.identifier == oChangedTouch.identifier ){
                const nDirection = getDirection(oChangedTouch),
                    sClass = CONFIG.DATE_SELECTOR_SWIP_CLASS[ nDirection + 1 ];
                hTouchArea.classList.remove(...CONFIG.DATE_SELECTOR_SWIP_CLASS);
                hTouchArea.classList.add(sClass);
            }
        } );
    }

    function endTouch(oEvent: TouchEvent): void {
        [...oEvent.changedTouches].forEach( oChangedTouch => {
            if( oTouch?.identifier == oChangedTouch.identifier ){
                const nDirection = getDirection(oChangedTouch);
                if( nDirection ){
                    change( -1 * nDirection );
                    hTouchArea?.classList.remove(...CONFIG.DATE_SELECTOR_SWIP_CLASS);
                }
                oTouch = null;
            }
        } );
    }

    export function initTouch(hElement: HTMLElement | null): void {
        if( hElement && !hTouchArea ){
            hTouchArea = hElement;
            hTouchArea.addEventListener('touchstart', startTouch);
            hTouchArea.addEventListener('touchmove', moveTouch);
            hTouchArea.addEventListener('touchend', endTouch);
            hTouchArea.addEventListener('touchcancel', startTouch);
        }
    }
    
    export function destroyTouch(): void {
        if( hTouchArea ){
            hTouchArea.removeEventListener('touchstart', startTouch);
            hTouchArea.removeEventListener('touchmove', moveTouch);
            hTouchArea.removeEventListener('touchend', endTouch);
            hTouchArea.removeEventListener('touchcancel', startTouch);
        }
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