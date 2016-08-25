var _ = require('lodash');
import ComponentType from 'renison-ept-frontend-core/src/constants/component-type';
import QuestionType from 'renison-ept-frontend-core/src/constants/question-type';

CategoryDetailController.$inject  = ['$rootScope','$scope', 
	'$stateParams', '$state','$q','BaseService','$cookies','CategoryService',
	'TestComponentService','category','testComponents','BaseToastService','UtilService'];

export default function CategoryDetailController($rootScope,$scope, 
	$stateParams,$state,$q,BaseService,$cookies,CategoryService,TestComponentService,
	category,testComponents,BaseToastService,UtilService) {
	$scope.category = category;
	$scope.testComponents = _.sortBy(testComponents,'ordering');

	$scope.goBack = function(){
		if($rootScope.previousState.name) {
			$state.go($rootScope.previousState.name,$rootScope.previousState.params);
		}
		else $state.go('test');
	};

	// TODO to be deleted
	// $scope.shuffleComponents = function(components){
	// 	var from = 0;
	// 	for(var i=0;i<components.length;i++){
	// 		if(components[i].componentType === ComponentType.COMP_HTML){
	// 			UtilService.shuffleArray(components,from,i);
	// 			from = i+1;
	// 		}
	// 	}
	// 	return syncComponentOrder().catch(showErrorMsg);
	// };

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
	// TODO to be deleted 
	// function syncComponentOrder(){
	// 	// sync all the ordering of components
	// 	return CategoryService
	// 		.syncComponentOrder($scope.testComponents)
	// 		// .syncComponentOrder(getComponentOrder($scope.testComponents))
	// 		.$promise;
	// }

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

	$scope.onComponentChanged = function(component,oldComponent){
		// do not do anything if id or ordering is changed, that is irrelevant
		// those changes are synced somewhere else
		if(component.id!==oldComponent.id || component.ordering !== oldComponent.ordering){
			return;
		}
		console.log('component to be updated',component);
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

	function showErrorMsg(response){
		var errorMsg = 'Oops, a technical just occurred.'
		if(response && response.data && response.data.errorMessage){
			errorMsg = response.data.errorMessage;
		}
		BaseToastService.error(errorMsg);
	}
}