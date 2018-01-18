import React from 'react'
import {shallow, mount} from 'enzyme'

import {spyConsole, renew, ensure, mockGlobals} from '#/main/core/scaffolding/tests'
import {ResourcePicker} from './resource-picker.jsx'

describe('<ResourcePicker/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(ResourcePicker, 'ResourcePicker')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(
      React.createElement(ResourcePicker)
    )

    ensure.missingProps('ResourcePicker', [
      'onSelect'
    ])
  })

  it('has typed props', () => {
    shallow(
      React.createElement(ResourcePicker, {
        onSelect: '',
        typeWhiteList: {},
        multiple: 'boolean'
      })
    )

    ensure.invalidProps('ResourcePicker', [
      'onSelect',
      'multiple',
      'typeWhiteList'
    ])
  })

  it('renders a link button', () => {
    window.Claroline = {
      ResourceManager: {
        picker: () => {},
        hasPicker: () => {},
        createPicker: () => {}
      }
    }

    const picker = mount(
      React.createElement(ResourcePicker, {
        onSelect: () => true,
        typeWhiteList: ['files'],
        multiple: false
      })
    )

    ensure.propTypesOk()
    ensure.equal(picker.find('a').length, 1, 'has button link')

    const btnLink = picker.find('a')
    btnLink.simulate('click')
  })
})
