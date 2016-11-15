import './review-exams.less';

var _ = require('lodash');
ExamDetailController.$inject  = ['$rootScope','$scope', 
    '$stateParams', '$state','$q','BaseService','$cookies',
    'BaseModalService','BaseToastService','TestSessionService','TestService','UtilService',
    'scoredSessions','studentStatus','categories','$interval'];

export default function ExamDetailController($rootScope,$scope, 
    $stateParams,$state,$q,BaseService,$cookies,
    BaseModalService,BaseToastService,TestSessionService,TestService,UtilService,
    scoredSessions,studentStatus,categories,$interval) {

    /*----------  initialization  ----------*/
    
    $scope.scoredSessions = scoredSessions;
    // refresh students' progress every 5 seconds
    $scope.refreshHandler = $interval(refreshOngoingSessions,5000);
    $scope.$on('$destroy',function(){
        if($scope.refreshHandler) $interval.cancel($scope.refreshHandler);
    });
    $scope.scoredSessionShown = false;
    $scope.ongoingSessionShown = true;
    // ongoing sessions are students currently taking the test
    $scope.categories = categories;
    $scope.ongoingSessionActions = [{
        iconClass: 'fa fa-pencil',
        onAction: displaySetProgressForm
    }];
    displayOngoingSessions(studentStatus);

    /*=====  End of intialization  ======*/

    $scope.viewExam = function(scoredSession){
        $state.go('examDetail',{
            testSessionId:scoredSession.id
        });
    };
    
    function attachProgressInfoEntries(session){
        var currentCategory = $scope.categories[
            _.findIndex($scope.categories,{'id':session.categoryId})
        ];
        if(!currentCategory) {
            session.infoEntries = [{
                iconClass:'fa fa-file',
                text: 'N/A'
            },{
                iconClass:'fa fa-clock-o',
                text: 'N/A'
            }];
        }else{
            session.infoEntries = [{
                iconClass:'fa fa-file',
                text:currentCategory.name
            },{
                iconClass:'fa fa-clock-o',
                text: UtilService.formatSeconds(session.timeRemaining)
            }];
        }
    }
    // perform necessary preprocessing and display ongoingSessions
    function displayOngoingSessions(ongoingSessions){
        _.forEach(ongoingSessions,function(session){
            attachProgressInfoEntries(session);
        });
        $scope.ongoingSessions = ongoingSessions;
    }
    // refreshes session info
    function refreshOngoingSessions(){
        TestService.getStudentStatus({
            testId:$stateParams.testId
        }).$promise
        .then(function(studentStatus){oldStatus
            // studentStatus might have new elements added
            // but all of them should have strictly larger testSessionId
            // so that index of each old element is preserved across student
            // status and ongoingSession
            studentStatus = _.sortBy(studentStatus,'testSessionId');
            $scope.ongoingSessions = _.sortBy($scope.ongoingSessions,'testSessionId');
            // use session with newest info
            // but except preserving a few local properties, such as
            // editting enabled
            for(var i=0;i<$scope.ongoingSessions.length;i++){
                var newStatus = studentStatus[i];
                var oldStatus = $scope.ongoingSessions[i];
                for (var key in oldStatus){
                    if(!oldStatus.hasOwnProperty(key)){
                        continue;
                    }
                    // we don't want to override properties in newStatus
                    if(newStatus.hasOwnProperty(key)){
                        continue;
                    }
                    newStatus[key] = oldStatus[key];
                }
            }
            return studentStatus;
        }).then(function(studentStatus){
            displayOngoingSessions(studentStatus);
        }).catch(showErrorMsg);
    }
    function displaySetProgressForm(testSession){
        if (!$stateParams.active){
            BaseModalService
                .errorAlert('Test has not started yet, please go back and start the test then alter progress');
            return;
        }
        testSession.edittingEnabled = true;
    }
    // changes the progress for one student
    $scope.setSessionProgress = function(testSession){
        var categoryId = testSession.newCategoryId;
        var timeRemaining = testSession.newTimeRemaining;
        delete testSession.newCategoryId;
        delete testSession.newTimeRemaining;
        TestSessionService.setProgress({
            testSessionId:testSession.testSessionId,
            categoryId: categoryId,
            timeRemaining: timeRemaining
        }).$promise.then(function(){
            testSession.edittingEnabled = false;
        }).catch(showErrorMsg);
    };
    $scope.cancelSetSessionProgress = function(testSession){
        delete testSession.newCategoryId;
        delete testSession.newTimeRemaining;
        testSession.edittingEnabled = false;
    };

    // show an importantRemark when a student finished the test
    $scope.getFinishedMessage = function(session){
        if(session.testSubmitted){
            return 'FINISHED '+UtilService.formatSeconds(session.elapsedTimeAfterEnd) +' ago';
        }
        return '';
    };
    function showErrorMsg(response){
        var errorMsg = 'Oops, a technical just occurred.'
        if(response && response.data && response.data.errorMessage){
            errorMsg = response.data.errorMessage;
        }
        BaseToastService.error(errorMsg);
    }
}