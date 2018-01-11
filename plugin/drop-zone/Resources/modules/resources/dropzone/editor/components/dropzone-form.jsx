import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {t, trans} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/layout/resource/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {DropzoneType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'
import {actions} from '#/plugin/drop-zone/resources/dropzone/editor/actions'

class Criterion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: !props.criterion.instruction
    }
  }

  render() {
    return (
      <div className="criterion-row">
        {this.state.editMode ?
          <HtmlGroup
            id={`criterion-textarea-${this.props.criterion.id}`}
            className="criterion-content"
            label="no_label"
            hideLabel={true}
            value={this.props.criterion.instruction || ''}
            onChange={value => this.props.handleChange(this.props.criterion.id, 'instruction', value)}
            minRows={3}
            warnOnly={!this.props.validating}
            error={get(this.props.errors, `criteria.${this.props.criterion.id}`)}
          /> :
          <HtmlText className="criterion-content">
            {this.props.criterion.instruction}
          </HtmlText>
        }
        <div className="criterion-btn-group">
          <button
            className="btn btn-default btn-sm"
            type="button"
            disabled={!this.props.criterion.instruction}
            onClick={() => this.setState({editMode: !this.state.editMode})}
          >
            <span className="fa fa-fw fa-pencil"/>
          </button>
          <button
            className="btn btn-danger btn-sm"
            type="button"
            onClick={() => this.props.handleDelete(this.props.criterion.id)}
          >
            <span className="fa fa-fw fa-trash"/>
          </button>
        </div>
      </div>
    )
  }
}

Criterion.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes),
  criterion: T.shape({
    id: T.string.isRequired,
    instruction: T.string
  }).isRequired,
  errors: T.object,
  validating: T.bool,
  handleChange: T.func.isRequired,
  handleDelete: T.func.isRequired
}

const Criteria = props =>
  <div>
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => props.addCriterion(props.dropzone.id)}
    >
      <span className="fa fa-fw fa-plus"></span>
      {trans('add_criterion', {}, 'dropzone')}
    </button>
    {props.dropzone.criteria && props.dropzone.criteria.map(c =>
      <Criterion
        key={`criterion-${c.id}`}
        dropzone={props.dropzone}
        criterion={c}
        validating={props.validating}
        errors={props.errors}
        handleChange={props.updateCriterion}
        handleDelete={props.removeCriterion}
      />
    )}
  </div>

Criteria.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  addCriterion: T.func.isRequired,
  updateCriterion: T.func.isRequired,
  removeCriterion: T.func.isRequired
}

const CriteriaSection = props =>
  <FormContainer
    level={3}
    name="dropzoneForm"
    sections={[
      {
        id: 'criteria',
        title: trans('criteria', {}, 'dropzone'),
        primary: true,
        fields: [
          {
            name: 'parameters.commentInCorrectionEnabled',
            type: 'boolean',
            label: trans('enable_comment', {}, 'dropzone')
          },
          {
            name: 'parameters.commentInCorrectionForced',
            type: 'boolean',
            label: trans('force_comment', {}, 'dropzone')
          },
          {
            name: 'parameters.criteriaEnabled',
            type: 'boolean',
            label: trans('enable_evaluation_criteria', {}, 'dropzone'),
            required: props.dropzone.parameters.peerReview,
            help: trans('required_criteria_info', {}, 'dropzone')
          },
          {
            name: 'display.correctionInstruction',
            type: 'html',
            label: trans('correction_instruction', {}, 'dropzone'),
            displayed: props.dropzone.parameters.criteriaEnabled,
            options: {
              minRows: 3
            }
          },
          {
            name: 'parameters.criteriaTotal',
            type: 'number',
            label: trans('criteria_scale', {}, 'dropzone'),
            displayed: props.dropzone.parameters.criteriaEnabled,
            required: props.dropzone.parameters.criteriaEnabled,
            options: {
              min: 2
            }
          }
        ]
      }
    ]}
  >
    {props.dropzone.parameters.criteriaEnabled &&
      <Criteria {...props}/>
    }
  </FormContainer>

CriteriaSection.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  addCriterion: T.func.isRequired,
  updateCriterion: T.func.isRequired,
  removeCriterion: T.func.isRequired
}

const DropzoneForm = props => props.canEdit ?
  <FormContainer
    level={3}
    name="dropzoneForm"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'display.instruction',
            type: 'html',
            label: trans('instructions', {}, 'dropzone'),
            required: true,
            options: {
              minRows: 3
            }
          }
        ]
      },
      {
        id: 'documents',
        title: trans('allowed_document_types', {}, 'dropzone'),
        fields: [
          {
            name: 'parameters.uploadEnabled',
            type: 'boolean',
            label: trans('uploaded_files', {}, 'dropzone')
          },
          {
            name: 'parameters.richTextEnabled',
            type: 'boolean',
            label: trans('rich_text_online_edition', {}, 'dropzone')
          },
          {
            name: 'parameters.workspaceResourceEnabled',
            type: 'boolean',
            label: trans('workspace_resources', {}, 'dropzone')
          },
          {
            name: 'parameters.urlEnabled',
            type: 'boolean',
            label: trans('url_info', {}, 'dropzone')
          }
        ]
      },
      {
        id: 'correction',
        title: trans('drop_and_correction_type', {}, 'dropzone'),
        fields: [
          {
            name: 'parameters.dropType',
            type: 'enum',
            label: trans('drop_type', {}, 'dropzone'),
            required: true,
            options: {
              noEmpty: true,
              choices: constants.DROP_TYPES
            }
          },
          {
            name: 'parameters.peerReview',
            type: 'boolean',
            label: trans('peer_correction_info', {}, 'dropzone')
          },
          {
            name: 'parameters.expectedCorrectionTotal',
            type: 'number',
            label: trans('expected_correction_total_label', {}, 'dropzone'),
            required: props.dropzone.parameters.peerReview,
            displayed: props.dropzone.parameters.peerReview,
            options: {
              min: 1
            }
          },
          {
            name: 'display.displayCorrectionsToLearners',
            type: 'boolean',
            label: trans('display_corrections_to_learners', {}, 'dropzone'),
            displayed: props.dropzone.parameters.peerReview
          },
          {
            name: 'parameters.correctionDenialEnabled',
            type: 'boolean',
            label: trans('correction_denial_label', {}, 'dropzone'),
            displayed: props.dropzone.parameters.peerReview && props.dropzone.display.displayCorrectionsToLearners
          }
        ]
      },
      {
        id: 'notation',
        title: trans('rating', {}, 'dropzone'),
        fields: [
          {
            name: 'parameters.scoreMax',
            type: 'number',
            label: trans('score_max', {}, 'dropzone'),
            required: true,
            options: {
              min: 0
            }
          },
          {
            name: 'parameters.scoreToPass',
            type: 'number',
            label: trans('score_to_pass', {}, 'dropzone'),
            required: true,
            options: {
              min: 0
            }
          },
          {
            name: 'display.displayNotationToLearners',
            type: 'boolean',
            label: trans('display_notation_to_learners', {}, 'dropzone')
          },
          {
            name: 'display.displayNotationMessageToLearners',
            type: 'boolean',
            label: trans('display_notation_message_to_learners', {}, 'dropzone')
          },
          {
            name: 'display.successMessage',
            type: 'html',
            label: trans('success_message', {}, 'dropzone'),
            displayed: props.dropzone.display.displayNotationMessageToLearners,
            required: props.dropzone.display.displayNotationMessageToLearners,
            options: {
              minRows: 3
            }
          },
          {
            name: 'display.failMessage',
            type: 'html',
            label: trans('fail_message', {}, 'dropzone'),
            displayed: props.dropzone.display.displayNotationMessageToLearners,
            required: props.dropzone.display.displayNotationMessageToLearners,
            options: {
              minRows: 3
            }
          }
        ]
      },
      {
        id: 'planning',
        title: trans('planning', {}, 'dropzone'),
        fields: [
          {
            name: 'parameters.manualPlanning',
            type: 'boolean',
            label: trans('manual_planning', {}, 'dropzone'),
            help: trans('manual_planning_info', {}, 'dropzone')
          },
          {
            name: 'parameters.manualState',
            type: 'enum',
            label: trans('choose_current_state', {}, 'dropzone'),
            displayed: props.dropzone.parameters.manualPlanning,
            required: props.dropzone.parameters.manualPlanning,
            options: {
              noEmpty: true,
              choices: props.dropzone.parameters.peerReview ? constants.PEER_PLANNING_STATES : constants.TEACHER_PLANNING_STATES
            }
          },
          {
            name: 'parameters.dropStartDate',
            type: 'date',
            label: trans('drop_start_date', {}, 'dropzone'),
            displayed: !props.dropzone.parameters.manualPlanning,
            required: !props.dropzone.parameters.manualPlanning
          },
          {
            name: 'parameters.dropEndDate',
            type: 'date',
            label: trans('drop_end_date', {}, 'dropzone'),
            displayed: !props.dropzone.parameters.manualPlanning,
            required: !props.dropzone.parameters.manualPlanning
          },
          {
            name: 'parameters.autoCloseDropsAtDropEndDate',
            type: 'boolean',
            label: trans('auto_close_drops_at_drop_end_date', {}, 'dropzone'),
            displayed: !props.dropzone.parameters.manualPlanning
          },
          {
            name: 'parameters.reviewStartDate',
            type: 'date',
            label: trans('review_start_date', {}, 'dropzone'),
            displayed: props.dropzone.parameters.peerReview && !props.dropzone.parameters.manualPlanning,
            required: props.dropzone.parameters.peerReview && !props.dropzone.parameters.manualPlanning
          },
          {
            name: 'parameters.reviewEndDate',
            type: 'date',
            label: trans('review_end_date', {}, 'dropzone'),
            displayed: props.dropzone.parameters.peerReview && !props.dropzone.parameters.manualPlanning,
            required: props.dropzone.parameters.peerReview && !props.dropzone.parameters.manualPlanning
          }
        ]
      },
      {
        id: 'notification',
        title: t('notifications'),
        fields: [
          {
            name: 'notifications.enabled',
            type: 'boolean',
            label: trans('notify_managers_on_drop', {}, 'dropzone')
          }
        ]
      }
    ]}
  >
    <FormSections level={3}>
      <FormSection
        id="criteria-section"
        title={trans('evaluation_criteria', {}, 'dropzone')}
        level={3}
      >
        <p>{trans('criteria_info_1', {}, 'dropzone')}</p>
        <p>{trans('criteria_info_2', {}, 'dropzone')}</p>
        <p>{trans('criteria_info_3', {}, 'dropzone')}</p>
        <CriteriaSection {...props}/>
      </FormSection>
    </FormSections>
  </FormContainer>:
  <div className="alert alert-danger">
    {t('unauthorized')}
  </div>

DropzoneForm.propTypes = {
  canEdit: T.bool.isRequired,
  dropzone: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  addCriterion: T.func.isRequired,
  updateCriterion: T.func.isRequired,
  removeCriterion: T.func.isRequired
}

const ConnectedDropzoneForm = connect(
  state => ({
    canEdit: resourceSelect.editable(state),
    dropzone: formSelect.data(formSelect.form(state, 'dropzoneForm')),
    errors: formSelect.errors(formSelect.form(state, 'dropzoneForm')),
    validating: formSelect.validating(formSelect.form(state, 'dropzoneForm'))
  }),
  dispatch => ({
    addCriterion(dropzoneId) {
      dispatch(actions.addCriterion(dropzoneId))
    },
    updateCriterion(id, property, value) {
      dispatch(actions.updateCriterion(id, property, value))
    },
    removeCriterion(id) {
      dispatch(actions.removeCriterion(id))
    }
  })
)(DropzoneForm)

export {
  ConnectedDropzoneForm as DropzoneForm
}
