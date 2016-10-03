var _ = require('lodash');
import ComponentType from 'renison-ept-frontend-core/src/constants/component-type';
import QuestionType from 'renison-ept-frontend-core/src/constants/question-type';

CategoryDetailController.$inject  = ['$rootScope','$scope', 
	'$stateParams', '$state','$q','BaseService','$cookies','CategoryService',
	'TestComponentService','category','testComponents',
	'BaseToastService','UtilService','Upload','$sce'];

export default function CategoryDetailController($rootScope,$scope, 
	$stateParams,$state,$q,BaseService,$cookies,CategoryService,TestComponentService,
	category,testComponents,BaseToastService,UtilService,Upload,$sce) {
	$scope.category = category;
	$scope.testComponents = _.sortBy(testComponents,'ordering');
	for (var i = $scope.testComponents.length - 1; i >= 0; i--) {
		var c = $scope.testComponents[i];
		if ( c.componentType === ComponentType.COMP_VIDEO){
			c.content = BaseService.BASE_URL + c.content;
		}
	};
	$scope.goBack = function(){
		if($rootScope.previousState.name) {
			$state.go($rootScope.previousState.name,$rootScope.previousState.params);
		}
		else $state.go('test');
	};

	$scope.onComponentCreated = function(component){
		component.categoryId = $scope.category.id;
		CategoryService
			.createTestComponent(component)
			.$promise
			.then(function(responseComponent){
				component.id = responseComponent.id; // we update the id of component
			})
			.then(syncComponentOrder)
			.catch(showErrorMsg);
	};

	function getComponentOrder(testComponents){
		var orders = [];
		for (var i = testComponents.length - 1; i >= 0; i--) {
			var component = testComponents[i];
			orders.push({
				testComponentId:component.id,
				ordering:i+1
			});
		};
		return orders;
	}
	// from http://jsfiddle.net/danialfarid/maqbzv15/1118/
	$scope.$on('videoFileChanged',function($event,data){
		Upload.upload({
		     url: BaseService.BASE_URL + '/testComponents/upload',
		     data: {videoFile: data.file},
	    }).then(function (resp) {
	     	data.component.content = resp.data.fileUrl;
		}).catch(showErrorMsg);
	});
	$scope.onComponentChanged = function(component,oldComponent){
		// do not do anything if id or ordering is changed, that is irrelevant
		// those changes are synced somewhere else
		if(component.id!==oldComponent.id 
			|| component.ordering !== oldComponent.ordering){
			return;
		}
		TestComponentService
			.save(component)
			.$promise
			.then(function(newComponent){
				console.log('new Component',newComponent);
				if(newComponent.answers && component.answers.length === newComponent.answers.length){
					// copy id over, TODO 
					// We are relying on a weak assumption that server
					// always return the answer in the same order as we sent
					for(var i=0;i<newComponent.answers.length;i++){
						if(!component.answers[i].id){
							component.answers[i].id = newComponent.answers[i].id;
						}
					}
				}
			}).catch(showErrorMsg);
	};
	$scope.onComponentDeleted = function(component){
		TestComponentService.remove({
			id:component.id
		}).$promise
		.then(syncComponentOrder)
		.catch(showErrorMsg);
	};

	function syncComponentOrder(){
		return CategoryService.syncComponentOrder(
			CategoryService.getComponentOrder($scope.testComponents))
			.$promise;
	}
	function showErrorMsg(response){
		var errorMsg = 'Oops, a technical just occurred.'
		if(response && response.data && response.data.errorMessage){
			errorMsg = response.data.errorMessage;
		}
		BaseToastService.error(errorMsg);
	}
}