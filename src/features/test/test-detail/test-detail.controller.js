import './test-detail.less';
TestDetailController.$inject  = ['$rootScope','$scope', 
	'$stateParams', '$state','$q','BaseService','$cookies','TestService','CategoryService',
	'test','categories'];

export default function TestDetailController($rootScope,$scope, 
	$stateParams,$state,$q,BaseService,$cookies,TestService,CategoryService,test,categories) {

	$scope.toolbarActions = [{
		iconClass:'fa fa-plus',
		text:'New Category',
		onAction:createCategory
	}];
	$scope.categoryActions = [{
		iconClass:'fa fa-pencil',
		onAction:goCategoryDetail
	}];
	$scope.test = test;
	$scope.categories = categories;

	$scope.goBack = function(){
		$state.go('test');
	};
	function goCategoryDetail (category){
		$state.go('categoryDetail',{
			categoryId:category.id
		});
	};
	// the reason for not watching test directly is that 
	// newval always === oldval (reference doesnot change)
	$scope.$watch('test.name',function(newval,oldval){
		if(newval !== oldval){
			$scope.test.$save();
		}
	});
	$scope.$watch('test.description',function(newval,oldval){
		if(newval !== oldval){
			$scope.test.$save();
		}
	});
	$scope.onCategoryDeleted = function(category){
		var confirmed = window.confirm('Are you sure to delete the category? All questins will be deleted');
		if(!confirmed){
			return;
		}
		CategoryService.remove({
			id:category.id
		})
		.$promise
		.then(function(){
			var index = $scope.categories.indexOf(category);
			$scope.categories.splice(index);
		});
	};
	$scope.saveCategory = function(category){
		CategoryService.save(category);
	};
	function createCategory(){
		TestService
			.createCategory(getDefaultCategory())
			.$promise
			.then(function(category){
				$scope.categories.push(category);
			});
	}
	function getDefaultCategory(){
		var ordering = 1;
		var categoryLength = $scope.categories.length;
		if(categoryLength > 0){
			ordering = $scope.categories[categoryLength-1].ordering;
		}
		return {
			testId:$scope.test.id,
			name:'Untitled Category',
			ordering:ordering,
			timeAllowed:5
		};
	}
 }