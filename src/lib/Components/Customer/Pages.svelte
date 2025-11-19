<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import type { TObject } from '../../Core/Type';
    import type { IContactOptions } from '../../Class/Contact.svelte';
    
    import { CUSTOMER_PAGE, CUSTOMER_FORM_TYPE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    import Contact from '../../Class/Contact.svelte';
    import Customer from '../../Class/Customer.svelte';
    
    /* -- Svelte */
    import List from './List.svelte';
    import View from './View.svelte';
    import Form from './Form.svelte';

    /* ---- Component */
    let {
        App
    } = $props();

    let oCustomers = Customer.getCustomers();
    
    /* -- View */
    let oViewTarget: Customer | Contact = $state(Customer.oPlaceholder),
        bViewUsed = false;

    function openView(oTarget: Customer | Contact, bForce = false) {
        if( bForce || !bViewUsed ){
            oViewTarget = oTarget;

            bViewUsed = true;
            App.oPage.open(CUSTOMER_PAGE.VIEW, true);
        }
    }

    function closeView() {
        if( bViewUsed ){
            bViewUsed = false;
            App.oPage.back(CUSTOMER_PAGE.LIST);
        }
    }

    function deleteView() {
        if( bViewUsed ){
            oViewTarget.destroy();
            oViewTarget = Customer.oPlaceholder;
            closeView();
        }
    }

    /* -- Form */
    let oFormComponent: any = null,
        bFormUsed = false,
        oFormTarget: TObject | undefined,
        sFormType = '';

    function openForm(sType: string, oTarget?: TObject ): void {
        if( !bFormUsed ){
            sFormType = sType;
            oFormTarget = oTarget;

            oFormComponent.setForOpen(sType, oTarget?.oContact);
            bFormUsed = true;
            App.oPage.open(CUSTOMER_PAGE.FORM, true);
        }
    }

    function validateForm(oValideData: IContactOptions): void {
        if( bFormUsed ){

            let oWillView = null,
                oNewContact = null;
            
            switch( sFormType ){
                case CUSTOMER_FORM_TYPE.NEW_CUSTOMER:
                    oNewContact = new Contact(oValideData);
                    oWillView = new Customer( { nMainContact: oNewContact.nId } );
                    break;

                case CUSTOMER_FORM_TYPE.NEW_CONTACT:
                    oNewContact = new Contact(oValideData);
                    oFormTarget?.oCustomer.addExtraContact(oNewContact);
                    oWillView = oNewContact;
                    break;

                case CUSTOMER_FORM_TYPE.MODIFY_CONTACT:
                    oFormTarget?.oContact.update(oValideData);
                    // If Contact modified is main contact of customer
                    if( oFormTarget?.oCustomer.oMainContact == oFormTarget?.oContact ){
                        // Then open Customer
                        oWillView = oFormTarget?.oCustomer;
                    } else {
                        // Else open extra Contact
                        oWillView = oFormTarget?.oContact;
                    }
                    break;
            }

            bFormUsed = false;
            App.oPage.back();
            openView(oWillView, true);
        }
    }

    function closeForm(): void {
        if( bFormUsed ){
            App.oPage.back();
            bFormUsed = false;
        }
    }

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(oFormComponent).with(console.trace);
    }
</script>

<div>
    <!-- Page #1 - List -->
    <List
        oCustomers={oCustomers}

        App_openMenu={App.oMenu.open}
        Pages_openView={openView}
        Pages_openForm={openForm}
    />
    <!-- Page #2 - View -->
    <View
        oTarget={oViewTarget}

        Pages_openView={openView}
        Pages_deleteView={deleteView}
        Pages_closeView={closeView}
        Pages_openForm={openForm}
    />
    <!-- Page #3 - Form -->
    <Form
        bind:this={oFormComponent}

        Pages_closeForm={closeForm}
        Pages_validateForm={validateForm}
    />
</div>

<style>
</style>