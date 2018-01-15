import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'

import {reducer as editorReducer} from '#/plugin/drop-zone/resources/dropzone/editor/reducer'
import {reducer as playerReducer} from '#/plugin/drop-zone/resources/dropzone/player/reducer'
import {reducer as correctionReducer} from '#/plugin/drop-zone/resources/dropzone/correction/reducer'
import {reducer as configurationReducer} from '#/plugin/drop-zone/plugin/configuration/reducer'

const reducer = makeResourceReducer({}, {
  user: makeReducer({}, {}),
  dropzone: editorReducer.dropzone,
  dropzoneForm: editorReducer.dropzoneForm,
  myDrop: playerReducer.myDrop,
  peerDrop: playerReducer.peerDrop,
  nbCorrections: playerReducer.nbCorrections,
  drops: correctionReducer.drops,
  currentDrop: correctionReducer.currentDrop,
  correctorDrop: correctionReducer.correctorDrop,
  corrections: correctionReducer.corrections,
  tools: configurationReducer.tools,
  userEvaluation: makeReducer({}, {}),
  teams: makeReducer({}, {}),
  errorMessage: makeReducer({}, {})
})

export {
  reducer
}
