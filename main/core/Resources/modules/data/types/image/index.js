import {t} from '#/main/core/translation'

import {Image} from '#/main/core/layout/form/components/field/image.jsx'

const IMAGE_TYPE = 'image'

// todo implement

const imageDefinition = {
  meta: {
    type: IMAGE_TYPE,
    creatable: true,
    icon: 'fa fa-fw fa fa-file-o',
    label: t('file'),
    description: t('image_desc')
  },
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => typeof value === 'string',
  components: {
    form: Image
  }
}

export {
  IMAGE_TYPE ,
  imageDefinition
}
