import { Routes } from '@angular/router';
import { Main } from './main/main';
import { NewEvent } from './new-event/new-event';
import { Calendar } from './calendar/calendar';

export const routes: Routes = [
    {
        path: '',
        component: Main
    },
    {
        path: 'newEvent',
        component: NewEvent
    },
    {
        path: 'calendar',
        component: Calendar
    }
];
