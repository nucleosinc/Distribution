import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import Alert from 'react-bootstrap/lib/Alert'
import {tex} from '#/main/core/translation'

import {
  correctionModes,
  markModes,
  quizTypes,
  SHOW_CORRECTION_AT_DATE
} from './../enums'

const Parameter = props =>
  <tr>
    <th className="text-right col-md-4" scope="row">
      {tex(props.name)}
    </th>
    <td className="text-center col-md-8">
      {props.children}
    </td>
  </tr>

Parameter.propTypes = {
  name: T.string.isRequired,
  children: T.any.isRequired
}

const Parameters = props =>
  <div className="panel panel-default">
    <table className="table table-striped table-bordered">
      <tbody>
        {props.parameters.duration > 0 &&
          <Parameter name="duration">{props.parameters.duration}</Parameter>
        }
        <Parameter name="availability_of_correction">
          {props.parameters.showCorrectionAt === SHOW_CORRECTION_AT_DATE ?
            props.parameters.correctionDate :
            tex(correctionModes.find(mode => mode[0] === props.parameters.showCorrectionAt)[1])
          }
        </Parameter>
        <Parameter name="availability_of_score">
          {tex(markModes.find(mode => mode[0] === props.parameters.showScoreAt)[1])}
        </Parameter>
      </tbody>
        {props.editable && props.additionalInfo &&
          <tbody>
            <Parameter name="type">
              {tex(quizTypes.find(type => type[0] === props.parameters.type)[1])}
            </Parameter>
            <Parameter name="number_steps_draw">
              {props.picking.pick || tex('all_step')}
            </Parameter>
            <Parameter name="random_steps">
              {tex(props.picking.randomOrder ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="keep_same_step">
              {tex(props.picking.randomPick ? 'no' : 'yes')}
            </Parameter>
            <Parameter name="anonymous">
              {tex(props.parameters.anonymizeAttempts ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="test_exit">
              {tex(props.parameters.interruptible ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="maximum_tries">
              {props.parameters.maxAttempts || '-'}
            </Parameter>
            <Parameter name="maximum_attempts_per_day">
              {props.parameters.maxAttemptsPerDay || '-'}
            </Parameter>
            <Parameter name="maximum_papers">
              {props.parameters.maxPapers || '-'}
            </Parameter>
            <Parameter name="maximum_papers">
              {props.parameters.maxPapers || '-'}
            </Parameter>
            <Parameter name="mandatory_questions">
              {props.parameters.mandatoryQuestions ? 'yes': 'no'}
            </Parameter>
          </tbody>
        }
    </table>
    {props.editable &&
      <div
        className="panel-footer text-center toggle-exercise-info"
        role="button"
        onClick={props.onAdditionalToggle}
      >
        <span className={classes('fa', 'fa-fw', props.additionalInfo ? 'fa-caret-up' : 'fa-caret-right')}/>
        {tex(props.additionalInfo ? 'hide_additional_info' : 'show_additional_info')}
      </div>
    }
  </div>

Parameters.propTypes = {
  editable: T.bool.isRequired,
  additionalInfo: T.bool.isRequired,
  onAdditionalToggle: T.func.isRequired,
  parameters: T.shape({
    type: T.string.isRequired,
    duration: T.number.isRequired,
    maxPapers: T.number.isRequired,
    maxAttempts: T.number.isRequired,
    maxAttemptsPerDay: T.number.isRequired,
    mandatoryQuestions: T.bool.isRequired,
    interruptible: T.bool.isRequired,
    showCorrectionAt: T.string.isRequired,
    correctionDate: T.string,
    anonymizeAttempts: T.bool.isRequired,
    showScoreAt: T.string.isRequired
  }).isRequired,
  picking: T.shape({
    randomOrder: T.string.isRequired,
    randomPick: T.string.isRequired,
    pick: T.oneOfType([T.number, T.array]).isRequired
  }).isRequired
}

const Layout = props =>
  <div className="quiz-overview">
    {props.empty &&
      <div className="alert alert-info text-center">
        <span className="fa fa-fw fa-warning" />
        {tex('exo_empty_user_read_only')}
      </div>
    }

    {props.description &&
      <div className="quiz-description panel panel-default">
        <div className="panel-body" dangerouslySetInnerHTML={{ __html: props.description }} />
      </div>
    }
    {props.parameters.showMetadata &&
      <Parameters {...props}/>
    }

    {!props.empty &&
      (props.parameters.maxAttempts === 0 ||
        (
          props.meta.userPaperCount < props.parameters.maxAttempts &&
          ((props.meta.userPaperDayCount < props.parameters.maxAttemptsPerDay) || props.parameters.maxAttemptsPerDay === 0)
        )
      ) && ((props.meta.paperCount < props.parameters.maxPapers) || props.parameters.maxPapers === 0) ?
        <a href="#play" className="btn btn-start btn-lg btn-primary btn-block">
          {tex('exercise_start')}
        </a>:

        <Alert bsStyle="danger overview-warning">
          <span className="fa fa-fw fa-warning">{"\u00A0"}</span>
          {(props.meta.userPaperCount < props.parameters.maxAttempts &&
            ((props.meta.userPaperDayCount < props.parameters.maxAttemptsPerDay) || props.parameters.maxAttemptsPerDay === 0)
          ) ?
            <span>{tex('exercise_attempt_limit')}</span>:
          ((props.meta.paperCount < props.parameters.maxPapers) || props.parameters.maxPapers === 0) ?
            <span>{tex('exercise_paper_limit')}</span>:
            <span></span>
          }
        </Alert>
    }
  </div>

Layout.propTypes = {
  empty: T.bool.isRequired,
  editable: T.bool.isRequired,
  description: T.string,
  onAdditionalToggle: T.func.isRequired,
  parameters: T.shape({
    showMetadata: T.bool.isRequired,
    maxAttempts: T.number.isRequired,
    maxAttemptsPerDay: T.number.isRequired,
    maxPapers: T.number.isRequired
  }).isRequired,
  meta: T.shape({
    userPaperCount: T.number.isRequired,
    userPaperDayCount: T.number.isRequired,
    paperCount: T.number.isRequired
  }).isRequired
}

Layout.defaultProps = {
  description: null
}

class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      additionalInfo: false
    }
  }

  render() {
    return (
      <Layout
        empty={this.props.empty}
        editable={this.props.editable}
        description={this.props.quiz.description}
        parameters={this.props.quiz.parameters}
        picking={this.props.quiz.picking}
        meta={this.props.quiz.meta}
        additionalInfo={this.state.additionalInfo}
        onAdditionalToggle={() => this.setState({
          additionalInfo: !this.state.additionalInfo
        })}
      />
    )
  }
}

Overview.propTypes = {
  empty: T.bool.isRequired,
  editable: T.bool.isRequired,
  quiz: T.shape({
    description: T.string,
    meta: T.object.isRequired,
    parameters: T.object.isRequired,
    picking: T.object.isRequired
  }).isRequired
}

export {Overview}
