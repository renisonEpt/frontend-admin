TestDetailController.$inject  = ['$rootScope','$scope', 
	'$stateParams', '$state','$q','BaseService','$cookies','TestService','CategoryService',
	'test','categories'];

export default function TestDetailController($rootScope,$scope, 
	$stateParams,$state,$q,BaseService,$cookies,TestService,CategoryService,test,categories) {
	$scope.category = {
		name: 'hello category',
		timeAllowed: 35
	};
	console.log($stateParams);
	$scope.test = test;
	$scope.categories = categories;
	console.log($scope.categories);
	$scope.goBack = function(){
		$state.go('test');
	};
	$scope.$watch('test.name',function(newval,oldval){
		if(newval !== oldval){
			$scope.test.$save();
		}
	});
	$scope.$watch('test.description',function(newval,oldval){
		if(newval !== oldval){
			$scope.test.$save();
		}
	});
	$scope.saveCategory = function(category){
		CategoryService.save(category);
	};
 }