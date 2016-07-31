import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './test.routes';
import TestController from './test.controller';
import TestDetailController from './test-detail/test-detail.controller';
import CategoryDetailController from './category-detail/category-detail.controller';
import ReviewExamsController from './review-exams/review-exams.controller';
import ExamDetailController from './exam-detail/exam-detail.controller';

import TestService from '../../services/test/test.service.js';
import CategoryService from '../../services/category/category.service.js';
import TestComponentService from '../../services/testComponent/testComponent.service.js';
import TestSessionService from '../../services/testSession/testSession.service.js';
import UtilService from '../../services/util/util.service.js';
import ngCookies from 'angular-cookies';
import core from 'renison-ept-frontend-core';
import './test-page.less'; //load styles
import './test-table.less'; //load styles
export default angular.module('EPTAdmin.test', 
    [core,uirouter,ngCookies,
    UtilService,TestService,CategoryService,
    TestComponentService,TestSessionService
    ])
  .config(routing)
  .controller('TestController', TestController)
  .controller('TestDetailController',TestDetailController)
  .controller('CategoryDetailController',CategoryDetailController)
  .controller('ReviewExamsController',ReviewExamsController)
  .controller('ExamDetailController',ExamDetailController)

  .name;
