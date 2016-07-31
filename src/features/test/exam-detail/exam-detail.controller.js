var _ = require('lodash');
import ComponentType from 'renison-ept-frontend-core/src/constants/component-type';
import QuestionType from 'renison-ept-frontend-core/src/constants/question-type';

ExamDetailController.$inject  = ['$rootScope','$scope', 
    '$stateParams', '$state','$q','BaseService','$cookies',
    'BaseToastService','exam'];

export default function ExamDetailController($rootScope,$scope, 
    $stateParams,$state,$q,BaseService, 
    $cookies, BaseToastService,exam) {
  
    $scope.exam = exam;
    // todo refactor in the backend
    _.forEach($scope.exam.categories,function(category){
        var questionIndex = 1;
        category.testComponents = _.sortBy(category.testComponents,'ordering');
        // a paragraph should be count towards question index
        for (var i=0;i<category.testComponents.length;i++){
            if(category.testComponents[i].componentType === ComponentType.COMP_HTML){
                continue;
            }
            category.testComponents[i]['questionIndex'] = questionIndex;
            questionIndex++;
        }
    });
}