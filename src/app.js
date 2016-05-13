import 'bootstrap/dist/css/bootstrap.css';
import angular from 'angular';
import uirouter from 'angular-ui-router'; // by  default importing angular-ui-router would not 
// return an object, but would rather return the name of the module 'ui.router'
// so that we can directly include it in angular.module

import routing from './app.config';
import core from "renison-ept-frontend-core";
import test from "./features/test"
angular.module('EPTAdmin', [uirouter, core,test])
  .config(routing);

