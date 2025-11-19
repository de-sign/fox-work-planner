<script lang="ts">
    /* ---- Import */
    /* -- Style */
    import iFoxLogo from '/fox.svg';

    /* ---- Component */
    let {
        App
    } = $props();
</script>

<div>
    <!-- Page #1 - List -->
    <section class="fox-app-page">
        <!-- Page Content -->
        <div class="fox-app-page-content bulma-section">
            <div class="bulma-container bulma-is-max-tablet">
                <h1 class="bulma-title">
                    <img class="bulma-icon" src={iFoxLogo} alt="Fox Logo" />
                    Work Planner
                </h1>
                <h2 class="bulma-subtitle">Plan your working hours #1</h2>
                <div class="bulma-content">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsam eligendi sequi veniam odio.
                        Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nihil vel mollitia ullam dolores quasi aliquid quae expedita numquam?
                        Quam velit voluptatibus ipsum ipsam possimus soluta, consectetur ut magnam blanditiis ab.
                    </p>
                </div>
            </div>
        </div>
        <!-- Navbar -->
        <nav class="fox-app-page-navbar bulma-section">
            <div class="bulma-container bulma-is-max-tablet">
                <div class="fox-app-page-navbar-item">
                    <button class="bulma-button bulma-is-hovered" onclick={App.oMenu.open} >
                        <span class="bulma-icon-text">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-bars"></i>
                            </span>
                            <span>Menu</span>
                        </span>
                    </button>
                </div>
                <div class="fox-app-page-navbar-item">
                    <button class="bulma-button" onclick="{ () => App.oPage.next() }">
                        <span class="bulma-icon-text">
                            <span>Next</span>
                            <span class="bulma-icon">
                                <i class="fa-solid fa-chevron-right"></i>
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    </section>

    <!-- Page #2 - View -->
    <section class="fox-app-page">
        <!-- Page Content -->
        <div class="fox-app-page-content bulma-section">
            <div class="bulma-container bulma-is-max-tablet">
                <h1 class="bulma-title">
                    <img class="bulma-icon" src={iFoxLogo} alt="Fox Logo" />
                    Work Planner
                </h1>
                <h2 class="bulma-subtitle">Plan your working hours #2</h2>
                <div class="bulma-content">
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Voluptates perspiciatis dolorum voluptate consectetur dolorem dicta non earum a velit dolor?
                        Nam repudiandae quos perspiciatis itaque aliquam molestias sint dolorum nobis.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Tempore fugit doloremque pariatur obcaecati rem delectus et velit nemo minima suscipit sunt id asperiores,eius error earum deserunt?
                        Esse, illo facilis?
                    </p>
                </div>
            </div>
        </div>
        <!-- Navbar -->
        <nav class="fox-app-page-navbar bulma-section">
            <div class="bulma-container bulma-is-max-tablet">
                <div class="fox-app-page-navbar-item">
                    <button class="bulma-button bulma-is-hovered" onclick="{ () => App.oPage.previous() }">
                        <span class="bulma-icon-text">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-chevron-left"></i>
                            </span>
                            <span>Previous</span>
                        </span>
                    </button>
                </div>
                <div class="fox-app-page-navbar-item">
                    <button class="bulma-button" onclick="{ () => App.oPage.next() }">
                        <span class="bulma-icon-text">
                            <span>Next</span>
                            <span class="bulma-icon">
                                <i class="fa-solid fa-chevron-right"></i>
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    </section>

    <!-- Page #3 - Form -->
    <section class="fox-app-page">
        <!-- Page Content -->
        <div class="fox-app-page-content bulma-section">
            <div class="bulma-container bulma-is-max-tablet">
                <h1 class="bulma-title">
                    <img class="bulma-icon" src={iFoxLogo} alt="Fox Logo" />
                    Work Planner
                </h1>
                <h2 class="bulma-subtitle">Plan your working hours #3</h2>
                <div class="bulma-content">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsam eligendi sequi veniam odio.
                        Distinctio quod sit modi obcaecati quo perferendis odio optio, suscipit eaque maxime eos impedit eius quaerat natus.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nihil vel mollitia ullam dolores quasi aliquid quae expedita numquam?
                        Quam velit voluptatibus ipsum ipsam possimus soluta, consectetur ut magnam blanditiis ab.
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Navbar -->
        <nav class="fox-app-page-navbar bulma-section">
            <div class="bulma-container bulma-is-max-tablet">
                <div class="fox-app-page-navbar-item">
                    <button class="bulma-button bulma-is-hovered" onclick="{ () => App.oPage.previous() }">
                        <span class="bulma-icon-text">
                            <span class="bulma-icon">
                                <i class="fa-solid fa-chevron-left"></i>
                            </span>
                            <span>Previous</span>
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    </section>
</div>

<style>
</style>