import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guard/auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'data',
        loadChildren: () =>
          import('./modules/data/data.module').then((m) => m.DataModule),
        canActivate: [authGuard]
    },
    {
        path: '**', 
        redirectTo: 'login'
    }
];