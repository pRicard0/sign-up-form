import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'cadastro', component: Register },
    { path: 'home', component: Home },
    { path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
