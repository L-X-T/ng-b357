import { Routes } from '@angular/router';

import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';

export const flightRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'flight-search',
  },

  {
    path: 'flight-edit/:id',
    component: FlightEditComponent,
    // title: 'Edit Flight - NG A11y', // remove this for inject(Title).setTitle() to work
  },

  {
    path: 'flight-search',
    component: FlightSearchComponent,
    title: 'Flight Search - NG A11y',
  },
];

export default flightRoutes;
