import angular from "angular";
import core from "renison-ept-frontend-core";
import 'angular-resource';
export default angular.module('eptAdmin.service.testSession',[core,'ngResource'])
    .factory('TestSessionService',['BaseService','$resource',function (BaseService,$resource) {
        this.testSessionBaseUrl = "/testSessions";
        var TestSessionResource = $resource(BaseService.BASE_URL + this.testSessionBaseUrl + '/:testSessionId/:subResource',
                {
                    testSessionId:'@id' // use id as default
                }, {
                    save: {method:'PUT'},
                    remove:{
                        method:'DELETE',
                        params:{testSessionId:'@id'}
                    },
                    getExam:{
                        method:'GET',
                        params:{
                            testSessionId:'@id', // for some reason this doesnot work
                            subResource:'exam'
                        }
                    }
                }, );
        return TestSessionResource;
    }])
    .name; 