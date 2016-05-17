TestController.$inject  = ["$rootScope",'$scope', "$stateParams", "$state","$q","TestService","$cookies"];

export default function TestController($rootScope,$scope, $stateParams,$state,$q,TestService,$cookies) {
	var defaultTest = {
						name:'Untitled Test-'
							+ new Date().toISOString().slice(0, 10),
						description:'Add your description here...'
					};
	$scope.testEditActions = [{
		class:"",
		iconClass:"fa fa-trash",
		onAction:function(){
			console.log("trash action")
		}
	},
	{
		class:"",
		iconClass:"fa fa-copy",
		onAction:function(){
			console.log("copy action")
		}
	}];

	$scope.seeDetail = function(test){
		$state.go("testDetail",{
			testId:test.id
		});
	};

	$scope.createTest = function(){
		return TestService.create(defaultTest)
				.$promise
				.then(function(test){
					$scope.seeDetail(test);
				});
	};
	TestService.query().$promise.then(function(tests){
		console.log('tests',tests);
		$scope.tests = tests;
	}).catch(function(response){
		console.log('Error occurred getting test, aborting',response);
	})
 }