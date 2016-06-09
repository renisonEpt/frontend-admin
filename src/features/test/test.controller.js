TestController.$inject  = ['$rootScope','$scope', '$stateParams',
 '$state','$q','TestService','$cookies','UtilService'];

export default function TestController($rootScope,$scope, $stateParams,
	$state,$q,TestService,$cookies, UtilService) {
	var defaultTest = {
						name:'Untitled Test-'
							+ UtilService.formatDate(new Date()),
						description:'Add your description here...'
					};
	$scope.testEditActions = [{
		class:'',
		iconClass:'fa fa-trash',
		onAction:onTestDeleted
	},
	{
		class:'',
		iconClass:'fa fa-copy',
		onAction:function(){
			console.log('copy action')
		}
	}];

	$scope.seeDetail = function(test){
		$state.go('testDetail',{
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
	$scope.scoreTest = function(test,$event){
		$event.stopPropagation();
		TestService.scoreTest({
			id:test.id
		})
		.$promise
		.then(function (){
			return TestService.generateReport({
				id:test.id
			}).$promise;
		})
		.then(function (reportData){
			UtilService.downloadAsCsv(getReportName(test.name),reportData);
		});
	};
	$scope.toggleTestStatus = function(test,isStart,$event){
		$event.stopPropagation();
		return TestService.toggleTestStatus({
			id:test.id,
			isStart:isStart
		})
			.$promise
			.then(function(){
				if(isStart){
					$scope.tests.forEach(function(t){
						t.active = false;
					});
				}
				test.active = isStart;
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
	});

	function getReportName(testName){
		return testName+ ' Report ' 
				+ UtilService.formatDate(new Date()) + '.csv';
	}
 }