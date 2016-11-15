import './test-detail.less';

import ComponentType from 'renison-ept-frontend-core/src/constants/component-type';
import QuestionType from 'renison-ept-frontend-core/src/constants/question-type';

var _ = require('lodash');
TestDetailController.$inject  = ['$rootScope','$scope', 
	'$stateParams', '$state','$q','BaseService','$cookies','TestService','CategoryService',
	'test','categories','BaseToastService','UtilService','$timeout'];

export default function TestDetailController($rootScope,$scope, 
	$stateParams,$state,$q,BaseService,$cookies,TestService,
	CategoryService,test,categories,BaseToastService,UtilService,$timeout) {
	$scope.toolbarActions = [{
		iconClass:'fa fa-plus',
		text:'New Category',
		onAction:createCategory
	}];
	$scope.categoryActions = [{
		iconClass:'fa fa-pencil',
		tooltip:'edit',
		onAction:goCategoryDetail
	},{
		iconClass:'fa fa-chevron-up',
		tooltip:'move up',
		onAction:moveCategoryUp
	},{
		iconClass:'fa fa-chevron-down',
		tooltip:'move down',
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
	// shuffle all components in between component of type COMP_HTML
	// e.g. [Q1,Q2,Q3,COMP_HTML,Q4,Q5] => [Q2,Q1,Q3,COMP_HTML,Q5,Q4]
	// this is neccessary because we'd like to randomize the questions in between 
	// word blocks, so as to make sure questions following a reading passage does 
	// not go before the reading passage
	function shuffleComponents(components){
		var from = 0;
		// 
		for(var i=0;i<=components.length;i++){
			if(!components[i] || !ComponentType.isQuestionType(components[i].componentType)){
				UtilService.shuffleArray(components,from,i);
				from = i+1;
			}
		}
	};

	// for each category, shuffle its components
	$scope.shuffleCategories = function (){

		// get all test components for each category
		var allPromises = _.map($scope.categories, function(category){
			return CategoryService.getTestComponents({
				categoryId:category.id
			})
			.$promise
		});
		// wait till we get back all test components
		return $q.all(allPromises)
			.then(function(testComponentsSet){
				// get back a set of test components 
				// [TestComponents for category 1, ...]

				// map components in each category to orders and then concatenate them
				// see https://lodash.com/docs#flatMap
				var orders = _.flatMap(testComponentsSet,function(testComponents){
					shuffleComponents(testComponents);
					return CategoryService.getComponentOrder(testComponents);
				});
				return orders;
			})
			.then(function(orders){
				return CategoryService.syncComponentOrder(orders).$promise;
			})
			.catch(showErrorMsg);
	};
	function showErrorMsg(response){
		var errorMsg = 'Oops, a technical just occurred.'
		if(response && response.data && response.data.errorMessage){
			errorMsg = response.data.errorMessage;
		}
		console.log(response);
		BaseToastService.error(errorMsg);
	}
 }