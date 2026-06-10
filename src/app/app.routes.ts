import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { PanelEstudiante } from './pages/panel-estudiante/panel-estudiante';
import { PanelModerador } from './pages/panel-moderador/panel-moderador';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'registro',
    component: Registro,
  },
  {
    path: 'panel-estudiante',
    component: PanelEstudiante,
  },
  {
    path: 'panel-moderador',
    component: PanelModerador,
  },
];
