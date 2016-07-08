TestController.$inject  = ['$rootScope','$scope', '$stateParams',
 '$state','$q','TestService','$cookies','UtilService','BaseToastService','BaseModalService','tests'];

export default function TestController($rootScope,$scope, $stateParams,
	$state,$q,TestService,$cookies, UtilService,BaseToastService,BaseModalService,tests) {
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
		onAction:onTestCopied
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
				}).catch(showErrorMsg);
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
			if(reportData.length === 0){
				BaseToastService.warn('No one has written the test yet, no report generated.','No Report');
			}
			UtilService.downloadAsCsv(getReportName(test.name),reportData);
		}).catch(showErrorMsg);
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
			}).catch(showErrorMsg);
	};

	function onTestDeleted (test){
		return BaseModalService.confirm({
			modalBody:'All the data will be lost, are you sure to delete?',
			modalTitle:'Dangerous Action'
		}).then(function(result){
			if(result === true){
				return performDelete();
			}
		});

		function performDelete(){
			TestService.remove({
				id:test.id
			})
			.$promise
			.then(function(){
				var index = $scope.tests.indexOf(test);
				$scope.tests.splice(index,1);
			}).catch(showErrorMsg);
		}
	}
	function onTestCopied (test){
		return TestService.copyTest(test)
			.$promise
			.then(function(copiedTest){
				$scope.tests.push(copiedTest);
			})
			.catch(function(error){
				console.log(error);
				BaseToastService.error('Something went wrong when copying test');
			});
	}

	$scope.tests = tests;

	function getReportName(testName){
		return testName+ ' Report ' 
				+ UtilService.formatDate(new Date()) + '.csv';
	}

	function showErrorMsg(response){
		var errorMsg = 'Oops, a technical just occurred.'
		if(response && response.data && response.data.errorMessage){
			errorMsg = response.data.errorMessage;
		}
		BaseToastService.error(errorMsg);
	}
 }