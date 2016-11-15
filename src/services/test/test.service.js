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
					getScoredSessions:{
						method:'GET',
						params:{
							subResource:'scoredSessions'
						},
						isArray:true
					},
					getStudentStatus:{
						method:'GET',
						params:{
							subResource:'studentStatus'
						},
						isArray:true
					},
					getSessions:{
						method:'GET',
						params:{
							testId:'@id',
							subResource:'sessions'
						},
						isArray:true
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
					syncCategoryOrder:{
						method:'PUT',
						params:{
							subResource:'categoryOrder'
						},
						isArray:true
					},
					query:{
						method:'GET',
						isArray:true,
						data:null, //must specify data so that Content-Type header can be included
						headers:{'Content-Type':'application/json'}
					},
					toggleTestStatus:{
						method:'POST',
						params:{
							subResource:'status',
							testId:'@id',
							isStart:'@isStart'
						},
						data:null
					},
					scoreTest:{
						method:'POST',
						params:{
							subResource:'score',
							testId:'@id'
						},
						data:null
					},
					generateReport:{
						method:'GET',
						params:{
							subResource:'report',
							testId:'@id'
						},
						isArray:true,
						data:null, //must specify data so that Content-Type header can be included
						headers:{'Content-Type':'application/json'}
					},
					copyTest: {
						method:'POST',
						params:{
							subResource:'copy'
						}
					}
				});
		return TestResource;
	}])
	.name; 