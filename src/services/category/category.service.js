import angular from "angular";
import core from "renison-ept-frontend-core";
import 'angular-resource';
export default angular.module('eptAdmin.service.category',[core,'ngResource'])
	.factory('CategoryService',['BaseService','$resource',function (BaseService,$resource) {
		this.categoryBaseUrl = "/categories";
		var CategoryResource = $resource(BaseService.BASE_URL + this.categoryBaseUrl + '/:categoryId/:subResource',
				{
					categoryId:'@id' // use id as default
				}, {
					save: {method:'PUT'},
					get: {
						method:'GET',
						params:{
						},
						data:null,
						headers:{
							'Content-Type':'application/json'
						}
					},
					getTestComponents:{
						method:'GET',
						params:{
							subResource:'testComponents'
						},
						data:null,
						isArray:true
					},
					createTestComponent:{
						method:'POST',
						params:{
							subResource:'testComponents',
							categoryId:'@categoryId'
						}
					},
					syncComponentOrder:{
						method:'PUT',
						params:{
							subResource:'componentOrder'
						},
						isArray:true
					},
					remove:{
						method:'DELETE',
						params:{
							categoryId:'@id',
							data:null
						}
					}
				});
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
		};
		CategoryResource.getComponentOrder = getComponentOrder;
		return CategoryResource;
	}])
	.name; 