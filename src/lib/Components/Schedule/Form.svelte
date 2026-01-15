<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { IScheduleOptions } from '../../Class/Schedule.svelte';

    import { EVENT_NAME, SCHEDULE_FORM_TYPE, SCHEDULE_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import * as FORM from '../../Core/Form';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
    import Customer from '../../Class/Customer.svelte';
    import Schedule from '../../Class/Schedule.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    /* -- Data */
    let oPlaceholder: Schedule = Schedule.oPlaceholder,
        oTarget: Schedule | undefined = $state(),
        sType: string = $state(SCHEDULE_FORM_TYPE.NEW_SCHEDULE),
        sSubTitle: string = $state('Default Title'),
        oData: TObject = $state({}),
        oError: TObject = $state({});

    const aCustomers = Object.values( Customer.getAll() ).filter( oCustomer => oCustomer.bEnable )
            .sort( (oA, oB) => oA.sReverseName.localeCompare(oB.sReverseName, 'fr', { numeric: true }) ),
        aDays = CONFIG.CALENDAR_DAYS,
        aWeekTypes = CONFIG.SCHEDULE_WEEK_TYPE,
        oDefaultData = {
            sCustomer: aCustomers[0]?.sUUID,
            nPrice: 17.00,
            nDay: 1,
            sWeekType: aWeekTypes[0].sValue,
            sTimeStart: '08:00',
            sTimeEnd: '09:00'
        };

    export function open(sFormType: string, oFormTarget ?: Schedule | TObject): void {
        
        sType = sFormType;

        // Title
        switch(sFormType){
            case SCHEDULE_FORM_TYPE.NEW_SCHEDULE:
                sSubTitle = 'Ajoute une nouvelle planification';
                break;
            case SCHEDULE_FORM_TYPE.MODIFY_SCHEDULE:
                sSubTitle = 'Modifie une planification existante';
                break;
        }

        // Data & Error
        if( oFormTarget instanceof Schedule ){
            oTarget = oFormTarget;
            oData = Object.assign( {}, oDefaultData, oTarget.clone());
        } else {
            oTarget = undefined;
            oData = Object.assign( {}, oDefaultData, oFormTarget || {});
        }
        oError = {};

        App.oPage.open(SCHEDULE_PAGE.FORM, { sUUID: oTarget?.sUUID, sFormType: sType, oData: oTarget ? null : oFormTarget });
    }

    /* -- Form */
    const oFields: TObject<TObject> = {
        sCustomer: {
            fCheck: FORM.isDefined,
            fTransform: null
        },
        nDay: {
            fCheck: FORM.isDefined,
            fTransform: null
        },
        sWeekType: {
            fCheck: FORM.isDefined,
            fTransform: null
        },
        sTimeStart: {
            fCheck: FORM.isText,
            fTransform: null
        },
        sTimeEnd: {
            fCheck: (sValue: string) => {
                return FORM.isText(oData.sTimeStart) &&
                    FORM.isText(sValue) &&
                    parseInt(oData.sTimeStart.replace(':', '')) < parseInt(sValue.replace(':', ''));
            },
            fTransform: null
        },
        nPrice: {
            fCheck: FORM.isNumber,
            fTransform: null
        },
        sInformations: {
            fCheck: null,
            fTransform: FORM.toCapitalize
        },
    };

    function validate(): void {
        if( FORM.checkData(oData, oFields, oError) ){
            const oValideData = <IScheduleOptions>FORM.transformData(oData, oFields);
            
            let oWillView: Schedule | undefined,
                oNewSchedule: Schedule;
            
            switch( sType ){
                case SCHEDULE_FORM_TYPE.NEW_SCHEDULE:
                    oNewSchedule = new Schedule(oValideData);
                    oWillView = oNewSchedule;
                    break;

                case SCHEDULE_FORM_TYPE.MODIFY_SCHEDULE:
                    oTarget?.update(oValideData);
                    oWillView = oTarget;
                    break;
            }
            
            App.oPage.back()
                .then( () => Pages.oView?.open(oWillView) );
        }
    }
        
    /* ---- Template */
    /* -- Title */
    const oTitle = $derived.by( () => {
        return {
            sTitle: 'Formulaire',
            sSubTitle: sSubTitle
        };
    } );
    
    /* -- Navbar */
    const oNavbar = {
        oBack: {
            sTitle: 'Retourner à la page précédente',
            sIcon: 'fa-chevron-left',
            sText: 'Retour',
            click: App.oPage.back
        },
        aButtons: [
            {
                sTitle: 'Valider le formulaire',
                sIcon: 'fa-check',
                sText: 'Valider',
                click: validate
            }
        ]
    };

    
    /* -- History */
    const sEventName = EVENT_NAME.URL_REDIRECTION + '_Schedule_' + SCHEDULE_PAGE.FORM;
    function redirection(oState: TObject): void {
        open(oState.sFormType, oState.sUUID ? Schedule.get(oState.sUUID) : oState.oData);
    }

    Svelte.onMount( () => App.oEmitter.on(sEventName, redirection) );
    Svelte.onDestroy( () => App.oEmitter.removeListener(sEventName, redirection) );


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oData).with(console.trace);
    }
</script>

<section class="fox-app-page">

    <!-- Page Title -->
    <Title Item={oTitle} />

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">

            <form class="bulma-block">

                <!-- sCustomer -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__sCustomer">Client</label>
                    {#if aCustomers.length}
                        <div class="bulma-control">
                            <div class="bulma-select bulma-is-fullwidth { oError.sCustomer ? 'bulma-is-danger' : '' }">
                                <select id="Schedule__sCustomer" bind:value="{oData.sCustomer}" >
                                    {#each aCustomers as oCustomer}
                                        <option value={ oCustomer.sUUID }>
                                            { oCustomer.sName }
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    {:else}
                        <div class="bulma-control">
                            <div class="bulma-button bulma-is-danger bulma-is-outlined bulma-is-fullwidth">
                                <span class="bulma-icon">
                                    <i class="fa-solid fa-user-slash"></i>
                                </span>
                                <span>Aucun client trouvé</span>
                            </div>
                        </div>
                    {/if}
                    
                    {#if oError.sCustomer}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- nDay -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__nDay">Jour de la semaine</label>
                    <div class="bulma-control">
                        <div class="bulma-select bulma-is-fullwidth { oError.nDay ? 'bulma-is-danger' : '' }">
                            <select id="Schedule__nDay" bind:value="{oData.nDay}" >
                                {#each aDays as sDays, nIndex}
                                    {#if CONFIG.CALENDAR_DAYS_BREAK.indexOf(nIndex) == -1}
                                        <option value={nIndex}>
                                            {sDays}
                                        </option>
                                    {/if}
                                {/each}
                            </select>
                        </div>
                    </div>
                    {#if oError.nDay}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- sWeekType -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__sWeekType">Fréquence mensuelle</label>
                    <div class="bulma-control">
                        <div class="bulma-select bulma-is-fullwidth { oError.sWeekType ? 'bulma-is-danger' : '' }">
                            <select id="Schedule__sWeekType" bind:value="{oData.sWeekType}" >
                                {#each aWeekTypes as oWeekType}
                                    <option value={oWeekType.sValue}>
                                        {oWeekType.sText}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>
                    {#if oError.sWeekType}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- sTimeStart -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__sTimeStart">Heure de début</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Schedule__sTimeStart" bind:value="{oData.sTimeStart}" class="bulma-input { oError.sTimeStart ? 'bulma-is-danger' : '' }" type="time" placeholder="{oPlaceholder.sTimeStart}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sTimeStart}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- sTimeEnd -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__sTimeEnd">Heure de fin</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Schedule__sTimeEnd" bind:value="{oData.sTimeEnd}" class="bulma-input { oError.sTimeEnd ? 'bulma-is-danger' : '' }" type="time" placeholder="{oPlaceholder.sTimeEnd}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sTimeEnd}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire et doit être supérieur à l'heure de début</i>
                    {/if}
                </div>

                <!-- nPrice -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__nPrice">Tarif horaire</label>
                    <div class="bulma-field bulma-has-addons">
                        <div class="bulma-control bulma-is-flex-grow-1  bulma-has-icons-right">
                            <input id="Schedule__nPrice" class="bulma-input { oError.nPrice ? 'bulma-is-danger' : '' }" bind:value="{oData.nPrice}" type="number" placeholder="{oPlaceholder.nPrice.toFixed(2)}">
                            <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                                <i class="fas fa-asterisk fa-2xs"></i>
                            </span>
                        </div>
                        <div class="bulma-control">
                            <span class="bulma-button { oError.nPrice ? 'bulma-is-danger bulma-is-outlined' : 'bulma-is-static' }">€</span>
                        </div>
                    </div>
                    {#if oError.nPrice}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- sInformations -->
                 <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__sInformations">Informations complémentaires</label>
                    <div class="bulma-control">
                        <textarea id="Schedule__sInformations" bind:value="{oData.sInformations}" class="bulma-textarea" placeholder="{oPlaceholder.sInformations}"></textarea>
                    </div>
                </div>

            </form>
        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar} />

</section>

<style>
</style>