import angular from 'angular';

LoginController.$inject = ['$rootScope', '$scope', '$stateParams', '$state', '$q', 'BaseService','$cookies','BaseToastService'];

export default function LoginController($rootScope,$scope,$stateParams,$state,$q,BaseService,$cookies,BaseToastService){
	$scope.login = function(){
		var username = $scope.username;
		var password = $scope.password;
		BaseService.setBasicAuth({
			username:username,
			password:password
		});
		// test 
		$state.go('test')
			.catch(function(){
				BaseToastService.error('username or password incorrect');
			})
	};
};
