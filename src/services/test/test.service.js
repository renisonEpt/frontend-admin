import angular from "angular";
import core from "renison-ept-frontend-core";
import 'angular-resource';
export default angular.module('eptAdmin.service.test',[core,'ngResource'])
	.factory('TestService',['BaseService','$resource',function (BaseService,$resource) {
		this.testBaseUrl = "/tests";

		// function getUrlWithId(id){
		// 	return testBaseUrl + "/" + id;
		// }
		// this.get = function (id) {
		// 	return BaseService.get(getUrlWithId(id));
		// };
		// this.save = function (test) {
		// 	if(test.id){
		// 		return BaseService.put(this.testBaseUrl + "/" + test.id,test);
		// 	}else{
		// 		return BaseService.post(this.testBaseUrl,test);
		// 	}
		// };
		// this.getCategories = function(id){
		// 	return BaseService.get(getUrlWithId(id) + "/categories");
		// };
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
					query:{
						method:'GET',
						isArray:true,
						data:null, //must specify data so that Content-Type header can be included
						headers:{'Content-Type':'application/json'}
					}
				});
		return TestResource;
	}])
	.name; 