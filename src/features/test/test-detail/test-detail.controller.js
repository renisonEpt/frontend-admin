import './test-detail.less';
TestDetailController.$inject  = ['$rootScope','$scope', 
	'$stateParams', '$state','$q','BaseService','$cookies','TestService','CategoryService',
	'test','categories','BaseToastService'];

export default function TestDetailController($rootScope,$scope, 
	$stateParams,$state,$q,BaseService,$cookies,TestService,
	CategoryService,test,categories,BaseToastService) {

	$scope.toolbarActions = [{
		iconClass:'fa fa-plus',
		text:'New Category',
		onAction:createCategory
	}];
	$scope.categoryActions = [{
		iconClass:'fa fa-pencil',
		onAction:goCategoryDetail
	},{
		iconClass:'fa fa-chevron-up',
		onAction:moveCategoryUp
	},{
		iconClass:'fa fa-chevron-down',
		onAction:moveCategoryDown
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
			$scope.categories.splice(index,1);
		}).catch(showErrorMsg);
	};
	$scope.saveCategory = function(category,oldCategory){
		// do nothing if ordering changes
		// we have syncCategoryOrder to handle ordering changes
		// no need to resync changes here
		if(oldCategory.ordering !== category.ordering) return; 
		CategoryService.save(category);
	};
	function createCategory(){
		TestService
			.createCategory(getDefaultCategory())
			.$promise
			.then(function(category){
				$scope.categories.push(category);
			}).catch(showErrorMsg);
	}

	function syncCategoryOrder(categories){
		var orderMap = _.map(categories,function(item,index){
			item.ordering = index+1;
			return {
				'categoryId':item.id,
				'ordering':index+1 //change from 0 based to 1 based
			};
		});
		TestService
			.syncCategoryOrder(orderMap)
			.catch(showErrorMsg);
	}

	function moveCategory(category,isUp){
		var idx = $scope.categories.indexOf(category);
		if(isUp && idx == 0){
			return;
		}else if(!isUp && idx == $scope.categories.length-1){
			return;
		}
		$scope.categories.splice(idx,1);
		$scope.categories.splice(isUp?idx-1:idx+1,0,category);
		syncCategoryOrder($scope.categories);
	}

	function moveCategoryUp(category){
		moveCategory(category,true);
	}

	function moveCategoryDown(category){
		moveCategory(category,false);
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

	function showErrorMsg(response){
		var errorMsg = 'Oops, a technical just occurred.'
		if(response && response.data && response.data.errorMessage){
			errorMsg = response.data.errorMessage;
		}
		BaseToastService.error(errorMsg);
	}
 }