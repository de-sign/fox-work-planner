<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject, TData } from '../../Core/Type';
    import { CONFIG } from '../../Core/Config';
    import * as FoxDate from '../../Core/Date';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
    import Customer from '../../Class/Customer.svelte';
    import Schedule from '../../Class/Schedule.svelte';
    import Task from '../../Class/Task.svelte';

    import ItemTask from '../Task/Item.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    /* -- Change Month */
    let dFirstDay = new Date();
    dFirstDay = new Date( Date.UTC(dFirstDay.getFullYear(), dFirstDay.getMonth(), 1) );

    // Go to first Day of current Month
    let dFirstDayOfMonth = $state( new Date(dFirstDay.toJSON()) ),
        sMonthKey = $derived( dFirstDayOfMonth.getMonth() + '_' + dFirstDayOfMonth.getFullYear() );

    function changeMonth(nRatio: number): void {
        if( nRatio ){
            dFirstDayOfMonth.setMonth( dFirstDayOfMonth.getMonth() + nRatio );
            dFirstDayOfMonth = new Date( dFirstDayOfMonth.toJSON() );
        } else {
            dFirstDayOfMonth = new Date( dFirstDay.toJSON() );
        }
        App.oPage.scrollTop();
    }

    /* -- Get Task and create from Schedule */

    // Get all Days of this Month by Week
    const oDays: TObject<Date[]> = $derived.by( () => {
        const oResult: TObject<Date[]> = {},
            dDay = new Date( dFirstDayOfMonth.toJSON() );
        
        do {
            const sWeekKey = FoxDate.toWeekData(dDay).join('_');
            oResult[sWeekKey] = FoxDate.getDaysOfWeek(dDay);
            dDay.setDate( dDay.getDate() + 7 );
        } while( dDay.getMonth() == dFirstDayOfMonth.getMonth() || dDay.getDay() > dDay.getDate() ) 

        return oResult;
    } );


    // Get All enable Task of this Month
    const aTasks: Task[] = $derived.by( () => {
        const aResults = Object.values( Task.getAll() ).filter( oTask => oTask.sMonthKey == sMonthKey ),
            oTaskByWeek: TObject<Task[]> = {};

        // Regroup by Week
        aResults.forEach( oTask => {
            const sWeekKey = oTask.sWeekKey;
            if( !oTaskByWeek[sWeekKey] ){
                oTaskByWeek[sWeekKey] = [];
            }
            oTaskByWeek[sWeekKey].push(oTask);
        } );

        // For all Week
        for( let sWeekKey in oDays ){
            const aDates = oDays[sWeekKey],
                nWeek = parseInt( sWeekKey.split('_')[0] ),
                aFromSchedule: Schedule[] = [];

            // Add enable Schedule without Task created by his 
            oTaskByWeek[sWeekKey]?.forEach( oTask => oTask.oSchedule ? aFromSchedule.push(oTask.oSchedule) : null );
            Object.values( Schedule.getAll() )
                .filter( oSchedule => oSchedule.oCustomer.bEnable && aFromSchedule.indexOf(oSchedule) == -1 && oSchedule.oWeekType.fFilter(nWeek) )
                .forEach( oSchedule => {
                    const dDate = aDates[oSchedule.nDay];
                    if( dDate.getMonth() == dFirstDayOfMonth.getMonth() ){
                        aResults.push( Task.from( oSchedule, dDate ) );
                    }
                } );
        }

        return aResults;
    } );

    const oCustomers = Customer.getAll(),
        aTasksGrouped = $derived.by( () => {
            const aReturn: TObject[] = [],
                oCustomerTask: TObject<Task[]> = {};

            // Group and Sort
            aTasks
                .sort( (oA, oB) => oA.nDate - oB.nDate || oA.nTimeStart - oB.nTimeStart )
                .forEach( oTask => {
                    let sCustomer = oTask.oCustomer.sUUID;
                    if( !oCustomerTask[sCustomer] ){
                        oCustomerTask[sCustomer] = [];
                    }
                    oCustomerTask[sCustomer].push(oTask);
                } );

            Object.keys(oCustomerTask)
                .sort( (sA, sB) => oCustomers[sA].sName.localeCompare(oCustomers[sB].sName, 'fr', { numeric: true }) )
                .forEach( sCustomer => {
                    const nTotalPrice = oCustomerTask[sCustomer].reduce( (nValue, oTask) => nValue + (oTask.sState == 'VALID' ? oTask.nTotalPrice : 0.00), 0.00 ),
                        nTheoricPrice = oCustomerTask[sCustomer].reduce( (nValue, oTask) => nValue + (oTask.sState != 'CANCEL' ? oTask.nTotalPrice : 0.00), 0.00 );

                    aReturn.push( {
                        oCustomer: oCustomers[sCustomer],
                        aTasks: oCustomerTask[sCustomer],
                        nTheoricPrice: nTheoricPrice,
                        nTotalPrice: nTotalPrice,
                        sTheoricPrice: nTheoricPrice.toFixed(2).replace('.', ','),
                        sTotalPrice: nTotalPrice.toFixed(2).replace('.', ',')
                    } );
                } );

            return aReturn;
        } ),
        oPrices: TData = $derived.by( () => {
            const nTheoricPrice = aTasksGrouped.reduce( (nValue, oGroup) => nValue + oGroup.nTheoricPrice, 0.00 ),
                nTotalPrice = aTasksGrouped.reduce( (nValue, oGroup) => nValue + oGroup.nTotalPrice, 0.00 );

            return {
                sTheoric: nTheoricPrice.toFixed(2).replace('.', ','),
                sTotal: nTotalPrice.toFixed(2).replace('.', ',')
            };
        } );
        
    /* ---- Template */
    /* -- Title */
    const oTitle = {
        sTitle: 'Rémunération',
        sSubTitle: 'Visualise ton revenue'
    };

    /* -- Navbar */
    const oNavbar = $derived.by( () => {
        return {
            oBack: {
                sTitle: 'Ouvrir le menu',
                sIcon: 'fa-bars',
                sText: 'Menu',
                click: App.oMenu.open
            },
            aButtons: [
                {
                    sTitle: 'Tarif théorique',
                    sText: '' + 
                        '<b>Total</b><br/>' + 
                        '<i>(' + oPrices.sTheoric + '&nbsp;€)</i>',
                    bButton: false,
                    sClass: 'bulma-has-text-right bulma-is-size-7'
                },
                {
                    sTitle: 'Tarif total',
                    sText: oPrices.sTotal + '&nbsp;€',
                    bButton: false,
                    sClass: 'bulma-is-size-5'
                }
            ]
        };
    } );

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(aTasksGrouped).with(console.log);
    }
</script>

<section class="fox-app-page">

    <!-- Page Title -->
    <Title Item={oTitle} />

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            {#each aTasksGrouped as oGroup}
                <section class="bulma-block">
                    <div class="fox-separator">
                        <span>{oGroup.oCustomer.sName}</span>
                    </div>
                    <table class="bulma-table bulma-is-fullwidth">
                        <tbody class="bulma-is-size-7">
                            {#each oGroup.aTasks as oTask}
                                <ItemTask sType="tablerow" Item={{ oTarget: oTask }}/>
                            {/each}
                        </tbody>
                        <tfoot class="bulma-has-text-right">
                            <tr>
                                <td colspan="3">
                                    Sous total
                                    <i class="bulma-is-size-7 bulma-ml-4 bulma-mr-2">({oGroup.sTheoricPrice}&nbsp;€)</i>
                                    <b>{oGroup.sTotalPrice}&nbsp;€</b>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
            {:else}
                <div class="bulma-notification bulma-has-text-centered">
                    <span class="bulma-icon-text">
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </span>
                        <span>Aucune tâche trouvé</span>
                    </span>
                </div>
            {/each}
        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar}>
        
        <!-- Week Nav -->
        <div class="fox-app-page-title-content bulma-is-align-items-center">
            <div class="fox-app-page-title-item bulma-buttons bulma-has-addons bulma-is-flex-wrap-nowrap">
                <button class="bulma-button" onclick="{ () => changeMonth(-1) }" title="Aller au mois précédent">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-left"></i>
                    </span>
                </button>
                <button class="bulma-is-flex-grow-1" onclick="{ () => changeMonth(0) }" title="Aller au mois courant">
                    <span class="bulma-is-size-5">
                        {CONFIG.CALENDAR_MONTHS[dFirstDayOfMonth.getMonth()]} {dFirstDayOfMonth.getFullYear()}
                    </span>
                </button>
                <button class="bulma-button" onclick="{ () => changeMonth(1) }" title="Aller au mois suivant">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-chevron-right"></i>
                    </span>
                </button>
            </div>
        </div>
    </Navbar>
    
</section>

<style>
</style>