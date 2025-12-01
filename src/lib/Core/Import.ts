
import type { TObject } from './Type';

import Theme from '../Components/Menu/Theme.svelte';
import Todo from '../Components/Todo.svelte';
import Customer from '../Components/Customer/Pages.svelte';
import Schedule from '../Components/Schedule/Pages.svelte';

export const COMPONENTS: TObject = {
    // MENU_LIST_ITEMS
    Theme: Theme,

    // CONTENT_ITEMS
    Planning: Todo,
    Income: Todo,
    Customer: Customer,
    Schedule: Schedule
};