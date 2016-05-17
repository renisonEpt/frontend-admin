import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './test.routes';
import TestController from './test.controller';
import TestDetailController from './test-detail/test-detail.controller';
import TestService from '../../services/test/test.service.js';
import CategoryService from '../../services/category/category.service.js';
import ngCookies from "angular-cookies";
import "./test-page.less"; //load styles
import "./test-table.less"; //load styles
export default angular.module('EPTAdmin.test', [uirouter,ngCookies,TestService,CategoryService])
  .config(routing)
  .controller('TestController', TestController)
  .controller('TestDetailController',TestDetailController)
  .name;
