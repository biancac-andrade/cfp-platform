import { Route } from '@angular/router';
import { CfpFormComponent } from './cfp/cfp-form.component';
import { CfpDashboardComponent } from './cfp/cfp-dashboard.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cfp',
  },
  {
    path: 'cfp',
    component: CfpFormComponent,
  },
  {
    path: 'dashboard',
    component: CfpDashboardComponent,
  },
];
