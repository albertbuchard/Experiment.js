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
      type: 'multiSequencial',
      centered: true,
    }

    options = _.extend(baseOptions, options)
    super(options)
    this.options = options

    // let borderThickness = options.borderThickness
    // if (options.marginAlignment === null) {

    // }

    if (this.options.type === 'anticlock') {
      // create masks
      const borderThickness = options.borderThickness + 2
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
    } else {
      this.borderThickness = 0
      this.fill = null
      this.drawRectangles()
    }

    this._value = options.value
    this.lastUpdatedValue = this._value
    this.update()
  }

  update() {
    if (this.options.type === 'anticlock') {
      this.updateMasks()
    } else {
      this.updateRectangles()
    }
  }

  updateRectangles() {
    if (this.options.type === 'multi') {
      if (this.value < this.lastUpdatedValue) { // TODO weird bug due to canvas2D again... cannot reduce the size of a Rectangle2D...
        this.drawRectangles()
      }
      this.lastUpdatedValue = this.value

      const fullWeight = Math.floor(this.value / 4)
      const residual = this.value % 4

      const residualBottom = residual > 0 ? 1 : 0
      const residualTop = residual > 2 ? 1 : 0
      const residualLeft = residual > 1 ? 1 : 0

      this.rectangles.bottom.width = (fullWeight + residualBottom) * (this.size.width / 25)
      this.rectangles.left.height = (fullWeight + residualLeft) * (this.size.height / 25)
      this.rectangles.right.height = (fullWeight) * (this.size.height / 25)
      this.rectangles.top.width = (fullWeight + residualTop) * (this.size.width / 25)
    } else if (this.options.type === 'multiSequencial') {
      if (this.value < this.lastUpdatedValue) { // TODO weird bug due to canvas2D again... cannot reduce the size of a Rectangle2D...
        this.drawRectangles()
      }
      this.lastUpdatedValue = this.value

      this.rectangles.bottom.width = this.value.boundTo(0, 25) * (this.size.width / 25)
      this.rectangles.left.height = (this.value - 25).boundTo(0, 25) * (this.size.height / 25)
      this.rectangles.right.height = (this.value - 50).boundTo(0, 25) * (this.size.height / 25)
      this.rectangles.top.width = (this.value - 75).boundTo(0, 25) * (this.size.width / 25)
    }
  }

  drawRectangles() {
    if (hasConstructor(Object, this.rectangles) && this.rectangles.hasOwnProperty('bottom') && hasConstructor(BABYLON.Rectangle2D, this.rectangles.bottom)) {
      for (const rectangle in this.rectangles) {
        if (this.rectangles.hasOwnProperty(rectangle)) {
          if (typeof this.rectangles[rectangle].dispose === 'function') { this.rectangles[rectangle].dispose() }
        }
      }
    }
    this.rectangles = {}
    // create masks
    const borderThickness = this.options.borderThickness
    const fill = this.options.border
    this.rectangles.bottom = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderRectangleBottom',
      marginAlignment: this.options.centered ? 'h: center, v: center' : 'h: left, v: bottom',
      size: new BABYLON.Size(0, borderThickness),
      fill,
      zOrder: 0.001,
    })
    this.rectangles.right = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderRectangleRight',
      marginAlignment: this.options.centered ? 'h: center, v: center' : 'h: right, v: top',
      size: new BABYLON.Size(borderThickness, 0),
      fill,
      zOrder: 0.002,
    })
    this.rectangles.top = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderRectangleTop',
      marginAlignment: this.options.centered ? 'h: center, v: center' : 'h: right, v: top',
      size: new BABYLON.Size(0, borderThickness),
      fill,
      zOrder: 0.003,
    })
    this.rectangles.left = new BABYLON.Rectangle2D({
      parent: this,
      id: 'loaderRectangleLeft',
      marginAlignment: this.options.centered ? 'h: center, v: center' : 'h: left, v: bottom',
      size: new BABYLON.Size(borderThickness, 0),
      fill,
      zOrder: 0.004,
    })

    if (this.options.centered) {
      // const baseMargin = { rightPixels: 0, leftPixels: 0, topPixels: 0, bottomPixels: 0}
      _.extend(this.rectangles.left.margin, { rightPixels: (this.size.width / 2) - (borderThickness / 2) })
      _.extend(this.rectangles.right.margin, { leftPixels: (this.size.width / 2) - (borderThickness / 2) })
      _.extend(this.rectangles.top.margin, { bottomPixels: (this.size.height / 2) - (borderThickness / 2) })
      _.extend(this.rectangles.bottom.margin, { topPixels: (this.size.height / 2) - (borderThickness / 2) })
    }
  }

  updateMasks() {
    if (this.options.type === 'anticlock') {
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
  }

  set value(val = 0) {
    if (hasConstructor(Number, val)) {
      val = val.boundTo(0, 100)
      this._value = val
      this.update()
    } else {
      debugError('Loader.value: invalid value')
    }
  }

  get value() {
    return this._value
  }
}

export default Loader
