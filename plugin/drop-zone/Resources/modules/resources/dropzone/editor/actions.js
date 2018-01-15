import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {generateUrl} from '#/main/core/api/router'
import {navigate} from '#/main/core/router'
import {API_REQUEST} from '#/main/core/api/actions'

import {isValid} from '#/plugin/drop-zone/resources/dropzone/editor/validator'

export const DROPZONE_LOAD = 'DROPZONE_LOAD'
export const DROPZONE_FORM_LOAD = 'DROPZONE_FORM_LOAD'
export const DROPZONE_FORM_RESET = 'DROPZONE_FORM_RESET'
export const DROPZONE_FORM_SUBMIT = 'DROPZONE_FORM_SUBMIT'
export const DROPZONE_FORM_VALIDATE = 'DROPZONE_FORM_VALIDATE'
export const DROPZONE_CRITERION_ADD = 'DROPZONE_CRITERION_ADD'
export const DROPZONE_CRITERION_UPDATE = 'DROPZONE_CRITERION_UPDATE'
export const DROPZONE_CRITERION_REMOVE = 'DROPZONE_CRITERION_REMOVE'

export const actions = {}

actions.loadDropzone = makeActionCreator(DROPZONE_LOAD, 'dropzone')
actions.loadForm = makeActionCreator(DROPZONE_FORM_LOAD, 'dropzone')
actions.resetForm = makeActionCreator(DROPZONE_FORM_RESET)
actions.submitForm = makeActionCreator(DROPZONE_FORM_SUBMIT)
actions.validateForm = makeActionCreator(DROPZONE_FORM_VALIDATE, 'dropzone')
actions.addCriterion = makeActionCreator(DROPZONE_CRITERION_ADD, 'dropzoneId')
actions.updateCriterion = makeActionCreator(DROPZONE_CRITERION_UPDATE, 'id', 'property', 'value')
actions.removeCriterion = makeActionCreator(DROPZONE_CRITERION_REMOVE, 'id')

actions.saveDropzone = (dropzoneId, dropzone) => {
  return (dispatch) => {
    dispatch(actions.submitForm())
    dispatch(actions.validateForm(dropzone))

    if (isValid(dropzone)) {
      dispatch(actions.updateDropzone(dropzoneId, dropzone))
    }
  }
}

actions.updateDropzone = (dropzoneId, dropzone) => ({
  [API_REQUEST]: {
    url: generateUrl('claro_dropzone_update', {id: dropzoneId}),
    request: {
      method: 'PUT',
      body: JSON.stringify(dropzone)
    },
    success: (data, dispatch) => {
      dispatch(actions.loadDropzone(data))
      navigate('/')
    }
  }
})