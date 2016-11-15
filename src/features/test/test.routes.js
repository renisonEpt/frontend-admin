import '../auth'; // depends on auth to
routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('test', {
      parent:'Auth',
      url: '/test',
      template: require('./test.html'),
      resolve:{
        'tests':['TestService',function(TestService){
            // initialize
            return TestService.query().$promise;
         }]
      },
      controller:'TestController'

    })
    .state('testDetail',{
      parent:'Auth',
      url:'/test/:testId/detail',
      template:require('./test-detail/test-detail.html'),
      controller:"TestDetailController",
      resolve:{
        'test':['TestService','$stateParams',function(TestService,$stateParams){
          var test =  TestService.get({
            testId:$stateParams.testId
          });
          return test.$promise;
        }],
        'categories':['TestService','$stateParams',function(TestService,$stateParams){
          var categories =  TestService.getCategories({
            testId:$stateParams.testId
          });
          return categories.$promise;
        }],
      }
    })
    .state('categoryDetail',{
      parent:'Auth',
    	url:'/categories/:categoryId/detail',
    	template:require('./category-detail/category-detail.html'),
      controller:"CategoryDetailController",
      resolve:{
        'category':['CategoryService','$stateParams',function(CategoryService,$stateParams){
          var category =  CategoryService.get({
            categoryId:$stateParams.categoryId
          });
          return category.$promise;
        }],
        'testComponents':['CategoryService','$stateParams',function(CategoryService,$stateParams){
          var testComponents =  CategoryService.getTestComponents({
            categoryId:$stateParams.categoryId
          });
          return testComponents.$promise;
        }]
      }
    })
    .state('reviewExams',{
      parent:'Auth',
      url:'/test/:testId/reviewExams?active',
      template:require('./review-exams/review-exams.html'),
      controller:'ReviewExamsController',
      resolve:{
        'scoredSessions':['TestService','$stateParams',function(TestService,$stateParams){
          var scoredSessions =  TestService.getScoredSessions({
            testId:$stateParams.testId
          });
          return scoredSessions.$promise;
        }],
        'studentStatus':['TestService','$stateParams',function(TestService,$stateParams){
          return TestService.getStudentStatus({
            testId:$stateParams.testId
          }).$promise;
        }],
        'categories':['TestService','$stateParams',function(TestService,$stateParams){
          var categories =  TestService.getCategories({
            testId:$stateParams.testId
          });
          return categories.$promise;
        }],
      }
    })
    .state('examDetail',{
      parent:'Auth',
      url:'/testSession/:testSessionId/exam',
      template:require('./exam-detail/exam-detail.html'),
      controller:'ExamDetailController',
      resolve:{
        'exam':['TestSessionService','$stateParams',
          function(TestSessionService,$stateParams){
            var exam =  TestSessionService.getExam({
              id:$stateParams.testSessionId
            });
            return exam.$promise;
          }],
      }
    })
    ;
};
