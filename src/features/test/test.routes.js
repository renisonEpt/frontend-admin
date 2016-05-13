routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('test', {
      url: '/test',
      template: require('./test.html')
    })
    .state('testDetail',{
    	url:'/test/:testId/detail',
    	template:require('./test-detail/test-detail.html')
    })
    ;
};
