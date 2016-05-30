import angular from "angular";
import core from "renison-ept-frontend-core";
import 'angular-resource';
export default angular.module('eptAdmin.service.question',[core,'ngResource'])
	.factory('TestComponentService',['BaseService','$resource',function (BaseService,$resource) {
		this.testComponentBaseUrl = "/testComponents";
		var TestComponentResource = $resource(BaseService.BASE_URL + this.testComponentBaseUrl + '/:testComponentId/:subResource',
				{
					testComponentId:'@id' // use id as default
				}, {
					save: {method:'PUT'},
					remove:{
						method:'DELETE',
						params:{testComponentId:'@id'}
					}
				}, );
		return TestComponentResource;
	}])
	.name; 