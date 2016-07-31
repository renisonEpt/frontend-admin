import './review-exams.less';

var _ = require('lodash');
ExamDetailController.$inject  = ['$rootScope','$scope', 
    '$stateParams', '$state','$q','BaseService','$cookies',
    'BaseToastService','scoredSessions'];

export default function ExamDetailController($rootScope,$scope, 
    $stateParams,$state,$q,BaseService,$cookies,
    BaseToastService,scoredSessions) {
    $scope.scoredSessions = scoredSessions;
    $scope.viewExam = function(scoredSession){
        $state.go('examDetail',{
            testSessionId:scoredSession.id
        });
    };
}