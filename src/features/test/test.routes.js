routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('test', {
      url: '/test',
      template: require('./test.html')
    })
    .state('testDetail',{
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
    ;
};
