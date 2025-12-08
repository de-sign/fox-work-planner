import type { TObject } from './Type';

/* -- Temp Components */
import Template from '../Components/Template/Page.svelte';

/* -- Menu Components */
import Theme from '../Components/Menu/Theme.svelte';

/* -- Content Components */
import Customer from '../Components/Customer/Pages.svelte';
import Schedule from '../Components/Schedule/Pages.svelte';
import Task from '../Components/Task/Pages.svelte';

/* -- Export */
export const COMPONENTS: TObject = {
    // MENU_LIST_ITEMS
    Theme: Theme,

    // CONTENT_ITEMS
    Task: Task,
    Income: Template,
    Customer: Customer,
    Schedule: Schedule
};