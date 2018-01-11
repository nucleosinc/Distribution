import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
//this is not pretty
import {connect} from 'react-redux'
import {actions} from '#/main/core/data/form/actions.js'
import {FileThumbnail} from '#/main/core/layout/form/components/field/file-thumbnail.jsx'
import has from 'lodash/has'

class Image extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: props.value || {}
    }
  }

  isImage(mimeType) {
    return mimeType.split('/')[0] === 'image'
  }

  onUpload(data) {
    this.props.onChange(data)
    this.setState({file: data})
  }

  onDelete(data) {
    this.props.onDelete(data)
    this.setState({file: data})
  }

  render() {
    return (
      <fieldset>
        <input
          id={this.props.controlId}
          type="file"
          className="form-control"
          accept="image"
          ref={input => this.input = input}
          onChange={() => {
            if (this.input.files[0]) {
              const file = this.input.files[0]
              //this.props.value = 'publicFile'
              if (this.props.autoUpload) {
                this.props.uploadFile(file, this.props.uploadUrl, this.onUpload.bind(this))
              }
            }}
          }
        />
        {has(this.state, 'file.id') &&
          <div className="file-thumbnail">
            <FileThumbnail
              data={this.state.file}
              type="image"
              canEdit={false}
              canExpand={false}
              canDownload={false}
              canDelete={true}
              handleDelete={() => this.props.deleteFile(
                this.state.file.id,
                this.onDelete.bind(this)
              )}
            />
          </div>
        }
      </fieldset>
    )
  }
}

Image.propTypes = {
  controlId: T.string.isRequired,
  value: T.object,
  disabled: T.bool.isRequired,
  autoUpload: T.bool.isRequired,
  onChange: T.func.isRequired,
  onDelete: T.func,
  deleteFile: T.func.isRequired,
  uploadUrl: T.array.isRequired,
  uploadFile: T.func.isRequired
}

Image.defaultProps = {
  disabled: false,
  autoUpload: true,
  onChange: () => {},
  onDelete: () => {},
  uploadUrl: ['apiv2_file_upload']
}

//this is not pretty
const ConnectedImage = connect(
  () => ({}),
  dispatch => ({
    uploadFile(file, url, callback) {
      dispatch(actions.uploadFile(file, url, callback))
    },
    deleteFile(file, url, callback) {
      dispatch(actions.deleteFile(file, url, callback))
    }
  })
)(Image)

export {
  ConnectedImage as Image
}
