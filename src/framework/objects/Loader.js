import _ from 'lodash'
import BABYLON from 'experiment-babylon-js'


import { hasConstructor, Number, debugError } from '../utilities'

class Loader extends BABYLON.Rectangle2D {
  constructor(options) {
    const baseOptions = {
      id: 'loader',
      parent: null,
      roundRadius: 0,
      size: new BABYLON.Size(20, 20),
      borderThickness: 1,
      border: BABYLON.Canvas2D.GetSolidColorBrush(new BABYLON.Color4(1, 1, 1, 1)),
      fill: null,
      marginAlignment: 'h: center, v: center',
      zOrder: 0.01,
      value: 0,
    }

    options = _.extend(baseOptions, options)
    super(options)

    let borderThickness = options.borderThickness
    if (options.marginAlignment === null) {
      borderThickness = options.borderThickness + 2
    }

    // create masks
    const fill = BABYLON.Canvas2D.GetSolidColorBrush(new BABYLON.Color4(0, 0, 0, 1))
    const masks = {}
    masks.bottom = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderMaskBottom',
      marginAlignment: 'h: center, v: center',
      size: new BABYLON.Size(options.size.width, borderThickness),
      fill,
      zOrder: 0.001,
    })
    masks.right = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderMaskRight',
      marginAlignment: 'h: center, v: center',
      size: new BABYLON.Size(borderThickness, options.size.height),
      fill,
      zOrder: 0.002,
    })
    masks.top = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderMaskTop',
      marginAlignment: 'h: center, v: center',
      size: new BABYLON.Size(options.size.width, borderThickness),
      fill,
      zOrder: 0.003,
    })
    masks.left = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderMaskLeft',
      marginAlignment: 'h: center, v: center',
      size: new BABYLON.Size(borderThickness, options.size.height),
      fill,
      zOrder: 0.004,
    })

    this.masks = masks

    this._value = options.value
    this.updateMasks()
  }

  updateMasks() {
    const value = this.value
    if (value < 25) {
      this.masks.bottom.width = (25 - value) * (this.size.width / 25)

      const offset = this.size.width - this.masks.bottom.width // (12.5 - value) * (this.size.width / (2 * 12.5))
      this.masks.bottom.margin.rightPixels = 0
      this.masks.bottom.margin.leftPixels = offset / 2
      this.masks.bottom.margin.topPixels = (this.size.height / 2) - (this.borderThickness / 2)
      this.masks.bottom.margin.bottomPixels = 0
      this.masks.bottom.levelVisible = true
    } else {
      this.masks.bottom.levelVisible = false
    }

    if (value < 50) {
      const height = (value >= 25) ? (50 - value) * (this.size.height / 25) : this.size.height
      this.masks.right.height = height
      const offset = this.size.height - height

      this.masks.right.margin.rightPixels = 0
      this.masks.right.margin.leftPixels = (this.size.width / 2) - (this.borderThickness / 2)
      this.masks.right.margin.topPixels = 0
      this.masks.right.margin.bottomPixels = offset / 2

      this.masks.right.levelVisible = true
    } else {
      this.masks.right.levelVisible = false
    }

    if (value < 75) {
      const width = (value >= 50) ? (75 - value) * (this.size.width / 25) : this.size.width

      this.masks.top.width = width
      const offset = this.size.width - width + (this.borderThickness)

      this.masks.top.margin.rightPixels = offset / 2
      this.masks.top.margin.leftPixels = 0
      this.masks.top.margin.topPixels = 0
      this.masks.top.margin.bottomPixels = (this.size.height / 2) - (this.borderThickness / 2)

      this.masks.top.levelVisible = true
    } else {
      this.masks.top.levelVisible = false
    }

    if (value < 100) {
      const height = (value >= 75) ? (100 - value) * (this.size.height / 25) : this.size.height

      this.masks.left.height = height
      const offset = this.size.height - height + (this.borderThickness)

      this.masks.left.margin.rightPixels = (this.size.width / 2) - (this.borderThickness / 2)
      this.masks.left.margin.leftPixels = 0
      this.masks.left.margin.topPixels = offset / 2
      this.masks.left.margin.bottomPixels = 0

      this.masks.left.levelVisible = true
    } else {
      this.masks.left.levelVisible = false
    }
  }

  set value(val = 0) {
    if (hasConstructor(Number, val)) {
      val = val.boundTo(0, 100)
      this._value = val
      this.updateMasks()
    } else {
      debugError('Loader.value: invalid value')
    }
  }

  get value() {
    return this._value
  }
}

export default Loader
