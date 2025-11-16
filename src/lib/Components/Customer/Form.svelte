<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import { CUSTOMER_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';
    import Contact from '../../Class/Contact.svelte';

    /* ---- Component */
    let {
        Page_validateForm,
        Page_closeForm
    } = $props();

    /* -- Data */
    let oPlaceholder: Contact = Contact.oPlaceholder,
        sTitle: string = $state('Default Title'),
        oData: TObject = $state({}),
        oError: TObject = $state({});

    export function setForOpen(sType: string, oTarget ?: TObject){

        // Title
        switch(sType){
            case CUSTOMER_FORM_TYPE.NEW_CUSTOMER:
                sTitle = 'Ajoute un nouveau client';
                break;
            case CUSTOMER_FORM_TYPE.NEW_CONTACT:
                sTitle = 'Ajoute un nouveau contact';
                break;
            case CUSTOMER_FORM_TYPE.MODIFY_CONTACT:
                sTitle = 'Modifie un contact existant';
                break;
        }

        // Data
        oData = oTarget ? oTarget.clone() : { aPhoneNumbers: [null] };

        // Error
        oError = { aPhoneNumbers: [] };
    }

    function addPhoneNumber() {
        oData.aPhoneNumbers.push(null);
    }

    function removePhoneNumber(nIndex: number) {
        oData.aPhoneNumbers.splice(nIndex, 1);
    }

    /* -- Form */
    /* Contact - Instance Properties
        private _nId: number = 0;
        public sFirstName: string = '';
        public sLastName: string = '';
        public sAddress: string = '';
        public sAddressSupplement: string | undefined;
        public sPostalCode: string = '';
        public sCity: string = '';
        public aPhoneNumbers: string[] = [];
        public sInformations: string | undefined;
        public bHasKey: boolean = false;
    */
    const
        // Check
        fCheckText = (sValue: string) => {
            return sValue && sValue.trim();
        },
        // Transform
        fUppercase = (sValue: string) => {
            return sValue?.trim().toUpperCase();
        },
        fCapitalize = (sValue: string) => {
            return sValue ? (sValue?.trim().charAt(0).toUpperCase() + sValue?.trim().slice(1) ) : null;
        },
        fTrim = (sValue: string) => {
            return sValue?.trim();
        },
        // Fields
        oFields: TObject<TObject> = {
            sFirstName: {
                fCheck: fCheckText,
                fTransform: fCapitalize
            },
            sLastName: {
                fCheck: fCheckText,
                fTransform: fUppercase
            },
            sAddress: {
                fCheck: fCheckText,
                fTransform: fCapitalize
            },
            sAddressSupplement: {
                fCheck: null,
                fTransform: fCapitalize
            },
            sPostalCode: {
                fCheck: (sValue: string) => {
                    const rPostaCode = new RegExp(/^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/i);
                    return fCheckText(sValue) && rPostaCode.test( sValue.trim() );
                },
                fTransform: fTrim
            },
            sCity: {
                fCheck: fCheckText,
                fTransform: fUppercase
            },
            aPhoneNumbers: {
                bIsArrayData: true,
                fCheck: (sValue: string) => {
                    const rPhoneNumber = new RegExp(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/i);
                    return fCheckText(sValue) && rPhoneNumber.test( sValue.trim() );
                },
                fTransform: (sValue: string) => {
                    return sValue
                        .replaceAll(/[\s.-]/g, '') // Delete white space, dot or minus
                        .replace(/^(?:(?:\+|00)33|0)([1-9])/i, '+33$1 ') // Add prefix
                        .replace(/(\d{2})/g, '$1 ')
                        .trim();
                }
            },
            sInformations: {
                fCheck: null,
                fTransform: fCapitalize
            },
            bHasKey: {
                fCheck: null,
                fTransform: null
            }
        };

    function check() {

        let bError: boolean = false;
        oError = {};

        for( let sField in oFields ){
            const oField = oFields[sField];
            if( oField.fCheck ){
                if( oField.bIsArrayData ){
                    oError[sField] = [];
                    oData[sField].forEach( (sValue: string, nIndex: number) => {
                        if( !oField.fCheck(sValue) ){
                            oError[sField][nIndex] = true;
                            bError = true;
                        }
                    } );
                }
                else if( !oField.fCheck(oData[sField]) ){
                    oError[sField] = true;
                    bError = true;
                }
            }
        }

        return !bError;
    }

    function transform() {
        
        const oReturn: TObject = {};
        for( let sField in oFields ){
            const oField = oFields[sField];
            if( oField.fTransform ){
                if( oField.bIsArrayData ){
                    oReturn[sField] = [];
                    oData[sField].forEach( (sValue: string) => {
                        oReturn[sField].push( oField.fTransform(sValue) );
                    } );
                } else {
                    oReturn[sField] = oField.fTransform( oData[sField] );
                }
            } else {
                oReturn[sField] = oData[sField];
            }
        }

        return oReturn;
    }

    function validate() {
        if( check() ){
            const oResult = transform();
            Page_validateForm(oResult);
        }
    }

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(sType).with(console.trace);
        // $inspect(sTitle).with(console.trace);
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
    
    <!-- Navbar -->
    <nav class="fox-app-page-navbar bulma-section">
        <div class="bulma-container bulma-is-max-tablet">
            <div class="fox-app-page-navbar-item">
                <button class="bulma-button bulma-is-hovered" onclick={Page_closeForm} >
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