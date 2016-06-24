import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './auth.routes.js';
import LoginController from './login.controller';
import core from 'renison-ept-frontend-core';
import ngCookies from 'angular-cookies';

export default angular.module('EPTAdmin.auth', [core,uirouter,ngCookies])
  .config(routing)
  .controller('LoginController', LoginController)
  .name;
