import type { TObject } from './Type';

/* -- Temp Components */
import Template from '../Components/Template/Page.svelte';

/* -- Menu Components */
import ComponentData from '../Components/Menu/Data.svelte';
import ComponentTheme from '../Components/Menu/Theme.svelte';

/* -- Content Components */
import ComponentCustomer from '../Components/Customer/Pages.svelte';
import ComponentSchedule from '../Components/Schedule/Pages.svelte';
import ComponentTask from '../Components/Task/Pages.svelte';
import ComponentIncome from '../Components/Income/List.svelte';

/* -- Class Components */
import ClassContact from '../Class/Contact.svelte';
import ClassCustomer from '../Class/Customer.svelte';
import ClassSchedule from '../Class/Schedule.svelte';
import ClassTask from '../Class/Task.svelte';

/* -- Export */
export const COMPONENTS: TObject = {
    // MENU_LIST_ITEMS
    Data: ComponentData,
    Theme: ComponentTheme,

    // CONTENT_ITEMS
    Task: ComponentTask,
    Income: ComponentIncome,
    Customer: ComponentCustomer,
    Schedule: ComponentSchedule
};

export const CLASS: TObject = {
    Contact: ClassContact,
    Customer: ClassCustomer,
    Schedule: ClassSchedule,
    Task: ClassTask
};