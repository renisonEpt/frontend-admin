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
							categoryId:'@categoryId'
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
		return CategoryResource;
	}])
	.name; 