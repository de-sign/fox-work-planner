<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../../Core/Type';
    import type { IScheduleOptions } from '../../Class/Schedule.svelte';

    import { SCHEDULE_FORM_TYPE, SCHEDULE_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';
    import * as FORM from '../../Core/Form';

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
        sTitle: string = $state('Default Title'),
        oData: TObject = $state({}),
        oError: TObject = $state({});

    const aCustomers = Object
            .values( Customer.getAll() )
            .sort( (oA, oB) => oA.sReverseName.localeCompare(oB.sReverseName, 'fr', { numeric: true }) ),
        aDays = CONFIG.CALENDAR_DAYS,
        aWeekTypes = CONFIG.CALENDAR_WEEK_TYPE,
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
                sTitle = 'Ajoute une nouvelle heure programmée';
                break;
            case SCHEDULE_FORM_TYPE.MODIFY_SCHEDULE:
                sTitle = 'Modifie une heure programmée existante';
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

        App.oPage.open(SCHEDULE_PAGE.FORM, true);
    }

    /* -- Form */
    const oFields: TObject<TObject> = {
        // sTitle: {
        //     fCheck: null,
        //     fTransform: FORM.toCapitalize
        // },
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

            App.oPage.back();
            Pages.oView?.open(oWillView);
        }
    }

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oData).with(console.trace);
    }
</script>

<section class="fox-app-page">

    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <header class="bulma-block">
                <h1 class="bulma-title">Formulaire</h1>
                <h2 class="bulma-subtitle">{sTitle}</h2>
            </header>

            <form class="bulma-block">

                <!-- sTitle -->
                <!-- <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__sTitle">Titre</label>
                    <div class="bulma-control">
                        <input id="Schedule__sTitle" bind:value="{oData.sTitle}" class="bulma-input" type="text" placeholder="{oPlaceholder.sTitle}">
                    </div>
                </div> -->

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
                                    <option value={nIndex + 1}>
                                        {sDays}
                                    </option>
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

                <!-- nDay + sWeekType -->
                <!-- <div class="bulma-field">
                    <div class="bulma-label bulma-is-flex">
                        <label class="bulma-is-flex-grow-1 bulma-is-flex-shrink-1" for="Schedule__nDay">Jour de la semaine</label>
                        <label class="bulma-is-flex-grow-1 bulma-is-flex-shrink-1 bulma-has-text-right" for="Schedule__sWeekType">Fréquence</label>
                    </div>
                    <div class="bulma-field bulma-has-addons">
                        <div class="bulma-control bulma-is-expanded">
                            <div class="bulma-select bulma-is-fullwidth">
                                <select id="Schedule__nDay" bind:value="{oData.nDay}" >
                                    {#each aDays as sDays, nIndex}
                                        <option value={nIndex + 1}>
                                            {sDays}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div class="bulma-control bulma-is-expanded">
                            <div class="bulma-select bulma-is-fullwidth">
                                <select id="Schedule__sWeekType" bind:value="{oData.sWeekType}" >
                                    {#each aWeekTypes as oWeekType}
                                        <option value={oWeekType.sValue}>
                                            {oWeekType.sText}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                </div> -->

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

                
                <!-- sTimeStart + sTimeEnd-->
                <!-- <div class="bulma-field">
                    
                    <div class="bulma-label bulma-is-flex">
                        <label class="bulma-is-flex-grow-1 bulma-is-flex-shrink-1" for="Schedule__sTimeStart">Heure de début</label>
                        <label class="bulma-is-flex-grow-1 bulma-is-flex-shrink-1 bulma-has-text-right" for="Schedule__sTimeEnd">Heure de fin</label>
                    </div>
                    <div class="bulma-field bulma-has-addons">
                        <div class="bulma-control bulma-has-icons-right">
                            <input id="Schedule__sTimeStart" bind:value="{oData.sTimeStart}" class="bulma-input { oError.sTimeStart ? 'bulma-is-danger' : '' }" type="time" placeholder="{oPlaceholder.sTimeStart}">
                            <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                                <i class="fas fa-asterisk fa-2xs"></i>
                            </span>
                        </div>
                        <div class="bulma-control bulma-is-expanded">
                            <div class="bulma-button bulma-is-static bulma-is-fullwidth">à</div>
                        </div>
                        <div class="bulma-control bulma-has-icons-right">
                            <input id="Schedule__sTimeEnd" bind:value="{oData.sTimeEnd}" class="bulma-input { oError.sTimeEnd ? 'bulma-is-danger' : '' }" type="time" placeholder="{oPlaceholder.sTimeEnd}">
                            <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                                <i class="fas fa-asterisk fa-2xs"></i>
                            </span>
                        </div>
                    </div>
                    {#if oError.sTimeStart}
                        <i class="bulma-help bulma-has-text-danger">L'heure de début est obligatoire</i>
                    {/if}
                    {#if oError.sTimeEnd}
                        <i class="bulma-help bulma-has-text-danger">L'heure de fin est obligatoire et doit être supérieur à l'heure de début</i>
                    {/if}
                </div> -->

                <!-- nPrice -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Schedule__nPrice">Tarif horaire</label>
                    <div class="bulma-field bulma-has-addons">
                        <div class="bulma-control bulma-is-flex-grow-1">
                            <input id="Schedule__nPrice" class="bulma-input { oError.sTimeStart ? 'bulma-is-danger' : '' }" bind:value="{oData.nPrice}" type="number" placeholder="{oPlaceholder.nPrice.toFixed(2)}">
                        </div>
                        <div class="bulma-control">
                            <span class="bulma-button bulma-is-static">€</span>
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

    <!-- Navbar -->
    <nav class="fox-app-page-navbar bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button bulma-is-hovered" onclick={App.oPage.back} >
                    <span class="bulma-icon">
                        <i class="fa-solid fa-xmark"></i>
                    </span>
                    <span>Annuler</span>
                </button>
            </div>
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button" onclick={validate}>
                    <span class="bulma-icon">
                        <i class="fa-solid fa-check"></i>
                    </span>
                    <span>Valider</span>
                </button>
            </div>
        </div>
    </nav>
</section>

<style>
</style>