/**
 * Question module
 */

import angular from 'angular/index'
import 'angular-bootstrap'
import 'angular-ui-translation/angular-translation'
import '#/main/core/modal/module'
import '#/main/core/asset/module'
import '#/main/core/time/module'
import '#/main/core/translation/module'

import './../common/module'
import './../feedback/module'
import './../hint/module'
import './../correction/module'
import './../image/module'

import QuestionShowCtrl from './Controllers/QuestionShowCtrl'
import ChoiceQuestionCtrl from './Controllers/Type/ChoiceQuestionCtrl'
import ClozeQuestionCtrl from './Controllers/Type/ClozeQuestionCtrl'
import GraphicQuestionCtrl from './Controllers/Type/GraphicQuestionCtrl'
import MatchQuestionCtrl from './Controllers/Type/MatchQuestionCtrl'
import OpenQuestionCtrl from './Controllers/Type/OpenQuestionCtrl'
import BoundaryQuestionCtrl from './Controllers/Type/BoundaryQuestionCtrl'

import QuestionShowDirective from './Directives/QuestionShowDirective'
import ChoiceQuestionDirective from './Directives/Type/ChoiceQuestionDirective'
import ClozeQuestionDirective from './Directives/Type/ClozeQuestionDirective'
import GraphicQuestionDirective from './Directives/Type/GraphicQuestionDirective'
import MatchQuestionDirective from './Directives/Type/MatchQuestionDirective'
import OpenQuestionDirective from './Directives/Type/OpenQuestionDirective'
import BoundaryQuestionDirective from './Directives/Type/BoundaryQuestionDirective'

import QuestionService from './Services/QuestionService'
import ChoiceQuestionService from './Services/Type/ChoiceQuestionService'
import ClozeQuestionService from './Services/Type/ClozeQuestionService'
import GraphicQuestionService from './Services/Type/GraphicQuestionService'
import MatchQuestionService from './Services/Type/MatchQuestionService'
import OpenQuestionService from './Services/Type/OpenQuestionService'
import BoundaryQuestionService from './Services/Type/BoundaryQuestionService'

angular
  .module('Question', [
    'ui.translation',
    'translation',
    'ui.bootstrap',
    'ui.asset',
    'ui.modal',
    'Common',
    'Feedback',
    'Image',
    'Hint',
    'Correction',
    'time'
  ])
  .controller('QuestionShowCtrl', [
    '$uibModal',
    'ExerciseService',
    'QuestionService',
    'FeedbackService',
    QuestionShowCtrl
  ])
  .controller('ChoiceQuestionCtrl', [
    'FeedbackService',
    'ChoiceQuestionService',
    ChoiceQuestionCtrl
  ])
  .controller('ClozeQuestionCtrl', [
    'FeedbackService',
    'ClozeQuestionService',
    ClozeQuestionCtrl
  ])
  .controller('GraphicQuestionCtrl', [
    'FeedbackService',
    'GraphicQuestionService',
    'ImageAreaService',
    GraphicQuestionCtrl
  ])
  .controller('MatchQuestionCtrl', [
    'FeedbackService',
    '$scope',
    '$uibModal',
    'MatchQuestionService',
    MatchQuestionCtrl
  ])
  .controller('OpenQuestionCtrl', [
    'FeedbackService',
    'OpenQuestionService',
    OpenQuestionCtrl
  ])
  .controller('BoundaryQuestionCtrl',[
    'FeedbackService',
    '$scope',
    '$timeout',
    '$window',
    'Translator',
    'BoundaryQuestionService',
    BoundaryQuestionCtrl
  ])
  .directive('questionShow', [
    QuestionShowDirective
  ])
  .directive('choiceQuestion', [
    'FeedbackService',
    ChoiceQuestionDirective
  ])
  .directive('clozeQuestion', [
    'FeedbackService',
    '$compile',
    ClozeQuestionDirective
  ])
  .directive('graphicQuestion', [
    'FeedbackService',
    '$window',
    GraphicQuestionDirective
  ])
  .directive('matchQuestion', [
    'FeedbackService',
    '$timeout',
    '$window',
    'MatchQuestionService',
    MatchQuestionDirective
  ])
  .directive('openQuestion', [
    'FeedbackService',
    OpenQuestionDirective
  ])
  .directive('boundaryQuestion', [
    'FeedbackService',
    BoundaryQuestionDirective
  ])
  .service('QuestionService', [
    '$log',
    'ChoiceQuestionService',
    'ClozeQuestionService',
    'GraphicQuestionService',
    'MatchQuestionService',
    'OpenQuestionService',
    'BoundaryQuestionService',
    QuestionService
  ])
  .service('ChoiceQuestionService', [
    '$log',
    'FeedbackService',
    ChoiceQuestionService
  ])
  .service('ClozeQuestionService', [
    '$log',
    'FeedbackService',
    ClozeQuestionService
  ])
  .service('GraphicQuestionService', [
    '$log',
    'FeedbackService',
    'ImageAreaService',
    GraphicQuestionService
  ])
  .service('MatchQuestionService', [
    '$log',
    'FeedbackService',
    MatchQuestionService
  ])
  .service('OpenQuestionService', [
    '$log',
    'FeedbackService',
    OpenQuestionService
  ])
  .service('BoundaryQuestionService', [
    '$log',
    'FeedbackService',
    BoundaryQuestionService
  ])
