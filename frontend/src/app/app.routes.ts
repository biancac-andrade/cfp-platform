import { Route } from '@angular/router';
import { CfpFormComponent } from './cfp/cfp-form.component';

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
];
