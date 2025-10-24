import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then(m => m.Shell)
  },
  {
  path: 'chat',
  loadComponent: () =>
    import('./features/chat/chat/chat').then(m => m.ChatComponent)
},
  {
    path: '**',
    redirectTo: ''
  }
];