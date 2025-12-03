<script lang="ts">
    /* ---- Import */
    /* -- Core */
    /* Add '../' to path ! */
    import { CONFIG } from '../../Core/Config';

    /* -- Template */
    /* Add '../Template/' to path ! */
    import Title from './Title.svelte';
    import Navbar from './Navbar.svelte';

    /* ---- Component */
    let {
        App,
        Pages
    } = $props();
    
    /* TODO Component script */
    function callToAction(): void {
        alert('Vous avez pressé sur le bouton Call To Action :D');
    }

    /* ---- Template */
    /* -- Title */
    const oTitle = {
        sTitle: 'Template',
        sSubTitle: 'Page modèle pour création de composant rapide',
        aButtons: [
            {
                sClass: 'bulma-is-link',
                sTitle: 'Call to Action',
                sIcon: 'fa-message',
                click: callToAction
            }
        ]
    };
    
    /* -- Navbar */
    const oNavbar = {
        oBack: {
            sTitle: 'Ouvrir le menu',
            sIcon: 'fa-bars',
            sText: 'Menu',
            click: App.oMenu.open
        },
        aButtons: [
            {
                sClass: 'bulma-is-link',
                sTitle: 'Call to Action',
                sIcon: 'fa-message',
                sText: 'Call to Action',
                click: callToAction
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
            <div class="bulma-content">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam eligendi sequi veniam odio.
                    Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam eligendi sequi veniam odio.
                    Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam eligendi sequi veniam odio.
                    Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam eligendi sequi veniam odio.
                    Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam eligendi sequi veniam odio.
                    Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                </p>
            </div>
        </div>
    </div>
    
    <!-- Page Navbar -->
    <Navbar Item={oNavbar} />
</section>

<style>
</style>