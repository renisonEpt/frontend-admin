TestController.$inject  = ["$rootScope",'$scope', "$stateParams", "$state","$q","BaseService","$cookies"];

export default function TestController($rootScope,$scope, $stateParams,$state,$q,BaseService,$cookies) {
	$scope.category = {
		name: "hello category",
		timeAllowed: 35
	};
 }