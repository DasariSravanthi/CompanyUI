import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'data',
        loadChildren: () =>
          import('./modules/data/data.module').then((m) => m.DataModule),
    }
];
