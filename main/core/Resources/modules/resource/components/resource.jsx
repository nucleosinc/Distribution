import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {registerModals} from '#/main/core/layout/modal'
import {RoutedPage, PageHeader, PageContent} from '#/main/core/layout/page/components/page.jsx'
import {ResourceActions} from '#/main/core/resource/components/resource-actions.jsx'

import {MODAL_RESOURCE_PROPERTIES, EditPropertiesModal} from '#/main/core/resource/components/modal/edit-properties.jsx'
import {MODAL_RESOURCE_RIGHTS,     EditRightsModal}     from '#/main/core/resource/components/modal/edit-rights.jsx'

class Resource extends Component {
  constructor(props) {
    super(props)

    // register modals
    registerModals([
      [MODAL_RESOURCE_PROPERTIES, EditPropertiesModal],
      [MODAL_RESOURCE_RIGHTS, EditRightsModal]
    ])

    // open resource in fullscreen if configured
    this.state = {
      fullscreen: this.props.resourceNode.parameters.fullscreen
    }

    this.toggleFullscreen = this.toggleFullscreen.bind(this)
  }

  toggleFullscreen() {
    this.setState({fullscreen: !this.state.fullscreen})
  }

  render() {
    return (
      <RoutedPage
        className="resource-page"
        embedded={this.props.embedded}
        fullscreen={this.state.fullscreen}

        modal={this.props.modal}
        fadeModal={this.props.fadeModal}
        hideModal={this.props.hideModal}

        alerts={this.props.alerts}
        removeAlert={this.props.removeAlert}
      >
        <PageHeader
          className="resource-header"
          title={this.props.resourceNode.name}
        >
          <ResourceActions
            resourceNode={this.props.resourceNode}
            editor={this.props.editor}
            customActions={this.props.customActions}
            fullscreen={this.state.fullscreen}
            toggleFullscreen={this.toggleFullscreen}
            togglePublication={this.props.togglePublication}
            showModal={this.props.showModal}
            updateNode={this.props.updateNode}
          />
        </PageHeader>

        <PageContent>
          {this.props.children}
        </PageContent>
      </RoutedPage>
    )
  }
}

Resource.propTypes = {
  resourceNode: T.shape({
    name: T.string.isRequired,
    parameters: T.shape({
      fullscreen: T.bool.isRequired
    }).isRequired
  }).isRequired,
  customActions: T.array,

  /**
   * If provided, this permits to manage the resource editor in the header (aka. open, save actions).
   */
  editor: T.shape({
    icon: T.string,
    label: T.string,
    opened: T.bool,
    open: T.oneOfType([T.func, T.string]),
    path: T.string,
    save: T.shape({
      disabled: T.bool.isRequired,
      action: T.oneOfType([T.string, T.func]).isRequired
    }).isRequired
  }),

  togglePublication: T.func.isRequired,
  updateNode: T.func.isRequired,

  // todo : reuse Page propTypes
  embedded: T.bool,
  children: T.node.isRequired,

  // modal management
  modal: T.shape({
    type: T.string,
    fading: T.bool.isRequired,
    props: T.object.isRequired
  }),
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired,

  // alerts management
  alerts: T.array,
  removeAlert: T.func
}

Resource.defaultProps = {
  embedded: false
}

export {Resource}
