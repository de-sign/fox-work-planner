<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import type { TObject } from '../../Core/Type';
    import type { ITaskOptions } from '../../Class/Task.svelte';

    import { TASK_FORM_TYPE, TASK_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as FORM from '../../Core/Form';
    import * as DATE from '../../Core/Date';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
    import Customer from '../../Class/Customer.svelte';
    import Task from '../../Class/Task.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    /* -- Data */
    let oPlaceholder: Task = Task.oPlaceholder,
        oTarget: Task | undefined = $state(),
        sType: string = $state(TASK_FORM_TYPE.NEW_TASK),
        sSubTitle: string = $state('Default Title'),
        oData: TObject = $state({}),
        oError: TObject = $state({});

    const aCustomers = Object.values( Customer.getAll() ).filter( oCustomer => oCustomer.bEnable )
            .sort( (oA, oB) => oA.sReverseName.localeCompare(oB.sReverseName, 'fr', { numeric: true }) ),
        oDefaultData = {
            sCustomer: aCustomers[0]?.sUUID,
            bService: true,
            sDate: DATE.toISO8601( new Date() ),
            sTimeStart: '08:00',
            sTimeEnd: '09:00',
            nPrice: 17.00,
            sState: 'WAIT'
        };

    export function open(sFormType: string, oFormTarget ?: Task | TObject): void {
        
        sType = sFormType;

        // Title
        switch(sFormType){
            case TASK_FORM_TYPE.NEW_TASK:
                sSubTitle = 'Ajoute une nouvelle tâche';
                break;
            case TASK_FORM_TYPE.MODIFY_TASK:
                sSubTitle = 'Modifie une tâche existante';
                break;
        }

        // Data & Error
        if( oFormTarget instanceof Task ){
            oTarget = oFormTarget;
            oData = Object.assign( {}, oDefaultData, oTarget.clone());
        } else {
            oTarget = undefined;
            oData = Object.assign( {}, oDefaultData, oFormTarget || {});
        }
        oError = {};

        App.oPage.open(TASK_PAGE.FORM, true);
    }

    /* -- Form */
    const oFields: TObject<TObject> = {
        sCustomer: {
            fCheck: FORM.isDefined,
            fTransform: null
        },
        sSchedule: {
            fCheck: null,
            fTransform: null
        },
        bService: {
            fCheck: FORM.isDefined,
            fTransform: null
        },
        sDate: {
            fCheck: FORM.isDefined,
            fTransform: (sValue: string) => {
                return sValue + 'T00:00:00Z';
            }
        },
        sTimeStart: {
            fCheck: FORM.isText,
            fTransform: null
        },
        sTimeEnd: {
            fCheck: (sValue: string) => {
                return !oData.bService ||
                    (
                        FORM.isText(oData.sTimeStart) &&
                        FORM.isText(sValue) &&
                        parseInt(oData.sTimeStart.replace(':', '')) < parseInt(sValue.replace(':', ''))
                    );
            },
            fTransform: (sValue: string) => {
                if( !oData.bService && FORM.isText(oData.sTimeStart) ){
                    const [sHour, sMin] = oData.sTimeStart.split(':');
                    sValue = ( parseInt(sHour) + 1 ) + ':' + sMin;
                }
                return sValue;
            }
        },
        nPrice: {
            fCheck: (nValue: number) => {
                return !oData.bService || FORM.isNumber(nValue);
            },
            fTransform: null
        },
        sState: {
            fCheck: FORM.isDefined,
            fTransform: null
        },
        sInformations: {
            fCheck: null,
            fTransform: FORM.toCapitalize
        },
    };

    function validate(): void {
        if( FORM.checkData(oData, oFields, oError) ){
            const oValideData = <ITaskOptions>FORM.transformData(oData, oFields);
            
            let oWillView: Task | undefined,
                oNewTask: Task;
            
            switch( sType ){
                case TASK_FORM_TYPE.NEW_TASK:
                    oNewTask = new Task(oValideData);
                    oWillView = oNewTask;
                    break;

                case TASK_FORM_TYPE.MODIFY_TASK:
                    oTarget?.update(oValideData);
                    oWillView = oTarget;
                    break;
            }

            App.oPage.back();
            Pages.oView?.open(oWillView);
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
                    <label class="bulma-label" for="Task__sCustomer">Client</label>
                    {#if aCustomers.length}
                        <div class="bulma-control">
                            <div class="bulma-select bulma-is-fullwidth { oError.sCustomer ? 'bulma-is-danger' : '' }">
                                <select id="Task__sCustomer" bind:value="{oData.sCustomer}" >
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

                <!-- bService -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Task__bService">Type</label>
                    <div class="bulma-control">
                        <div class="bulma-select bulma-is-fullwidth { oError.bService ? 'bulma-is-danger' : '' }">
                            <select id="Task__bService" bind:value="{oData.bService}" >
                                <option value={true}>Prestation de service</option>
                                <option value={false}>Rendez-vous</option>
                            </select>
                        </div>
                    </div>
                    {#if oError.bService}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- sDate -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Task__sDate">Date</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Task__sDate" bind:value="{oData.sDate}" class="bulma-input { oError.sDate ? 'bulma-is-danger' : '' }" type="date" placeholder="{oPlaceholder.sDate}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sDate}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- sTimeStart -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Task__sTimeStart">Heure de début</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Task__sTimeStart" bind:value="{oData.sTimeStart}" class="bulma-input { oError.sTimeStart ? 'bulma-is-danger' : '' }" type="time" placeholder="{oPlaceholder.sTimeStart}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sTimeStart}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                {#if oData.bService}

                    <!-- sTimeEnd -->
                    <div class="bulma-field">
                        <label class="bulma-label" for="Task__sTimeEnd">Heure de fin</label>
                        <div class="bulma-control bulma-has-icons-right">
                            <input id="Task__sTimeEnd" bind:value="{oData.sTimeEnd}" class="bulma-input { oError.sTimeEnd ? 'bulma-is-danger' : '' }" type="time" placeholder="{oPlaceholder.sTimeEnd}">
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
                        <label class="bulma-label" for="Task__nPrice">Tarif horaire</label>
                        <div class="bulma-field bulma-has-addons">
                            <div class="bulma-control bulma-is-flex-grow-1  bulma-has-icons-right">
                                <input id="Task__nPrice" class="bulma-input { oError.nPrice ? 'bulma-is-danger' : '' }" bind:value="{oData.nPrice}" type="number" placeholder="{oPlaceholder.nPrice.toFixed(2)}">
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
                {/if}

                <!-- sInformations -->
                 <div class="bulma-field">
                    <label class="bulma-label" for="Task__sInformations">Informations complémentaires</label>
                    <div class="bulma-control">
                        <textarea id="Task__sInformations" bind:value="{oData.sInformations}" class="bulma-textarea" placeholder="{oPlaceholder.sInformations}"></textarea>
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