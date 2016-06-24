routes.$inject = ['$stateProvider'];
export default function routes($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      template: require('./login.html')
    })
    .state('Auth',{
    	abstract:true,
        template: '<ui-view/>',
    	resolve:{
    		'credential':['BaseService','$q','$state',function(BaseService,$q,$state){
    			var deferred = $q.defer();
    			if(BaseService.hasBasicAuth()){
    				deferred.resolve(BaseService.getBasicAuth());
    			}else{
    				deferred.reject();
    			}
    			return deferred.promise;
    		}]
    	}
    })

};
