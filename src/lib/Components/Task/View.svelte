<script lang="ts">
    /* ---- Import */
    /* -- Core */
    import { TASK_FORM_TYPE, TASK_PAGE } from '../../Core/Constants';
    import { CONFIG } from '../../Core/Config';

    /* -- Template */
    import Title from '../Template/Title.svelte';
    import Navbar from '../Template/Navbar.svelte';

    /* -- Content */
    import Contact from '../../Class/Contact.svelte';
    import Task from '../../Class/Task.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();
    
    let oTarget: Task = $state(Task.oPlaceholder),
        oContactView: Contact = $derived( oTarget.oCustomer.oMainContact );

    export function open(oNewTarget: Task) {
        oTarget = oNewTarget;
        App.oPage.open(TASK_PAGE.VIEW, true);
    }

    /* ---- Modal */
    let bOpenModal: boolean = $state(false);
    function openModal(): void {
        bOpenModal = true;
    }

    function closeModal(): void {
        bOpenModal = false;
    }

    function remove(): void {
        closeModal();
        oTarget.destroy();
        oTarget = Task.oPlaceholder;
        App.oPage.back();
    }

    /* ---- Template */
    const oTitle = $derived.by( () => {
        return {
            sTitle: oContactView.sName,
            sSubTitle: '' + 
                `<span class="bulma-icon-text">
                    <span class="bulma-icon">
                        <i class="fa-solid fa-calendar-day"></i>
                    </span>
                    <span>
                        ${oTarget.sFullDate}<span class="bulma-is-size-6">, pour ${oTarget.sDuration}</span>
                    </span>
                </span>`
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
                sTitle: 'Modifier la tâche',
                sIcon: 'fa-calendar-day',
                sText: 'Modifier',
                click: () => Pages.oForm.open(TASK_FORM_TYPE.MODIFY_TASK, oTarget)
            }
        ]
    };

    /* ---- Debug */
    if( CONFIG.DEBUG_PRINT_LOG ){
        // $inspect(uVariable).with(console.trace);
    }
</script>

<section class="fox-app-page">

    <!-- Page Title -->
    <Title Item={oTitle} />
    <!-- Page Content -->
    <div class="fox-app-page-content bulma-section">
        <div class="bulma-container bulma-is-max-tablet">

            <div class="bulma-block">
                <p>{oTarget.sFullDate}</p>
                <p>Chez {oContactView.sName}</p>
                <span class="bulma-tag bulma-is-light bulma-icon-text bulma-mt-2 {oTarget.oState.sClass}">
                    <span class="bulma-icon bulma-is-small">
                        <i class="fa-solid {oTarget.oState.sTag}"></i>
                    </span>
                    <span>{oTarget.oState.sDescription}</span>
                </span>
            </div>

            <div class="bulma-block">
                <p>De {oTarget.sTimeStart.replace(':', 'h')} à {oTarget.sTimeEnd.replace(':', 'h')}</p>
                <p>À {oTarget.sPrice} € de l'heure</p>
                <p class="bulma-is-italic bulma-is-size-7 bulma-m-2">
                    ⤷ Pour une durée de <u>{oTarget.sDuration}</u>, soit un total de <u>{oTarget.sTotalPrice} €</u>
                </p>
            </div>
            
            <div class="bulma-block">
                {#if oTarget.sInformations}
                    <div class="bulma-content bulma-is-small bulma-mb-2">
                        <blockquote>{oTarget.sInformations}</blockquote>
                    </div>
                {/if}
            </div>

            <div class="bulma-field bulma-is-grouped bulma-is-grouped-right">
                {#if oTarget.sState == 'CANCEL' && oTarget.oSchedule == null}
                    <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={openModal}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </span>
                        <span>Supprimer</span>
                    </button>
                {/if}
                {#if oTarget.sState == 'WAIT'}
                    <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={() => oTarget.changeState('CANCEL')}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </span>
                        <span>Annuler</span>
                    </button>
                    <button class="bulma-button" onclick={() => oTarget.changeState('VALID')}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-check"></i>
                        </span>
                        <span>Valider</span>
                    </button>
                {:else}
                    <button class="bulma-button" onclick={() => oTarget.changeState('WAIT')}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-hourglass-half"></i>
                        </span>
                        <span>En attente</span>
                    </button>
                {/if}
            </div>
        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar} />

    <!-- Modal -->
    <aside class="bulma-modal bulma-is-justify-content-flex-end { bOpenModal ? 'bulma-is-active' : '' }" >
        <div class="bulma-modal-background"></div>
        <div class="bulma-modal-content">
            <div class="bulma-box bulma-p-5">
                <p class="bulma-block">
                    Es-tu sûr de vouloir supprimer cette tâche
                    du <b>{oTarget.sFullDate}</b>,
                    de <b>{oTarget.sTimeStart.replace(':', 'h')}</b> à <b>{oTarget.sTimeEnd.replace(':', 'h')}</b>
                    pour <b>{oContactView.sName}</b>&nbsp;?
                </p>
                <div class="bulma-field bulma-is-grouped bulma-is-grouped-right">
                    <button class="bulma-button" onclick={closeModal}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-xmark"></i>
                        </span>
                        <span>Annuler</span>
                    </button>
                    <button class="bulma-button bulma-is-danger bulma-is-outlined" onclick={remove}>
                        <span class="bulma-icon">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </span>
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        </div>
    </aside>
</section>

<style>
</style>