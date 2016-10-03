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
    $scope.ongoingSessions = [{
        name:'Han Chen'
    },{
        name: 'Steven Liu'
    },{
        name: 'Lewis Zhou',
        testSubmitted: true,
        edittingEnabled:true
    }];
    $scope.ongoingSessionActions = [{
        iconClass: 'fa fa-pencil',
        onAction: function(session){
            session.edittingEnabled = true;

        }
    }];
    $scope.getFinishedMessage = function(session){
        if(session.testSubmitted){
            return 'FINISHED 20 secs ago';
        }
        return '';
    };
}