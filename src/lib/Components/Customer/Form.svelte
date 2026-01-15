<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { IContactOptions } from '../../Class/Contact.svelte';

    import { EVENT_NAME, CUSTOMER_FORM_TYPE, CUSTOMER_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import * as Svelte from 'svelte';
    import * as FORM from '../../Core/Form';
    import * as DATE from '../../Core/Date';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
    import Contact from '../../Class/Contact.svelte';
    import Customer from '../../Class/Customer.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();

    /* -- Data */
    let oPlaceholder: Contact = Contact.oPlaceholder,
        oTarget: TObject | undefined = $state({}),
        sType: string = $state(CUSTOMER_FORM_TYPE.NEW_CUSTOMER),
        sSubTitle: string = $state('Ajoute un nouveau client'),
        oData: TObject = $state({ aPhoneNumbers: [null] }),
        oError: TObject = $state({ aPhoneNumbers: [] }),
        bCustomer: boolean = $derived(
            sType == CUSTOMER_FORM_TYPE.NEW_CUSTOMER // If new Customer
            || oTarget?.oCustomer?.oMainContact == oTarget?.oContact // If Contact modified is main contact of customer
        );

    export function open(sFormType: string, oFormTarget ?: TObject): void {

        sType = sFormType;
        oTarget = oFormTarget;
        
        // Title
        switch(sFormType){
            case CUSTOMER_FORM_TYPE.NEW_CUSTOMER:
                sSubTitle = 'Ajoute un nouveau client';
                break;
            case CUSTOMER_FORM_TYPE.NEW_CONTACT:
                sSubTitle = 'Ajoute un nouveau contact';
                break;
            case CUSTOMER_FORM_TYPE.MODIFY_CONTACT:
                sSubTitle = 'Modifie un contact existant';
                break;
        }

        // Data & Error
        oData = oTarget && oTarget.oContact ? oTarget.oContact.clone() : { aPhoneNumbers: [null] };
        oError = { aPhoneNumbers: [] };

        // Add custom Date Start
        if( bCustomer ){
            oData.sDateStart = oTarget?.oCustomer?.sDateStart || DATE.toISO8601( new Date() );
        }

        App.oPage.open(CUSTOMER_PAGE.FORM, { sUUID: oTarget?.oContact?.sUUID, sFormType: sType });
    }

    function addPhoneNumber(): void {
        oData.aPhoneNumbers.push(null);
    }

    function removePhoneNumber(nIndex: number): void {
        oData.aPhoneNumbers.splice(nIndex, 1);
    }

    /* -- Form */
    const oFields: TObject<TObject> = {
        sFirstName: {
            fCheck: FORM.isText,
            fTransform: FORM.toCapitalize
        },
        sLastName: {
            fCheck: FORM.isText,
            fTransform: FORM.toUpperCase
        },
        sAddress: {
            fCheck: FORM.isText,
            fTransform: FORM.toCapitalize
        },
        sAddressSupplement: {
            fCheck: null,
            fTransform: FORM.toCapitalize
        },
        sPostalCode: {
            fCheck: FORM.isPostalCode,
            fTransform: FORM.toPostalCode
        },
        sCity: {
            fCheck: FORM.isText,
            fTransform: FORM.toUpperCase
        },
        aPhoneNumbers: {
            bIsArrayData: true,
            fCheck: FORM.isPhoneNumber,
            fTransform: FORM.toPhoneNumber
        },
        sDateStart: {
            fCheck: (sValue: string) => {
                return bCustomer ? FORM.isDefined(sValue) : true;
            },
            fTransform: null
        },
        sInformations: {
            fCheck: null,
            fTransform: FORM.toCapitalize
        },
        bHasKey: {
            fCheck: null,
            fTransform: null
        }
    };

    function validate(): void {
        if( FORM.checkData(oData, oFields, oError) ){
            const oValideData = <IContactOptions>FORM.transformData(oData, oFields),
                sDateStart = oData.sDateStart + 'T00:00:00Z'; // Custom Data
            
            let oWillView: Customer | Contact | null = null,
                oNewContact: Contact;
            
            switch( sType ){
                case CUSTOMER_FORM_TYPE.NEW_CUSTOMER:
                    oNewContact = new Contact(oValideData);
                    oWillView = new Customer( {
                        sMainContact: oNewContact.sUUID,
                        sDateStart: sDateStart
                    } );
                    break;

                case CUSTOMER_FORM_TYPE.NEW_CONTACT:
                    oNewContact = new Contact(oValideData);
                    oTarget?.oCustomer.addExtraContact(oNewContact);
                    oWillView = oNewContact;
                    break;

                case CUSTOMER_FORM_TYPE.MODIFY_CONTACT:
                    oTarget?.oContact.update(oValideData);
                    // If Customer
                    if( bCustomer ){
                        // Then open Customer
                        if( oTarget ){
                            oTarget.oCustomer.update({ sDateStart: sDateStart });
                            oWillView = oTarget.oCustomer;
                        }
                    } else {
                        // Else open extra Contact
                        oWillView = oTarget?.oContact;
                    }
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
    const sEventName = EVENT_NAME.URL_REDIRECTION + '_Customer_' + CUSTOMER_PAGE.FORM;
    function redirection(oState: TObject): void {
        let oTarget = undefined;
        if( oState.sUUID ){
            const oContact = Contact.get(oState.sUUID);
            oTarget = {
                oContact: oContact,
                oCustomer: oContact.oIsExtraOf
            };
        }
        open(oState.sFormType, oTarget);
    }

    Svelte.onMount( () => App.oEmitter.on(sEventName, redirection) );
    Svelte.onDestroy( () => App.oEmitter.removeListener(sEventName, redirection) );


    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(bCustomer).with(console.trace);
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

                <!-- public sFirstName: string = ''; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__sFirstName">Prénom</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Customer__sFirstName" bind:value="{oData.sFirstName}" class="bulma-input { oError.sFirstName ? 'bulma-is-danger' : '' }" type="text" placeholder="{oPlaceholder.sFirstName}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sFirstName}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- public sLastName: string = ''; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__sLastName">Nom</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Customer__sLastName" bind:value="{oData.sLastName}" class="bulma-input { oError.sLastName ? 'bulma-is-danger' : '' }" type="text" placeholder="{oPlaceholder.sLastName}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sLastName}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- public sAddress: string = ''; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__sAddress">Adresse</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Customer__sAddress" bind:value="{oData.sAddress}" class="bulma-input { oError.sAddress ? 'bulma-is-danger' : '' }" type="text" placeholder="{oPlaceholder.sAddress}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sAddress}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- public sAddressSupplement: string | undefined; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__sAddressSupplement">Supplément d'adresse</label>
                    <div class="bulma-control">
                        <input id="Customer__sAddressSupplement" bind:value="{oData.sAddressSupplement}" class="bulma-input" type="text" placeholder="{oPlaceholder.sAddressSupplement}">
                    </div>
                </div>

                <!-- public sPostalCode: string = ''; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__sPostalCode">Code postale</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Customer__sPostalCode" bind:value="{oData.sPostalCode}" class="bulma-input { oError.sPostalCode ? 'bulma-is-danger' : '' }" type="text" placeholder="{oPlaceholder.sPostalCode}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sPostalCode}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire et doit être un nombre à 5 chiffres</i>
                    {/if}
                </div>

                <!-- public sCity: string = ''; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__sCity">Ville</label>
                    <div class="bulma-control bulma-has-icons-right">
                        <input id="Customer__sCity" bind:value="{oData.sCity}" class="bulma-input { oError.sCity ? 'bulma-is-danger' : '' }" type="text" placeholder="{oPlaceholder.sCity}">
                        <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                            <i class="fas fa-asterisk fa-2xs"></i>
                        </span>
                    </div>
                    {#if oError.sCity}
                        <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                    {/if}
                </div>

                <!-- public aPhoneNumbers: string[] = []; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__aPhoneNumbers_0">Numéro de téléphone</label>
                    {#each oData.aPhoneNumbers as sPhoneNumber, nIndex}
                        <div class="bulma-field">
                            <div class="bulma-field bulma-is-grouped">
                                <div class="bulma-control bulma-is-expanded bulma-has-icons-right">
                                    <input id="Customer__aPhoneNumbers_{nIndex}" bind:value="{oData.aPhoneNumbers[nIndex]}" class="bulma-input { oError.aPhoneNumbers[nIndex] ? 'bulma-is-danger' : '' }" type="text" placeholder="{oPlaceholder.aPhoneNumbers[nIndex]}">
                                    <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                                        <i class="fas fa-asterisk fa-2xs"></i>
                                    </span>
                                </div>
                                {#if oData.aPhoneNumbers.length > 1}
                                    <div class="bulma-control">
                                        <button type="button" class="bulma-button" onclick={() => removePhoneNumber(nIndex) } title="Supprimer" >
                                            <span class="bulma-icon">
                                                <i class="fas fa-phone-slash"></i>
                                            </span>
                                        </button>
                                    </div>
                                {/if}
                            </div>
                            {#if oError.aPhoneNumbers[nIndex]}
                                <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire et doit être un nombre à 10 chiffres</i>
                            {/if}
                        </div>
                    {/each}
                    <div class="bulma-control bulma-has-text-right">
                        <button type="button" class="bulma-button bulma-is-hovered" onclick={addPhoneNumber}>
                            <span class="bulma-icon">
                                <i class="fa-solid fa-phone"></i>
                            </span>
                            <span>Ajouter</span>
                        </button>
                    </div>
                </div>

                <!-- public sDateStart: string; -->
                {#if bCustomer}
                    <div class="bulma-field">
                        <label class="bulma-label" for="Customer__sDateStart">Début de prestation</label>
                        <div class="bulma-control bulma-has-icons-right">
                            <input id="Customer__sDateStart" bind:value="{oData.sDateStart}" class="bulma-input { oError.sDateStart ? 'bulma-is-danger' : '' }" type="date" placeholder="{Customer.oPlaceholder.sDateStart}">
                            <span class="bulma-icon bulma-is-right bulma-has-text-danger">
                                <i class="fas fa-asterisk fa-2xs"></i>
                            </span>
                        </div>
                        {#if oError.sDateStart}
                            <i class="bulma-help bulma-has-text-danger">Ce champ est obligatoire</i>
                        {/if}
                    </div>
                {/if}

                <!-- public sInformations: string | undefined; -->
                <div class="bulma-field">
                    <label class="bulma-label" for="Customer__sInformations">Informations complémentaires</label>
                    <div class="bulma-control">
                        <textarea id="Customer__sInformations" bind:value="{oData.sInformations}" class="bulma-textarea" placeholder="{oPlaceholder.sInformations}"></textarea>
                    </div>
                </div>

                <!-- public bHasKey: boolean = false; -->
                <div class="bulma-field">
                    <div class="bulma-control">
                        <label class="bulma-checkbox">
                            <input type="checkbox" bind:checked="{oData.bHasKey}">
                            Je possède un double des clefs
                        </label>
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