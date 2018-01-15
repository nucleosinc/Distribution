import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'

import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {notBlank} from '#/main/core/validation'

import {validate} from '#/plugin/drop-zone/resources/dropzone/editor/validator'
import {generateId} from '#/plugin/drop-zone/resources/dropzone/utils'
import {
  DROPZONE_LOAD,
  DROPZONE_FORM_LOAD,
  DROPZONE_FORM_RESET,
  DROPZONE_FORM_SUBMIT,
  DROPZONE_FORM_VALIDATE,
  DROPZONE_CRITERION_ADD,
  DROPZONE_CRITERION_UPDATE,
  DROPZONE_CRITERION_REMOVE
} from '#/plugin/drop-zone/resources/dropzone/editor/actions'

const dropzoneReducer = makeReducer({}, {
  [DROPZONE_LOAD]: (state, action) => {
    return action.dropzone
  }
})

const dropzoneFormDataReducer = makeReducer({}, {
  [DROPZONE_FORM_LOAD]: (state, action) => action.dropzone,
  [DROPZONE_FORM_RESET]: () => {return {}},
  [DROPZONE_CRITERION_ADD]: (state, action) => {
    const criteria = cloneDeep(state.criteria)
    criteria.push({
      id: generateId(),
      instruction: null,
      dropzone: action.dropzoneId
    })

    return Object.assign({}, state, {criteria: criteria})
  },
  [DROPZONE_CRITERION_UPDATE]: (state, action) => {
    const criteria = cloneDeep(state.criteria)
    const index = criteria.findIndex(c => c.id === action.id)
    const criterion = Object.assign({}, criteria[index], {[action.property]: action.value})
    criteria[index] = criterion

    return Object.assign({}, state, {criteria: criteria})
  },
  [DROPZONE_CRITERION_REMOVE]: (state, action) => {
    const criteria = cloneDeep(state.criteria)
    const index = criteria.findIndex(c => c.id === action.id)

    if (index > -1) {
      criteria.splice(index, 1)
    }

    return Object.assign({}, state, {criteria: criteria})
  }
})

const pendingChangesReducer = makeReducer(false, {
  [DROPZONE_FORM_RESET]: () => false,
  [DROPZONE_CRITERION_ADD]: () => true,
  [DROPZONE_CRITERION_UPDATE]: () => true,
  [DROPZONE_CRITERION_REMOVE]: () => true
})

const validatingReducer = makeReducer(false, {
  [DROPZONE_FORM_RESET]: () => false,
  [DROPZONE_CRITERION_ADD]: () => false,
  [DROPZONE_CRITERION_UPDATE]: () => false,
  [DROPZONE_CRITERION_REMOVE]: () => false,
  [DROPZONE_FORM_SUBMIT]: () => true
})

const errorsReducer = makeReducer({}, {
  [DROPZONE_FORM_RESET]: () => {return {}},
  [DROPZONE_FORM_VALIDATE]: (state, action) => validate(action.dropzone),
  [DROPZONE_CRITERION_UPDATE]: (state, action) => {
    const errors = cloneDeep(state)
    const error = notBlank(action.value)

    if (error) {
      set(errors, `criteria.${action.id}`, error)
    } else if (errors['criteria'] && errors['criteria'][action.id]) {
      delete errors['criteria'][action.id]

      if (isEmpty(errors['criteria'])) {
        delete errors['criteria']
      }
    }

    return errors
  },
  [DROPZONE_CRITERION_REMOVE]: (state, action) => {
    const errors = cloneDeep(state)

    if (errors['criteria'] && errors['criteria'][action.id]) {
      delete errors['criteria'][action.id]

      if (isEmpty(errors['criteria'])) {
        delete errors['criteria']
      }
    }

    return errors
  }
})

const dropzoneFormReducer = makeFormReducer(
  'dropzoneForm',
  {},
  {
    data: dropzoneFormDataReducer,
    pendingChanges: pendingChangesReducer,
    validating: validatingReducer,
    errors: errorsReducer
  }
)

const reducer = {
  dropzone: dropzoneReducer,
  dropzoneForm: dropzoneFormReducer
}

export {
  reducer
}
