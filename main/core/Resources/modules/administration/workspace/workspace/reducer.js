import {combineReducers, makeReducer} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {FORM_RESET} from '#/main/core/data/form/actions'

/*
import {
  WORKSPACE_ADD_MANAGER,
  WORKSPACE_REMOVE_MANAGER
} from './actions'

//where do I put that one ?
const workspaceReducer = makeReducer([], {
  [WORKSPACE_ADD_MANAGER]: (state, action) => {
    state = cloneDeep(state)
    const workspace = state.find(workspace => workspace.id === action.workspace.id)
    workspace.managers.push(action.user)

    return state
  },

  [WORKSPACE_REMOVE_MANAGER]: (state, action) => {
    state = cloneDeep(state)
    const workspace = state.find(workspace => workspace.id === action.workspace.id)
    workspace.managers.splice(workspace.managers.findIndex(manager => manager.id === action.user.id), 1)

    return state
  }
})
*/

const workspacesReducer = combineReducers({
  picker: makeListReducer('workspaces.picker'),
  list: makeListReducer('workspaces.list'),
  current: makeFormReducer('workspaces.current', {}, {
    organizations: makeListReducer('workspaces.current.organizations', {}, {
      invalidated: makeReducer(false, {
        [FORM_RESET+'/workspaces.current']: () => true // todo : find better
      })
    })
  })
})

const organizationReducer = combineReducers({
  picker: makeListReducer('organizations.picker')
})

const reducer = makePageReducer({}, {
  workspaces: workspacesReducer,
  organizations: organizationReducer
})

export {
  reducer
}
