TestController.$inject  = ["$rootScope",'$scope', "$stateParams", "$state","$q","BaseService","$cookies"];

export default function TestController($rootScope,$scope, $stateParams,$state,$q,BaseService,$cookies) {
	$scope.testEditActions = [{
		class:"",
		iconClass:"fa fa-trash",
		onAction:function(){
			console.log("trash action")
		}
	},{
		class:"",
		iconClass:"fa fa-pencil",
		onAction:function(){
			console.log("pencil action");
			$state.go('testDetail',{
				testId:12
			});
		}
	},{
		class:"",
		iconClass:"fa fa-copy",
		onAction:function(){
			console.log("copy action")
		}
	}];
	$scope.tests = [{
		name:"Beijing Jiao Da Test",
		reportTime:"2016-09-10",
		updateTimeStamp:"2016-09-11",
		comment:"Most students finish on time"
	},{
		name:"Beijing University Test",
		reportTime:"2016-05-24",
		updateTimeStamp:"2016-04-18",
		comment:"Some cannot understand listening question 2"
	},{
		name:"Beijing Jiao Da Test",
		reportTime:"2016-11-02",
		updateTimeStamp:"2016-11-06",
		comment:""
	}];


	BaseService.get('/tests').then(function(tests){
		console.log('tests',tests);
		$scope.tests = tests;
	}).catch(function(response){
		console.log('Error occurred getting test, aborting',response);
	})
 }