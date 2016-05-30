import angular from "angular";
import core from "renison-ept-frontend-core";
import 'angular-resource';
export default angular.module('eptAdmin.service.test',[core,'ngResource'])
	.factory('TestService',['BaseService','$resource',function (BaseService,$resource) {
		this.testBaseUrl = "/tests";
		var TestResource = $resource(BaseService.BASE_URL + '/tests/:testId/:subResource',
				{
					testId:'@id' // use id as default
				}, {
					save: {method:'PUT'},
					create: {
						method:'POST',
						headers:{
							'Content-Type':'application/json'
						}
					},
					getCategories:{
						method:'GET',
						params:{
							subResource:'categories'
						},
						isArray:true
					},
					createCategory:{
						method:'POST',
						params:{
							subResource:'categories',
							testId:'@testId'
						}
					},
					query:{
						method:'GET',
						isArray:true,
						data:null, //must specify data so that Content-Type header can be included
						headers:{'Content-Type':'application/json'}
					},
					activateTest:{
						method:'POST',
						params:{
							subResource:'activate'
						},
						testId:'@id'
					}
				});
		return TestResource;
	}])
	.name; 