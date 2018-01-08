import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {generateUrl} from '#/main/core/api/router'

import {actions as listActions} from '#/main/core/data/list/actions'
import {getDataQueryString} from '#/main/core/data/list/utils'
import {actions as formActions} from '#/main/core/data/form/actions'

import {Workspace as WorkspaceTypes} from '#/main/core/administration/workspace/workspace/prop-types'

import {API_REQUEST} from '#/main/core/api/actions'

export const WORKSPACE_ADD_MANAGER = 'WORKSPACE_ADD_MANAGER'
export const WORKSPACE_REMOVE_MANAGER = 'WORKSPACE_REMOVE_MANAGER'

export const actions = {}

actions.workspaceAddManager = makeActionCreator(WORKSPACE_ADD_MANAGER, 'workspace', 'user')
actions.workspaceRemoveManager =  makeActionCreator(WORKSPACE_REMOVE_MANAGER, 'workspace', 'user')

actions.open = (formName, id = null) => (dispatch) => {
  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_workspace_get', {id}],
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, WorkspaceTypes.defaultProps, true))
  }
}

actions.copyWorkspaces = (workspaces, isModel = 0) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_workspace_copy_bulk') + getDataQueryString(workspaces) + '&model=' + isModel,
    request: {
      method: 'GET'
    },
    success: (data, dispatch) => dispatch(listActions.invalidateData('workspaces.list'))
  }
})

actions.addManager = (workspace, user) => ({
  [API_REQUEST]: {
    request: {
      url: generateUrl('apiv2_user_add_roles', {id: user.id}) + getDataQueryString([getManagerRole(workspace)]),
      method: 'PATCH'
    },
    success: (data, dispatch) => dispatch(actions.workspaceAddManager(workspace, user))
  }
})

actions.removeManager = (workspace, user) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_user_remove_roles', {id: user.id}) + getDataQueryString([getManagerRole(workspace)]),
    request: {
      method: 'GET'
    },
    success: (data, dispatch) => dispatch(actions.workspaceRemoveManager(workspace, user))
  }
})

actions.addOrganizations = (id, organizations) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_workspace_add_organizations', {id: id}) +'?'+ organizations.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('workspaces.list'))
      dispatch(listActions.invalidateData('workspaces.current.organizations'))
    }
  }
})

const getManagerRole = (workspace) => workspace.roles.find(role => role.name.includes('ROLE_WS_MANAGER'))
