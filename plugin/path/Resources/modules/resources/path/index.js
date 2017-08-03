import React from 'react'
import {
  hashHistory as history,
  HashRouter as Router
} from 'react-router-dom'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'
import {reducer as pathReducer} from '#/plugin/path/resources/path/reducer'

import {Path} from '#/plugin/path/resources/path/components/path.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.path-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  () => React.createElement(Router, {
    history: history
  }, React.createElement(Path)),

  // app store configuration
  {
    // app reducers
    path: pathReducer,

    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer,
    resourceNode: resourceReducer
  }
)
