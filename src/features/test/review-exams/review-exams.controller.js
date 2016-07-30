var _ = require('lodash');
ExamDetailController.$inject  = ['$rootScope','$scope', 
    '$stateParams', '$state','$q','BaseService','$cookies',
    'BaseToastService'];

export default function ExamDetailController($rootScope,$scope, 
    $stateParams,$state,$q,BaseService,$cookies, BaseToastService) {
    $scope.scoredSessions = [{
        name:'Ailin Zhang',
        score:'43',
        testSessionId:1236
    },{
        name:'David Xie',
        score:'33',
        testSessionId:3428
    }];
    $scope.viewExam = function(scoredSession){
        $state.go('examDetail',{
            scoredSessionId:scoredSession.id
        });
    };
}