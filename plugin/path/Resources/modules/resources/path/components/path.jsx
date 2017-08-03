import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import {Resource as ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {Player} from '#/plugin/path/resources/path/player/components/player.jsx'
import {Editor} from '#/plugin/path/resources/path/editor/components/editor.jsx'

const Path = props =>
  <ResourceContainer
    subtitle={'/edit' === props.location.pathname ? 'edit' : 'play'}
    edit="#/edit"
    editMode={'/edit' === props.location.pathname}
    save={{
      disabled: !props.saveEnabled,
      action: () => true
    }}
    customActions={[
      {
        icon: 'fa fa-fw fa-home',
        label: 'Play path',
        action: '#/'
      },
      {
        icon: 'fa fa-fw fa-list',
        label: 'Manage results',
        action: '#/'
      }
    ]}
  >
    <Switch>
      <Route path="/"     component={Player} exact={true} />
      <Route path="/edit" component={Editor} />
    </Switch>
  </ResourceContainer>

Path.propTypes = {
  location: T.shape({
    pathname: T.string.isRequired
  }).isRequired
}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

const ConnectedPath = withRouter(connect(mapStateToProps, mapDispatchToProps)(Path))

export {
  ConnectedPath as Path
}
