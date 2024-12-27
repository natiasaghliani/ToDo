import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './sign/login/login.component';
import { SignupComponent } from './sign/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', component: ProfileComponent },
];
