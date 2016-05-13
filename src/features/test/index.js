import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './test.routes';
import TestController from './test.controller';
import TestDetailController from './test-detail/test-detail.controller';

import ngCookies from "angular-cookies";
import TestDetail from "./test-detail";
import "./test-page.less"; //load styles
import "./test-table.less"; //load styles
export default angular.module('EPTAdmin.test', [uirouter,ngCookies])
  .config(routing)
  .controller('TestController', TestController)
  .controller('TestDetailController',TestDetailController)
  .name;
