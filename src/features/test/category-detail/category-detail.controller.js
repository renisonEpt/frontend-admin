var _ = require('lodash');
CategoryDetailController.$inject  = ['$rootScope','$scope', 
	'$stateParams', '$state','$q','BaseService','$cookies','CategoryService','TestComponentService','category','testComponents'];

export default function CategoryDetailController($rootScope,$scope, 
	$stateParams,$state,$q,BaseService,$cookies,CategoryService,TestComponentService,category,testComponents) {
	$scope.category = category;
	$scope.testComponents = _.sortBy(testComponents,'ordering');

	$scope.onComponentCreated = function(component){
		component.categoryId = $scope.category.id;
		CategoryService
			.createTestComponent(component)
			.$promise
			.then(function(responseComponent){
				component.id = responseComponent.id; // we update the id of component
			})
			.then(syncComponentOrder);
	};
	function syncComponentOrder(){
		// sync all the ordering of components
		return CategoryService
			.syncComponentOrder(getComponentOrder())
			.$promise;
	}
	function getComponentOrder(){
		var orders = [];
		for (var i = $scope.testComponents.length - 1; i >= 0; i--) {
			var component = $scope.testComponents[i];
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
			})
	};
	$scope.onComponentDeleted = function(component){
		TestComponentService.remove({
			id:component.id
		}).$promise
		.then(syncComponentOrder);
	};
}