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
        App_openMenu,
        App_goToPage
    } = $props();

    let oCustomers = Customer.getCustomers();
    
    /* -- View */
    let oViewTarget: Customer | Contact = $state(Customer.oPlaceholder),
        bViewUsed = false;

    function openView(oTarget: Customer | Contact, bForce = false) {
        if( bForce || !bViewUsed ){
            oViewTarget = oTarget;

            bViewUsed = true;
            App_goToPage(CUSTOMER_PAGE.VIEW, true);
        }
    }

    function closeView() {
        if( bViewUsed ){
            bViewUsed = false;
            App_goToPage(CUSTOMER_PAGE.LIST);
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
            App_goToPage(CUSTOMER_PAGE.FORM, true);
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
            openView(oWillView, true);
        }
    }

    function closeForm(): void {
        if( bFormUsed ){
            if( bViewUsed ){
                App_goToPage(CUSTOMER_PAGE.VIEW, true);
            } else {
                App_goToPage(CUSTOMER_PAGE.LIST);
            }
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

        Page_openView={openView}
        App_openMenu={App_openMenu}
        Page_openForm={openForm}
    />
    <!-- Page #2 - View -->
    <View
        oTarget={oViewTarget}

        Page_openView={openView}
        Page_deleteView={deleteView}
        Page_closeView={closeView}
        Page_openForm={openForm}
    />
    <!-- Page #3 - Form -->
    <Form
        bind:this={oFormComponent}

        Page_closeForm={closeForm}
        Page_validateForm={validateForm}
    />
</div>

<style>
</style>