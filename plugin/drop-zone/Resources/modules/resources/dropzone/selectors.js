import {createSelector} from 'reselect'

import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'

const user = state => state.user

const userEvaluation = state => state.userEvaluation

const dropzone = state => state.dropzone
const dropzoneId = createSelector(
  [dropzone],
  (dropzone) => dropzone.id
)

const myDrop = state => state.myDrop
const myDrops = state => state.myDrops

const myDropId = createSelector(
  [myDrop],
  (myDrop) => myDrop && myDrop.id ? myDrop.id : null
)

const peerDrop = state => state.peerDrop

const isDropEnabled = createSelector(
  [dropzone],
  (dropzone) => {
    const currentDate = new Date()

    return (
      dropzone.parameters.manualPlanning &&
      [constants.STATE_ALLOW_DROP, constants.STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(dropzone.parameters.manualState) > -1
    ) ||
    (
      !dropzone.parameters.manualPlanning &&
      currentDate >= new Date(dropzone.parameters.dropStartDate) &&
      currentDate <= new Date(dropzone.parameters.dropEndDate)
    )
  }
)

const isPeerReviewEnabled = createSelector(
  [dropzone],
  (dropzone) => {
    const currentDate = new Date()

    return dropzone.parameters.peerReview && (
      (
        dropzone.parameters.manualPlanning &&
        [constants.STATE_PEER_REVIEW, constants.STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(dropzone.parameters.manualState) > -1
      ) ||
      (
        !dropzone.parameters.manualPlanning &&
        currentDate >= new Date(dropzone.parameters.reviewStartDate) &&
        currentDate <= new Date(dropzone.parameters.reviewEndDate)
      )
    )
  }
)

const currentState = createSelector(
  [dropzone],
  (dropzone) => {
    let currentState = constants.STATE_NOT_STARTED

    if (dropzone.parameters.manualPlanning) {
      currentState = dropzone.parameters.manualState
    } else {
      const currentDate = new Date()
      const dropStartDate = new Date(dropzone.parameters.dropStartDate)
      const dropEndDate = new Date(dropzone.parameters.dropEndDate)
      const reviewStartDate = new Date(dropzone.parameters.reviewStartDate)
      const reviewEndDate = new Date(dropzone.parameters.reviewEndDate)

      if (currentDate >= dropStartDate) {
        if (currentDate > dropEndDate && currentDate > reviewEndDate) {
          currentState = constants.STATE_FINISHED
        } else if (currentDate > dropEndDate && currentDate < reviewStartDate) {
          currentState = constants.STATE_WAITING_FOR_PEER_REVIEW
        } else {
          if (dropStartDate <= currentDate && currentDate <= dropEndDate) {
            currentState += constants.STATE_ALLOW_DROP
          }
          if (reviewStartDate <= currentDate && currentDate <= reviewEndDate) {
            currentState += constants.STATE_PEER_REVIEW
          }
        }
      }
    }

    return currentState
  }
)

const drops = state => state.drops
const currentDrop = state => state.currentDrop
const correctorDrop = state => state.correctorDrop
const corrections = state => state.corrections
const correctionForm = state => state.correctionForm
const nbCorrections = state => state.nbCorrections
const tools = state => state.tools.data
const teams = state => state.teams
const errorMessage = state => state.errorMessage

const myTeamId = createSelector(
  [myDrop],
  (myDrop) => myDrop && myDrop.teamId ? myDrop.teamId : null
)

export const select = {
  user,
  userEvaluation,
  dropzone,
  dropzoneId,
  myDrop,
  myDrops,
  myDropId,
  peerDrop,
  isDropEnabled,
  isPeerReviewEnabled,
  currentState,
  drops,
  currentDrop,
  correctorDrop,
  corrections,
  correctionForm,
  nbCorrections,
  tools,
  teams,
  myTeamId,
  errorMessage
}
