import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then(m => m.Shell)
  },
  {
    path: '**',
    redirectTo: ''
  }
];