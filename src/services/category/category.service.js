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
					getTestComponents:{
						method:'GET',
						params:{
							subResource:'testComponents'
						},
						isArray:true
					}
				});
		return CategoryResource;
	}])
	.name; 