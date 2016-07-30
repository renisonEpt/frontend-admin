var _ = require('lodash');
import ComponentType from 'renison-ept-frontend-core/src/constants/component-type';
import QuestionType from 'renison-ept-frontend-core/src/constants/question-type';

ExamDetailController.$inject  = ['$rootScope','$scope', 
    '$stateParams', '$state','$q','BaseService','$cookies',
    'BaseToastService'];

export default function ExamDetailController($rootScope,$scope, 
    $stateParams,$state,$q,BaseService,$cookies, BaseToastService) {
    $scope.exam = {
        name:'Han chen',
        score:43,
        totalScore:55,
        categories:[{
          "id": 1040,
          "createTimestamp": 1468180426000,
          "updateTimestamp": 1468180426000,
          "name": "Listening",
          "testComponents": [
            {
              "id": 1120,
              "createTimestamp": 1468180437000,
              "updateTimestamp": 1468180437000,
              "componentType": "MULTIPLE_CHOICE",
              "ordering": 0,
              "content": "Who was late",
              "answers": [
                {
                  "id": 1417,
                  "createTimestamp": 1468180476000,
                  "updateTimestamp": 1468180476000,
                  "content": "The boss",
                  "isCorrect": true,
                  "correct": true
                },
                {
                  "id": 1418,
                  "createTimestamp": 1468180476000,
                  "updateTimestamp": 1468180476000,
                  "content": "The secretary",
                  "isCorrect": false,
                  "correct": false
                }
              ],
              "response": [{
                "text":"The secretary"
              }],
              "isSaved": false
            },
            {
              "id": 1121,
              "createTimestamp": 1468180478000,
              "updateTimestamp": 1468180478000,
              "componentType": "TRUE_FALSE",
              "ordering": 1,
              "content": "The customer has 3 options",
              "answers": [
                {
                  "id": 1425,
                  "createTimestamp": 1468180492000,
                  "updateTimestamp": 1468180492000,
                  "content": "true",
                  "isCorrect": false,
                  "correct": false
                },
                {
                  "id": 1426,
                  "createTimestamp": 1468180492000,
                  "updateTimestamp": 1468180492000,
                  "content": "false",
                  "isCorrect": true,
                  "correct": true
                }
              ],
              "response": [{
                "text":"false"
              }],
              "isSaved": false
            }
          ],
          "timeAllowed": 5,
          "ordering": 1,
          "allCategories": [],
          "timeAllowedInSeconds": 300,
          "totalScore": 2
        }]
    };
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