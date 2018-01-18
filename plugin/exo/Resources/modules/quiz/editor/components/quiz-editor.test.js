import React from 'react'
import {shallow, mount} from 'enzyme'

import {spyConsole, renew, ensure, mockGlobals} from '#/main/core/scaffolding/tests'
import {QUIZ_PICKING_DEFAULT, SHUFFLE_ONCE, SHUFFLE_NEVER} from './../../enums'
import {QuizEditor} from './quiz-editor.jsx'

describe('<QuizEditor/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(QuizEditor, 'QuizEditor')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(
      React.createElement(QuizEditor, {
        quiz: {}
      })
    )

    ensure.missingProps('QuizEditor', [
      'quiz.description',
      'items',
      'tags',
      'validating',
      'updateProperties',
      'activePanelKey',
      'handlePanelClick'
    ])
  })

  it('has typed props', () => {
    shallow(
      React.createElement(QuizEditor, {
        quiz: 'foo',
        validating: [],
        updateProperties: 123,
        activePanelKey: [],
        handlePanelClick: 'bar'
      })
    )

    ensure.invalidProps('QuizEditor', [
      'quiz',
      'validating',
      'updateProperties',
      'activePanelKey',
      'handlePanelClick'
    ])
  })

  it('renders a form and dispatches changes', () => {
    let updatedPath = null
    let updatedValue = null

    const form = mount(
      React.createElement(QuizEditor, {
        quiz: fixture(),
        tags: [],
        items: {},
        validating: false,
        updateProperties: (path, value) => {
          updatedPath = path
          updatedValue = value
        },
        activePanelKey: false,
        handlePanelClick: () => true
      })
    )

    ensure.propTypesOk()
    ensure.equal(form.find('form').length, 1, 'has form')

    const anonymizeAttempts = form.find('input#quiz-anonymizeAttempts')
    ensure.equal(anonymizeAttempts.length, 1, 'has anonymizeAttempts checkbox')
    anonymizeAttempts.simulate('change', {target: {checked: true}})
    ensure.equal(updatedPath, 'parameters.anonymizeAttempts')
    ensure.equal(updatedValue, true)
  })
})

function fixture() {
  return {
    description: 'DESC',
    parameters: {
      type: 'type',
      showMetadata: true,
      duration: 123,
      numbering: 'none',
      maxAttempts: 4,
      maxAttemptsPerDay: 4,
      mandatoryQuestions: false,
      maxPapers: 4,
      interruptible: true,
      showEndPage: false,
      showCorrectionAt: 'never',
      correctionDate: null,
      anonymizeAttempts: false,
      showOverview: true,
      showScoreAt: 'never',
      showStatistics: true,
      allPapersStatistics: true,
      showFullCorrection: false,
      showFeedback: false
    },
    picking: {
      type: QUIZ_PICKING_DEFAULT,
      randomOrder: SHUFFLE_NEVER,
      randomPick: SHUFFLE_ONCE,
      pick: 12
    }
  }
}
