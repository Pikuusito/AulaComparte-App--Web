import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { PanelUsuario } from './pages/panel-usuario/panel-usuario';
import { PanelModerador } from './pages/panel-moderador/panel-moderador';
import { DetalleRecurso } from './pages/detalle-recurso/detalle-recurso';

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
    path: 'panel-usuario',
    component: PanelUsuario,
  },
  {
    path: 'panel-moderador',
    component: PanelModerador,
  },
  {
    path: 'detalle-recurso/:id',
    component: DetalleRecurso,
  },
];
