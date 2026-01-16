<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject, TData } from '../../Core/Type';
    import { EVENT_NAME, DATE_SELECTOR_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import * as DATE from '../../Core/Date';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';
    import DateSelector from '../Template/DateSelector.svelte';

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

    /* -- DateSelector */
    let hPage: HTMLElement | null = $state(null),
        oDateSeletorComponent: DateSelector | null = $state(null);

    const dDateNow = DATE.getToday(),
        oDateSelector = {
            dDate: dDateNow,
            changeDate: (dDateSelected: Date) => {
                dTasksDate = dDateSelected;
                App.oPage.scrollTop();
                App.oHistory.add({ sDateSelected: DATE.toISO8601(dTasksDate) });
            }
        };
        
    Svelte.onMount( () => {
        oDateSeletorComponent?.initTouch(hPage);
        Svelte.tick().then( () => App.oHistory.add({ sDateSelected: DATE.toISO8601(dTasksDate) }, true) );
    } );
    Svelte.onDestroy( () => oDateSeletorComponent?.destroyTouch() );
    

    /* -- Task */
    let dTasksDate = $state(dDateNow);
    const aTasks: Task[] = $derived.by( () => {

        const sMonthKey = dTasksDate.getMonth() + '_' + dTasksDate.getFullYear(),
            oMonthDates = DATE.getDatesOfMonth(dTasksDate),
            aResults = Object.values( Task.getAll() ).filter( oTask => oTask.bService && oTask.sMonthKey == sMonthKey ),
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
        Object
            .entries(oMonthDates)
            .forEach( ([sWeekKey, aDates]) => {
                const nWeek = parseInt( sWeekKey.split('_')[1] ),
                    aFromSchedule: Schedule[] = [];

                // Add enable Schedule without Task created by his 
                oTaskByWeek[sWeekKey]?.forEach( oTask => oTask.oSchedule ? aFromSchedule.push(oTask.oSchedule) : null );
                Object.values( Schedule.getAll() )
                    .filter( oSchedule => oSchedule.oCustomer.bEnable && aFromSchedule.indexOf(oSchedule) == -1 && oSchedule.oWeekType.fFilter(nWeek) )
                    .forEach( oSchedule => {
                        const dDate = aDates[oSchedule.nDay];
                        if( dDate.getMonth() == dTasksDate.getMonth() && oSchedule.oCustomer.dDateStart <= dDate ){
                            aResults.push( Task.from( oSchedule, dDate ) );
                        }
                    } );
            } );

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

    
    /* -- History */
    const sEventName = EVENT_NAME.URL_REDIRECTION + '_Income_1';
    function redirection(oState: TObject) {
        oDateSeletorComponent?.set( new Date( oState.sDateSelected + 'T00:00:00Z' ) );
    }

    Svelte.onMount( () => App.oEmitter.on(sEventName, redirection) );
    Svelte.onDestroy( () => App.oEmitter.removeListener(sEventName, redirection) );


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(aTasksGrouped).with(console.log);
    }
</script>

<section bind:this={hPage} class="fox-app-page">

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
        
        <!-- Month Nav -->
        <div class="fox-app-page-title-content bulma-is-align-items-center">
            <div class="fox-app-page-title-item">
                <DateSelector bind:this={oDateSeletorComponent} nType={DATE_SELECTOR_TYPE.MONTH} Item={oDateSelector} />
            </div>
        </div>
    </Navbar>
    
</section>

<style>
</style>