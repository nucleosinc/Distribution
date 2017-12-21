import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DATA_PICKER} from '#/main/core/data/list/modals'
import {makeSaveAction} from '#/main/core/data/form/containers/form-save.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'

import {actions} from '#/main/core/administration/workspace/workspace/actions'

import {OrganizationList} from '#/main/core/administration/user/organization/components/organization-list.jsx'

const WorkspaceSaveAction = makeSaveAction('workspaces.current', formData => ({
  create: ['apiv2_workspace_create'],
  update: ['apiv2_workspace_update', {id: formData.id}]
}))(PageAction)

const WorkspaceActions = () =>
  <PageActions>
    <WorkspaceSaveAction />

    <PageAction
      id="workspace-list"
      icon="fa fa-list"
      title={t('back_to_list')}
      action="#/workspaces"
    />
  </PageActions>

const WorkspaceForm = props =>
  <FormContainer
    level={3}
    name="workspaces.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: t('name'),
            required: true
          }
        ]
      }
    ]}
  >
    <FormSections
      level={3}
    >
      <FormSection
        id="workspace-organizations"
        icon="fa fa-fw fa-building"
        title={t('organizations')}
        disabled={props.new}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_organizations'),
            action: () => props.pickOrganizations(props.workspace.id)
          }
        ]}
      >
        <DataListContainer
          name="workspace.current.organizations"
          open={OrganizationList.open}
          fetch={{
            url: ['apiv2_workspace_list_organizations', {id: props.workspace.id}],
            autoload: props.workspace.id && !props.new
          }}
          delete={{
            url: ['apiv2_workspace_remove_organizations', {id: props.workspace.id}]
          }}
          definition={OrganizationList.definition}
          card={OrganizationList.card}
        />
      </FormSection>
    </FormSections>
  </FormContainer>

WorkspaceForm.propTypes = {
  new: T.bool.isRequired,
  workspace: T.shape({
    id: T.string
  }).isRequired,
  pickOrganizations: T.func.isRequired
}

const Workspace = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'workspaces.current')),
    workspace: formSelect.data(formSelect.form(state, 'workspaces.current'))
  }),
  dispatch =>({
    pickOrganizations(workspaceId) {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-buildings',
        title: t('add_organizations'),
        confirmText: t('add'),
        name: 'organizations.picker',
        definition: OrganizationList.definition,
        card: OrganizationList.card,
        fetch: {
          url: ['apiv2_organization_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addOrganizations(workspaceId, selected))
      }))
    }
  })
)(WorkspaceForm)

export {
  WorkspaceActions,
  Workspace
}
