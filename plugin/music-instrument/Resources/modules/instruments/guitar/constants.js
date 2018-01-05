import {trans} from '#/main/core/translation'

// amplification
const AMPLIFICATION_TYPE_ACOUSTIC = 'acoustic'
const AMPLIFICATION_TYPE_ELECTRIC = 'electric'

const AMPLIFICATION_TYPES = {
  [AMPLIFICATION_TYPE_ACOUSTIC]: trans('amplification_acoustic', {}, 'resource'),
  [AMPLIFICATION_TYPE_ELECTRIC]: trans('amplification_electric', {}, 'resource')
}

// body
const BODY_TYPE_SOLID = 'solid'
const BODY_TYPE_HOLLOW = 'hollow'

const BODY_TYPES = {
  [BODY_TYPE_SOLID]:  trans('body_solid', {}, 'resource'),
  [BODY_TYPE_HOLLOW]: trans('body_hollow', {}, 'resource')
}

// headstock
const HEADSTOCK_TYPE_INLINE     = 'inline'
const HEADSTOCK_TYPE_TOP_BOTTOM = 'top-bottom'

const HEADSTOCK_TYPES = {
  [HEADSTOCK_TYPE_INLINE]:     trans('headstock_inline', {}, 'resource'),
  [HEADSTOCK_TYPE_TOP_BOTTOM]: trans('headstock_top_bottom', {}, 'resource')
}

// markers
const MARKER_TYPE_CIRCLE   = 'circle'
const MARKER_TYPE_SHARK    = 'shark'
const MARKER_TYPE_TRAPEZE  = 'trapeze'
const MARKER_TYPE_TRIANGLE = 'triangle'

const MARKER_TYPES = {
  [MARKER_TYPE_CIRCLE]:   trans('guitar_marker_circle', {}, 'resource'),
  [MARKER_TYPE_SHARK]:    trans('guitar_marker_shark', {}, 'resource'),
  [MARKER_TYPE_TRAPEZE]:  trans('guitar_marker_trapeze', {}, 'resource'),
  [MARKER_TYPE_TRIANGLE]: trans('guitar_marker_triangle', {}, 'resource')
}

export const constants = {
  // amplification
  AMPLIFICATION_TYPES,
  AMPLIFICATION_TYPE_ACOUSTIC,
  AMPLIFICATION_TYPE_ELECTRIC,
  // body
  BODY_TYPES,
  BODY_TYPE_SOLID,
  BODY_TYPE_HOLLOW,
  // headstock
  HEADSTOCK_TYPES,
  HEADSTOCK_TYPE_INLINE,
  HEADSTOCK_TYPE_TOP_BOTTOM,
  // markers
  MARKER_TYPES,
  MARKER_TYPE_CIRCLE,
  MARKER_TYPE_SHARK,
  MARKER_TYPE_TRAPEZE,
  MARKER_TYPE_TRIANGLE
}