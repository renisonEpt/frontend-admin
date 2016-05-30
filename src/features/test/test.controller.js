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
		onAction:onTestDeleted
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
	$scope.activateTest = function(test,$event){
		$event.stopPropagation();
		test.active = true;
		return TestService.activateTest(test)
			.$promise
			.then(function(){
				$scope.tests.forEach(function(t){
					t.active = false;
				});
				test.active = true;
			});
	};
	function onTestDeleted (test){
		return TestService.remove({
			id:test.id
		})
		.$promise
		.then(function(){
			var index = $scope.tests.indexOf(test);
			$scope.tests.splice(index,1);
		});
	}
	TestService.query().$promise.then(function(tests){
		console.log('tests',tests);
		$scope.tests = tests;
	}).catch(function(response){
		console.log('Error occurred getting test, aborting',response);
	})
 }