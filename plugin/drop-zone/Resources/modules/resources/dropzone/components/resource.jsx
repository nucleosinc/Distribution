import React from 'react'
import isEmpty from 'lodash/isEmpty'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, trans} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/layout/resource/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Router, Routes} from '#/main/core/router/components/router.jsx'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {select} from '#/plugin/drop-zone/resources/dropzone/selectors.js'
import {actions as editorActions} from '#/plugin/drop-zone/resources/dropzone/editor/actions.js'
import {actions as playerActions} from '#/plugin/drop-zone/resources/dropzone/player/actions.js'
import {actions as correctionActions} from '#/plugin/drop-zone/resources/dropzone/correction/actions.js'
import {Menu} from '#/plugin/drop-zone/resources/dropzone/components/menu.jsx'
import {DropzoneForm} from '#/plugin/drop-zone/resources/dropzone/editor/components/dropzone-form.jsx'
import {MyDrop} from '#/plugin/drop-zone/resources/dropzone/player/components/my-drop.jsx'
import {Drops} from '#/plugin/drop-zone/resources/dropzone/correction/components/drops.jsx'
import {Correctors} from '#/plugin/drop-zone/resources/dropzone/correction/components/correctors.jsx'
import {Corrector} from '#/plugin/drop-zone/resources/dropzone/correction/components/corrector.jsx'
import {Drop} from '#/plugin/drop-zone/resources/dropzone/correction/components/drop.jsx'
import {PeerDrop} from '#/plugin/drop-zone/resources/dropzone/player/components/peer-drop.jsx'

const DropzoneResource = props =>
  <ResourceContainer
    editor={{
      opened: !isEmpty(props.dropzoneFormData),
      open: '#/edit',
      label: t('configure'),
      save: {
        disabled: !props.formPendingChanges || (props.formValidating && !isEmpty(props.formErrors)),
        action: () => {
          props.saveDropzone(props.dropzone.id, props.dropzoneFormData)
        }
      }
    }}
    customActions={customActions(props)}
  >
    <Router>
      <Routes
        routes={[
          {
            path: '/',
            exact: true,
            component: Menu
          }, {
            path: '/edit',
            component: DropzoneForm,
            onEnter: () => props.loadForm(props.dropzone),
            onLeave: props.resetForm
          }, {
            path: '/my/drop',
            component: MyDrop
          }, {
            path: '/drops',
            component: Drops
          }, {
            path: '/drop/:id',
            component: Drop,
            onEnter: (params) => props.fetchDrop(params.id, 'current'),
            onLeave: () => props.resetCurrentDrop()
          }, {
            path: '/peer/drop',
            component: PeerDrop,
            onEnter: () => props.fetchPeerDrop()
          }, {
            path: '/correctors',
            component: Correctors,
            onEnter: () => {
              props.fetchDrops(props.dropzone.id)
              props.fetchCorrections(props.dropzone.id)
            }
          }, {
            path: '/corrector/:id',
            component: Corrector,
            onEnter: (params) => {
              props.fetchDrop(params.id, 'corrector')
              props.fetchCorrections(props.dropzone.id)
            },
            onLeave: () => props.resetCorrectorDrop()
          }
        ]}
      />
    </Router>
  </ResourceContainer>

DropzoneResource.propTypes = {
  canEdit: T.bool.isRequired,
  dropzone: T.object.isRequired,
  dropzoneFormData: T.object,
  formPendingChanges: T.bool.isRequired,
  formValidating: T.bool.isRequired,
  formErrors: T.object,
  myDrop: T.object,

  loadForm: T.func.isRequired,
  resetForm: T.func.isRequired,
  saveDropzone: T.func.isRequired,
  fetchDrops: T.func.isRequired,
  fetchDrop: T.func.isRequired,
  resetCurrentDrop: T.func.isRequired,
  fetchCorrections: T.func.isRequired,
  resetCorrectorDrop: T.func.isRequired,
  fetchPeerDrop: T.func.isRequired
}

function customActions(props) {
  const actions = []

  actions.push({
    icon: 'fa fa-fw fa-home',
    label: t('home'),
    action: '#/'
  })

  if (props.myDrop) {
    actions.push({
      icon: 'fa fa-fw fa-download',
      label: trans('my_drop', {}, 'dropzone'),
      action: '#/my/drop'
    })
  }

  if (props.canEdit) {
    actions.push({
      icon: 'fa fa-fw fa-check-square-o',
      label: trans('corrections', {}, 'dropzone'),
      action: '#/drops'
    })
  }

  if (props.canEdit && props.dropzone.parameters.peerReview) {
    actions.push({
      icon: 'fa fa-fw fa-users',
      label: trans('correctors', {}, 'dropzone'),
      action: '#/correctors'
    })
  }

  return actions
}

function mapStateToProps(state) {
  return {
    canEdit: resourceSelect.editable(state),
    dropzone: state.dropzone,
    dropzoneFormData: formSelect.data(formSelect.form(state, 'dropzoneForm')),
    formPendingChanges: formSelect.pendingChanges(formSelect.form(state, 'dropzoneForm')),
    formValidating: formSelect.validating(formSelect.form(state, 'dropzoneForm')),
    formErrors: formSelect.errors(formSelect.form(state, 'dropzoneForm')),
    myDrop: select.myDrop(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadForm: (dropzone) => dispatch(editorActions.loadForm(dropzone)),
    resetForm: () => dispatch(editorActions.resetForm()),
    saveDropzone: (dropzoneId, data) => dispatch(editorActions.saveDropzone(dropzoneId, data)),
    fetchDrops: (dropzoneId) => dispatch(correctionActions.fetchDrops(dropzoneId)),
    fetchDrop: (dropId, type) => dispatch(correctionActions.fetchDrop(dropId, type)),
    resetCurrentDrop: () => dispatch(correctionActions.resetCurrentDrop()),
    fetchCorrections: (dropzoneId) => dispatch(correctionActions.fetchCorrections(dropzoneId)),
    resetCorrectorDrop: () => dispatch(correctionActions.resetCorrectorDrop()),
    fetchPeerDrop: () => dispatch(playerActions.fetchPeerDrop())
  }
}

const ConnectedDropzoneResource = connect(mapStateToProps, mapDispatchToProps)(DropzoneResource)

export {
  ConnectedDropzoneResource as DropzoneResource
}
