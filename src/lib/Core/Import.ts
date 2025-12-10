import type { TObject } from './Type';

/* -- Temp Components */
import Template from '../Components/Template/Page.svelte';

/* -- Menu Components */
import Data from '../Components/Menu/Data.svelte';
import Theme from '../Components/Menu/Theme.svelte';

/* -- Content Components */
import Customer from '../Components/Customer/Pages.svelte';
import Schedule from '../Components/Schedule/Pages.svelte';
import Task from '../Components/Task/Pages.svelte';
import Income from '../Components/Income/List.svelte';

/* -- Export */
export const COMPONENTS: TObject = {
    // MENU_LIST_ITEMS
    Data: Data,
    Theme: Theme,

    // CONTENT_ITEMS
    Task: Task,
    Income: Income,
    Customer: Customer,
    Schedule: Schedule
};