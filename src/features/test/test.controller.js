TestController.$inject  = ['$rootScope','$scope', 
'$stateParams', '$interval',
 '$state','$q','TestService','$cookies','UtilService',
 'BaseToastService','BaseModalService','tests'];

export default function TestController($rootScope,$scope, $stateParams, $interval,
	$state,$q,TestService,$cookies, UtilService,BaseToastService,BaseModalService,tests) {
	$scope.tests = tests;
	// so that when page is refreshed, we still monitor active tests
	for(var i=0;i<$scope.tests.length;i++){
		if(tests[i].active){
			monitorConnectedStudent(tests[i]);
		}
	}
	var defaultTest = {
						name:'Untitled Test-'
							+ UtilService.formatDate(new Date()),
						description:'Add your description here...'
					};
	$scope.testEditActions = [{
		class:'',
		iconClass:'fa fa-trash',
		onAction:onTestDeleted,
		tooltip: 'delete'
	},
	{
		class:'',
		iconClass:'fa fa-copy',
		onAction:onTestCopied,
		tooltip: 'copy'
	},{
		class:'',
		iconClass:'fa fa-eye',
		onAction:onReviewExams,
		tooltip: 'review tests'
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
		if(test.active){
			BaseToastService.error('You must stop the test before scoring');
			return;
		}
		test.isLoading=true;
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
		})
		.catch(showErrorMsg)
		.finally(function(){
			test.isLoading = false;
		})
	};
	$scope.toggleTestStatus = function(test,isStart,$event){
		$event.stopPropagation();
		if(!isStart){
			var confirmEnd = confirm('You are about to end a test, please do this only after all students hand back tablets. Are you sure?');
			if(!confirmEnd) return;
		}
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
			})
			.then(function(){
				if(isStart) monitorConnectedStudent(test);
			}).catch(showErrorMsg);
	};

	// check how many students are connected ever so often
	function monitorConnectedStudent(test){
		test.connectedNum=0;
		test.monitorHandle = $interval(function(){
			var p = TestService.getSessions({
				id:test.id
			}).$promise.then(function(data){
				test.connectedNum = data.length;
			});
		},3000);
	}
	function cancelMonitoring(test){
		if(!test.monitorHandle) return;
		$interval.cancel(test.monitorHandle);
	}

	$scope.displayAsTime = function(timestamp){
		return new Date(timestamp).toLocaleDateString();
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

	function onReviewExams(test){
		$state.go('reviewExams',{testId:test.id,active:test.active});
	}

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