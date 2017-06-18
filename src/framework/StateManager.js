
/** @module StateManager */
import _ from 'lodash'
import BABYLON from 'experiment-babylon-js'
import Promise from 'bluebird'

import RessourceManager from './RessourceManager'
import State from './State'
import DataManager from './DataManager'
import EventData from './EventData'
import { mandatory,
  debuglog, debugWarn, debugError, mustBeDefined, mustHaveConstructor,
  spreadToObject, Deferred, delay,
  sizeToVec,
  scaleSize,
  hasConstructor,
} from './utilities'

/**
 * Manage lifecycle and variables through State objects.
 * Can dispatch information to the DataManager.
 * TODO check documentation style for es6 modules
 */
export default class StateManager {

  /**
   * @constructor
   * @param  {object} parent       Parent  object
   * @param  {DataManager} dataManager The task dataManager
   */
  constructor(parent = mandatory('parent'), dataManager = null) {
    this._parent = parent
    this.dataManager = dataManager

    /* --- Look for taskObject and setup RessourceManager accordingly --- */
    if (typeof parent.parentTaskObject !== 'undefined') {
      this._taskObject = parent.parentTaskObject
      this.R = this._taskObject.R
    } else {
      this.R = new RessourceManager()
    }

    const R = this.R

    /**
     * Array of Data
     * @type {Array}
     */
    this._eventHeap = []

    /**
     * Stores temporary time triggered event. The update() function checks at each frame if the event should be triggered.
     * @type {Array}
     */
    this._timeTriggerEvents = []

    //
    // Notes :
    // 1- should we handle events assynchronously... what is the best way to implement it ?
    // 2- event related to the awakening or ending of states should not go in the event heap, probably due to redraawing that might lag.
    //

    this.errorLog = []

    this.R.add({
      states: {
        idle: 'idle',
        pause: 'pause',
        active: 'active',
      },
      values: {
        timestampThreshold: 10e7,
      },
      events: {
        unfrozen: 'eventUnfrozen',
      },
    }, false)

    /*  Hash table of state objects */
    this.states = {
      idle: new State(this, R.get.states_idle),
      active: new State(this, R.get.states_active),
      pause: new State(this, R.get.states_pause),
    }

    this._currentStateKey = R.get.states_idle

    /**
     * Statekey of the current frozenState. If null, no state were frozen.
     * @type {string}
     */
    this.frozenState = null

    /**
     * Holds variables that needs to be passed from one state to the next.
     * @type {Object}
     */
    this.globals = {}

    this.globalFunctions = {}
  }

  /* ======== Class methods ======== */
  update() {
    /* --- Checks if some _timeTriggerEvents should be added to the heap --- */
    for (let i = 0; i < this._timeTriggerEvents.length; i++) {
      if (this.timeInMs >= this._timeTriggerEvents[i].happenedAt) {
        this._timeTriggerEvents[i].happenedAt = this.timeInMs // correct for fps delay
        this.addEvent(this._timeTriggerEvents[i])
        this._timeTriggerEvents.splice(i)
      }
    }

    /* --- Update the state --- */
    this.currentState.update()
  }

  storeEvent(event = mandatory()) {
    try {
      if (this.dataManager.constructor !== DataManager) {
        throw new Error('StateManager.storeEvent: dataManager is not set, cannot store event.')
      }

      if (!event.handled) {
        debuglog(event)
        throw new Error('StateManager.storeEvent:cannot store an event that was not handled.')
      }

      if (event.stored) {
        debuglog(event)
        throw new Error('StateManager.storeEvent: Event already stored')
      }

      event.storedInErrorLog = false
      let belongsTo = event.data.belongsTo
      if (belongsTo.constructor !== Array) {
        belongsTo = [belongsTo]
      }

      for (let i = 0; i < belongsTo.length; i++) {
        try {
          event.data.storedAt = this.timeInMs
          event.stored = true

          debuglog('StateManager.storeEvent: storing event.')
          // this.dataManager.log(belongsTo[i], event)
          this.dataManager.addRows(belongsTo[i], event.formatted)
          debuglog('StateManager.storeEvent: event stored.', event)
        } catch (error) {
          debugError(`StateManager.storeEvent: Could not store data in ${belongsTo[i]} dataTable. Data was stored in the errorLog. DataManager error was: ${error}`)
          this.storeInErrorLog(event)
        }
      }
    } catch (e) {
      debugError(e)
    }
  }

  storeData(data = mandatory()) {
    try {
      if (this.dataManager.constructor !== DataManager) {
        throw new Error('StateManager.storeData: dataManager is not set, cannot store event.')
      }

      if (!(_.has(data, 'belongsTo'))) {
        debuglog(data)
        throw new Error('StateManager: data needs a belongsTo property in order to store it in the dataManager.')
      }

      if (hasConstructor(String, data.belongsTo)) {
        data.belongsTo = [data.belongsTo]
      }

      data.storedInErrorLog = false
      for (let i = 0; i < data.belongsTo.length; i++) {
        try {
          this.dataManager.addRows(data.belongsTo[i], data)
        } catch (error) {
          console.error(`StateManager: Could not store data in ${data.belongsTo[i]} dataTable. Data was stored in the errorLog. DataManager error was: ${error}`)
          this.storeInErrorLog(data)
        }
      }
    } catch (e) {
      debugError(e)
    }
  }

  storeInErrorLog(data = mandatory()) {
    if (data.storedInErrorLog === false) {
      data.storedInErrorLog = true
      this.errorLog = this.errorLog.concat(data)
      // TODO check datamanager has error log, if yes store it, if not create it and store it
      debuglog('StateManager: data stored in the errorLog.')
    } else {
      debugWarn('StateManager: data already stored in errorLog. Did not store it again.')
    }
  }

  /* === State management === */

  /**
   * Adds a new state with specified stateKey.
   * If a list of several states is specified, the function returns an array.
   *
   * @param {...string} stateKeys list of additional state
   */
  addState(...stateKeys) {
    try {
      const returnedStates = []
      let stateKey
      for (let i = 0; i < stateKeys.length; i++) {
        stateKey = stateKeys[i]

        if (stateKey.constructor !== String) {
          throw new Error('StateManager: stateKey must be a string.')
        }

        if (_.has(this.states, stateKey)) {
          throw new Error(`StateManager: a state with a similar stateKey '${stateKey}' already exists.`)
        }

        this.states[stateKey] = new State(this, stateKey)

        debuglog(`StateManager: added state '${stateKey}'.`)

        returnedStates.push(this.states[stateKey])
      }

      return (returnedStates.length === 1) ? returnedStates[0] : returnedStates
    } catch (e) {
      debugError(e)
      return null
    }
  }

  /* === State change === */
  goToState(key = mandatory(), reload = false) {
    if (_.has(this.states, key)) {
      this.currentState.end()

      this._currentStateKey = key
      this.states[key].awake(reload)
    } else {
      debugError('StateManager: Invalid state key.')
    }
  }

  /* ======= Interface ======= */
  /* */


  /**
   * addGuiCanvas - Create a GUI Canvas always on top with a zOrder of -1
   *
   * @param {null} [scene=null] scene object
   *
   * @returns {BABYLON.ScreenSpaceCanvas2D} GUI canvas
   */
  addGuiCanvas() {
    try {
      const scene = this._parent
      mustHaveConstructor(BABYLON.Scene, scene)

      const canvasOptions = {
        id: 'GUI',
        backgroundFill: BABYLON.Canvas2D.GetSolidColorBrush(new BABYLON.Color4(0, 0, 0, 0)),
        backgroundRoundRadius: 0,
        x: 0,
        y: 0,
        zOrder: 1,
      }

      const GUI = new BABYLON.ScreenSpaceCanvas2D(scene, canvasOptions)

      GUI.levelVisible = false
      this.set('GUI', GUI)

      return GUI
    } catch (e) {
      debugError(e)
      return null
    }
  }

  // TODO tooltip on the GUI to highlight specific positions
  tooltip({ replace = false, position = null, size = null, spaced = null, text = '', fontName = '14pt Verdana', duration = null, event = new EventData(this.R.get.events_tooltipDismissed), background = null, fontColor = null }) {
    // Set the default
    spaced = spreadToObject(spaced, new BABYLON.Vector2(0, 0))
    if ((duration === null) || (duration.constructor !== Promise)) {
      if ((duration !== null) && (duration.constructor === Number)) {
        duration = delay(duration)
      } else {
        duration = (new Deferred()).promise
      }
    }

    const guiCanvas = this.get('GUI')
    guiCanvas.levelVisible = true

    const brownColor = [112 / 255, 102 / 255, 98 / 255, 0.95]

    let tooltips = this.get('tooltips', [])
    if (tooltips.constructor === Object) {
      tooltips = [tooltips]
    }
    const id = tooltips.length + 1

    let tooltip = null
    if (replace && tooltips.length) {
      tooltip = tooltips[tooltips.length - 1]
    } else if (tooltips.length) {
      for (const temptool of tooltips) {
        if (typeof temptool.box !== 'undefined') {
          temptool.box.zOrder = (id - temptool.id) * 0.01
          temptool.text.zOrder = ((id - temptool.id) * 0.01) - 0.001
        }
        if ((typeof temptool.disposed !== 'undefined') && (temptool.disposed)) {
          temptool.box.zOrder = 0.001
          temptool.text.zOrder = 0
          tooltip = temptool
          background = spreadToObject(background, new BABYLON.Color4(...brownColor))
          break
        }
      }
    }


    if (tooltip !== null) {
      tooltip.text.levelVisible = true
      tooltip.box.levelVisible = true

      tooltip.text.text = text

      const tempPosition = tooltip.box.position.add(sizeToVec(tooltip.box.size).scale(0.5))
      if (size === null) {
        tooltip.box.width = tooltip.text.size.width + 24
        tooltip.box.height = tooltip.text.size.height + 24
      } else {
        tooltip.box.width = size.width
        tooltip.box.height = size.height
      }

      if (background !== null) {
        background = spreadToObject(background, new BABYLON.Color4(...brownColor))
        const brush = BABYLON.Canvas2D.GetSolidColorBrush(background)
        tooltip.box.fill = brush
      }

      fontColor = spreadToObject(fontColor, new BABYLON.Color4(1, 1, 1, 1))

      tooltip.text.defaultFontColor = fontColor


      position = spreadToObject(position, tempPosition)
      const nextPos = position.subtract(sizeToVec(tooltip.box.size).scale(0.5).add(spaced))
        // TODO make a bounding function to make sure the tooltip is visible depending on the rendersize the position and size of the tooltip
      tooltip.box.position = nextPos
      tooltip.promise = duration
      tooltip.event = event
      tooltip.disposed = false
    } else {
      position = spreadToObject(position, new BABYLON.Vector2(0, 0))

      const sizeDefault = spreadToObject(size, new BABYLON.Size(300, 300))

      // const normalColor = [202 / 255, 64 / 255, 0, 0.95]

      // let fontSuperSample = true
      // let fontSignedDistanceField = false
      // if (background === null) {
      //   fontSuperSample = false
      //   fontSignedDistanceField = true
      // }

      const fontSuperSample = false
      const fontSignedDistanceField = true
      background = spreadToObject(background, new BABYLON.Color4(...brownColor))
      fontColor = spreadToObject(fontColor, new BABYLON.Color4(1, 1, 1, 1))

      const brush = BABYLON.Canvas2D.GetSolidColorBrush(background)

      const tooltipBox = new BABYLON.Rectangle2D({
        parent: guiCanvas,
        id: 'tooltipBox',
        // position: position.subtract(size.scale(0.5).add(spaced)),
        width: sizeDefault.width,
        height: sizeDefault.height,
        // border: brush,
        // borderThickness: 2,
        fill: brush,
      })

      const tooltipText = new BABYLON.Text2D(text, {
        parent: tooltipBox,
        id: 'tooltipText',
        marginAlignment: 'h: center, v:center',
        defaultFontColor: fontColor,
        fontSuperSample,
        fontSignedDistanceField,
        fontName,
      })

      if (size === null) {
        tooltipBox.width = tooltipText.size.width + 24
        tooltipBox.height = tooltipText.size.height + 24
      }

      tooltipBox.position = position.subtract(sizeToVec(tooltipBox.size).scale(0.5).add(spaced))


      tooltip = { box: tooltipBox, text: tooltipText, promise: duration, id, disposed: false, event }


      this.set('tooltips', tooltips.concat(tooltip))
    }

    duration.then(() => {
      if (tooltip.promise === duration) {
        this.hideTooltip(tooltip)
      }
      if (event.constructor === EventData) {
        event.happenedAt = this.timeInMs
        this.addEvent(event)
      }
    })

    return tooltip.promise
  }

  hideTooltip(...tooltips) {
    const allTooltips = this.get('tooltips', [])
    if (tooltips.length === 0) {
      tooltips = allTooltips
    }

    // const newTooltips = []
    for (const tooltip of allTooltips) {
      if (tooltips.indexOf(tooltip) !== -1) {
        if (typeof tooltip.box !== 'undefined') {
          tooltip.box.levelVisible = false
          tooltip.disposed = true // since dispose() is too slow, imitate the behavior by replacing old tooltip if necessary
        }
      }
      // else {
      //   newTooltips.push(tooltip)
      // }
    }
    // allTooltips.length = 0

    // this.set('tooltips', newTooltips)
  }

  /* === Pause State === */

  /**
   * Funtion to set the PAUSE mode for all states. Default uses spacebar keydown event from this._parent.
   * @param {Number} key  keyCode of the the pause button, default to 32 (spacebar)
   * @param {string} flag event flag, defaults to this._parent.FLAG_EVENTS_INPUT_KEYDOWN
   */
  setPauseKeyStroke(key = 32, flag = null, addDefaultDesign = true) {
    const pauseState = function (options = null) {
      const state = this.state
      const stateManager = this.stateManager
      const R = this.R

      if (options.data.keyCode === key) {
        state.freeze() // key function
        stateManager.goToState(R.get.states_pause)
      }

      return ('state.pauseState: resolved')
    }

    const forcePause = function () {
      this.state.freeze() // key function
      this.stateManager.goToState(this.R.get.states_pause)
      return ('state.forcePause: resolved')
    }


    const unPause = function (options = null) {
      if (options.data.keyCode === key) {
        if (this.stateManager.frozenState !== null) {
          this.stateManager.goToState(this.stateManager.frozenState)
        } else {
          debugError('state.unPause: no frozen state !')
        }
      }

      return ('state.unPause: resolved')
    }

    flag = (flag !== null) ? flag : this.R.get.events.keydown

    const stateKeys = this.stateKeys
    for (let i = 0; i < stateKeys.length; i++) {
      if (stateKeys[i] !== this.R.get.states_pause) {
        // by default only one pause handling function per state
        this.registerEventFunction(stateKeys[i], flag, pauseState)
        this.registerEventFunction(stateKeys[i], this.R.get.events_pause, forcePause)
      } else {
        this.registerEventFunction(stateKeys[i], flag, unPause)
        this.registerEventFunction(stateKeys[i], this.R.get.events_pause, unPause)
      }
    }

    if (addDefaultDesign) {
      this.addDefaultPauseDesign()
    }
  }

  /**
   * Function that adds a basic pause design with background overlay and a large "PAUSE" text top center.
   * Uses babylon Rectangle2D and text2d
   */
  addDefaultPauseDesign() {
    if (BABYLON === null) {
      return false
    }

    const awakePause = function (options = null) {
      try {
        if (typeof this.taskObject === 'undefined') {
          throw new Error('state.awakePause: taskObject is undefined')
        }
        const stateManager = this.stateManager

        const pauseBackground2D = stateManager.get('pauseBackground2D')
        const canvas = this.scene.screenCanvas

        if (pauseBackground2D !== null) {
          pauseBackground2D.size = canvas.size
          pauseBackground2D.levelVisible = true
        } else {
          if (typeof canvas === 'undefined') {
            return ('awakePause: initialCanvas is undefined.')
          }
          // draw a rect2d of canvas size with background opacity 0.5
          // draw a large text2d "PAUSE" inside
          const baseOptions = {
            id: 'pauseBackground2D',
            text: 'Pause',
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            fill: BABYLON.Canvas2D.GetSolidColorBrush(new BABYLON.Color4(0.3, 0.3, 0.3, 0.5)),
            fontName: '40pt Verdana',
            backgroundRoundRadius: 0,
          }

          options = _.extend(baseOptions, options)

          let customSized = canvas.size
          if ((options.width !== canvas.width) || (options.height !== canvas.height)) {
            customSized = new BABYLON.Size(options.width, options.height)
          }

          const canvasOptions = {
            id: options.id,
            roundRadius: options.backgroundRoundRadius,
            fill: options.fill,
            parent: this.scene.screenCanvas,
            marginAlignment: 'h:center, v: center',
            size: customSized,
            zOrder: 0,
            children: [
              new BABYLON.Text2D(options.text, {
                fontName: options.fontName,
                marginAlignment: 'h: center, v:top',
                fontSignedDistanceField: true,
                zOrder: 0,
              }),
            ],
          }

          const pauseBackground2D = new BABYLON.Rectangle2D(canvasOptions)

          stateManager.set('pauseBackground2D', pauseBackground2D) // TODO Make those string part of R.
        }
        return ('state.awakePause: resolved')
      } catch (e) {
        debugError(e)
        return e
      }
    }

    const endPause = function () {
      try {
        if (typeof this.state === 'undefined') {
          throw new Error('state.endPause: state is undefined')
        }
        const stateManager = this.stateManager
        const pauseBackground2D = stateManager.get('pauseBackground2D')

        if (pauseBackground2D !== null) {
          // pauseBackground2D.dispose()
          // stateManager.set('pauseBackground2D', null)
          pauseBackground2D.levelVisible = false
        }

        return ('state.endPause: resolved')
      } catch (e) {
        debugError(e)
        return e
      }
    }

    this.registerAwakeningFunction(this.R.get.states_pause, awakePause)
    this.registerEndingFunction(this.R.get.states_pause, endPause)

    return true
  }

  stateWasFrozen(stateKey = mandatory()) {
    this.frozenState = stateKey

    // when frezing a state - events are not processed by the next state
    this.emptyEventHeap()
    this.emptyTimeTriggerEvents()
  }

  stateWasUnfreezed(stateKey = mandatory()) {
    if (this.frozenState !== stateKey) {
      debugError('StateManager.stateWasUnfreezed: stateKey does not correspond to the frozenState')
    } else {
      this.newEvent(this.R.get.events_unfrozen)
      this.frozenState = null
    }
  }

  /* === Time event === */
  addTimeTriggerEvent(event = mandatory('event')) {
    if (event.constructor === EventData) {
      if (event.happenedAt > this.timeInMs + 40) {
        this._timeTriggerEvents.push(event)
        debuglog('StateManager: Trigger event added to the time triggers.')
      } else {
        this.addEvent(event)
        debugError('StateManager.addTimeTriggerEvent: trigger event is to close to current time (<40ms). Added directly to the heap.')
      }
    } else {
      debugError('StateManager: Event is not of class EventData.')
    }
  }

  /* === Event heap methods === */
  addEvent(event = mandatory('event')) {
    if (event.constructor === EventData) {
      this._eventHeap.push(event)
      debuglog('StateManager: Event added to the heap.')
    } else {
      debugError('StateManager: Event is not of class EventData.')
    }
  }

  newEvent(flag = mandatory(), time = null, data = null, belongsTo = ['globalLog']) {
    // check that the user did not use newEvent as addEvent
    if (flag.constructor === EventData) {
      debuglog('StateManager.newEvent: flag is an EventData object. Using addEvent().')
      this.addEvent(flag)
      return flag
    }

    // checks if the user gave a non array to belongsTo
    if (belongsTo.constructor !== Array) {
      if (belongsTo.constructor === String) {
        belongsTo = [belongsTo]
      } else {
        debugError('stateManager.newEvent: belongs to need to be either a string or an array')
        return null
      }
    } else if (belongsTo.indexOf('globalLog') === -1) {
        // add the missing globalLog to belongsTo
      belongsTo.push('globalLog')
    }

    const eventOptions = {
      belongsTo,
      handledAt: null,
      storedAt: null,
    }
    if (data !== null) {
      eventOptions.data = data // TODO ++++ SHOULD BE _.extend()
    } else if ((time !== null) && (time.constructor === Object) && (data === null)) {
      // treats time as the data and time as unknown
      eventOptions.data = time
      time = null
    }

    /* --- Not a time triggered event --- */
    if (time === null) {
      debuglog('stateManager.newEvent: time is null, using addEvent() with this.timeInMs.')
      const event = new EventData(flag, this.timeInMs, eventOptions)
      this.addEvent(event)
      return event
    }

    /* --- Time triggered event --- */
    // check if time is a duration or a timestamp - TODO set max duration somewhere
    if (time < this.R.get.values_timestampThreshold) {
      // time is a duration
      time += this.timeInMs
    }

    const event = new EventData(flag, time, eventOptions)
    this.addTimeTriggerEvent(event)
    return event
  }

  removeFirstEvent() {
    this._eventHeap.splice(0, 1)
  }

  removeEvent(event) {
    this._eventHeap = _.without(this._eventHeap, event)
  }

  getFirstEventAndRemoveFromHeap(byState = this.currentStateKey) {
    for (let i = 0; i < this._eventHeap.length; i++) {
      const event = this._eventHeap[i]
      if ((event.forState === 'any') || (event.forState === byState)) {
        return this._eventHeap.splice(i)
      }
    }

    return undefined
  }

  spliceEventsForState(byState = this.currentStateKey) {
    const toSplice = []
    for (let i = 0; i < this._eventHeap.length; i++) {
      const event = this._eventHeap[i]
      if ((event.forState === 'any') || (event.forState === byState)) {
        toSplice.push(i)
      }
    }

    return this._eventHeap.multisplice(...toSplice) // TODO use only one loop. And put events in a freezer if too long on the heap.
  }

  emptyEventHeap() {
    this._eventHeap = []
  }

  emptyTimeTriggerEvents() {
    this._timeTriggerEvents = []
  }

  getAllEvents() {
    return (this._eventHeap.concat(this._timeTriggerEvents))
  }

  /**
   * Called by the state once it has finished handling an event. This function calls the storeEvent function.
   * @param  {event} event Handled event
   */
  stateHasFinishedHandlingEvent(event) {
    event.data.handledAt = this.timeInMs
    event.handled = true

    debuglog('StateManager.stateHasFinishedHandlingEvent: event was handled.')

    if (this.dataManager.constructor === DataManager) {
      this.storeEvent(event)
    } else {
      debugWarn('StateManager.stateHasFinishedHandlingEvent: dataManager is not set, not storing event.')
    }
  }

  freezeEventHeap() {
    this.eventHeapIsFrozen = true
    this.frozenEventHeap = this._eventHeap
    // freeze the heap for certain event that need to be processed afterwards in series
    // TODO elements should not be deleted... maybe have firstNonFrozenEvent(); and a property of events if they are frozen or not
  }

  unfreezeEventHeap(storeFrozenEvents = true) {
    this.eventHeapIsFrozen = false

    if (storeFrozenEvents) {
      /* Reset event heap and store all frozen events in the globalLog */
      // const tempEvents = this._eventHeap TODO what was that for again ?
      this.emptyEventHeap()
    } else {
      // unfreeze events so they can be processed
    }
  }

  /* === State event functions === */

  /**
   * Registers a new event function for the specified event flag in the specified state. This function will be called in the handleEvent
   * function of the state if it is the active state. The function should return a Promise.
   * @param  {string} stateKey         key of state in which to add the new function
   * @param  {string} eventFlag        event for which the function should be called
   * @param  {function} handlingFunction Function that should return a Promise.
   */
  registerEventFunction(stateKey, eventFlag, ...handlingFunctions) {
    try {
      mustBeDefined(stateKey, eventFlag, ...handlingFunctions)
      mustHaveConstructor(Function, ...handlingFunctions)

      if (_.has(this.states, stateKey)) {
        this.states[stateKey].registerEventFunctions(eventFlag, true, ...handlingFunctions) // TODO Handle overwrite better ?
      } else {
        throw new Error(`StateManager: Invalid state key '${stateKey}'. Create the state before adding event handling functions.`)
      }
    } catch (e) {
      debugError(e)
    }
  }

  onNext(eventFlag, ...handlingFunctions) {
    return this.currentState.onNext(eventFlag, ...handlingFunctions)
  }

  resolveOnKey(...args) {
    return this.currentState.resolveOnKey(...args)
  }

  resolveOnClick(...args) {
    return this.currentState.resolveOnClick(...args)
  }

  /**
   * Adds a function to the awakening function array in the state object. Those function must return a promise.
   * @param  {[type]} stateKey         [description]
   * @param  {[type]} handlingFunction [description]
   * @return {[type]}                  [description]
   */
  registerAwakeningFunction(stateKey = mandatory(), handlingFunction = mandatory(), overwrite = false) {
    if (_.has(this.states, stateKey)) {
      this.states[stateKey].registerCycleFunctions('awakening', overwrite, handlingFunction)
    } else {
      debugError(`StateManager: Invalid state key '${stateKey}'. Create the state before adding awakening handling functions.`)
    }
  }

  registerEndingFunction(stateKey = mandatory(), handlingFunction = mandatory(), overwrite = false) {
    if (_.has(this.states, stateKey)) {
      this.states[stateKey].registerCycleFunctions('ending', overwrite, handlingFunction)
    } else {
      debugError(`StateManager: Invalid state key '${stateKey}'. Create the state before adding awakening handling functions.`)
    }
  }

  registerUpdateFunction(stateKey = mandatory(), handlingFunction = mandatory(), overwrite = false) {
    if (_.has(this.states, stateKey)) {
      this.states[stateKey].registerCycleFunctions('udpate', overwrite, handlingFunction)
      debuglog(`StateManager: handling function added to awakeningFunctions array for state '${stateKey}'`)
    } else {
      debugError(`StateManager: Invalid state key '${stateKey}'. Create the state before adding awakening handling functions.`)
    }
  }

  /* === Globals === */
  /**
   * Stores a function into the globalFunctions array of the stateManager. Those function must return a promise.
   * Storing function in the stateManager should be reserved to functions that are to be reused across states, and in general access global variables.
   * @param  {string} name            function's name
   * @param  {function} promiseFunction function should return a promise
   */
  registerGlobalFunction(func = mandatory(), name = null) {
    if (func.constructor !== Function) {
      debugError('StateManager.registerGlobalFunction: func is not a function')
    } else {
      // TODO checks that it works
      // var promiseFunction = looksLikeAPromise(func) ? func : Promise.method(func); Do no promisify here - give user the choice
      if (name === null) { name = func.name }

      this.globalFunctions[name] = func
    }
  }

  /**
   * Shorthand for registerGlobalFunction
   * @param  {string} name            function's name
   * @param  {function} promiseFunction
   */
  register(...functions) {
    for (let i = 0; i < functions.length; i++) {
      this.registerGlobalFunction(functions[i])
    }
  }

  // TODO get rid of this function use only call
  callGlobalFunction(name, ...args) {
    this.call(name, ...args)
  }

  /**
   * Shorthand for callGlobalFunction
   * @param  {string} name    Function's name
   * @param  {...object} args Optional arguments iterable
   * @return {promise}
   */
  call(name, ...args) {
    if (typeof name === 'undefined') {
      debugError('StateManager.call: name of the function needs to be defined.')
    } else if (_.has(this.globalFunctions, name)) {
      return (this.globalFunctions[name].bind(this.context)(...args))
    } else {
      debugWarn(`StateManager.call: globals do not contain function '${name}'`)
    }
    return undefined
  }

  promise(name, ...args) {
    if (typeof name === 'undefined') {
      debugError('StateManager.promiseGlobalFunction: name is undefined.')
    } else if (_.has(this.globalFunctions, name)) {
      return (Promise.method(this.globalFunctions[name]).bind(this.context)(...args))
    } else {
      debugWarn(`StateManager.promiseGlobalFunction: globals do not contain function '${name}'`)
    }

    return undefined
  }

  /**
   * Recurse on a given registered function, returns a promise resolving to the concatenated results.
   * @param  {string} name    Name of the function already registered in the stateManager
   * @param  {numeric} amount The amount of time we should recurse
   * @param  {Object} options Optional, object to specify as options of the registered function
   * @param  {Array}  results Optional, where to store the results.
   * @return {Promise}        Promise resolving to the filed results array.
   */
  recurseOnGlobalFunction(name = mandatory(), amount = mandatory(), args = [], results = []) {
    if (!_.has(this.globalFunctions, name)) {
      debugError(`StateManager.recurseOnGlobalFunction: globals do not contain function '${name}'`)
      return null
    }
      // Base case - just return the promisified result
    if (amount === 0) {
      return new Promise((resolve) => {
        resolve(results)
      })
    }


    const next = this.promise(name, ...args).then((r) => {
      results = results.concat(r)
      return (this.recurseOnGlobalFunction(name, amount - 1, args, results))
    })

    return next
  }

  /**
   * Shorthand for recurseOnGlobalFunction.
   * @param  {string} name    Name of the function already registered in the stateManager
   * @param  {numeric} amount The amount of time we should recurse
   * @param  {args} args Optional, array of arguments to pass to the promise
   * @param  {Array}  results Optional, where to store the results.
   * @return {Promise}        Promise resolving to the filed results array.
   */
  recurse(name = mandatory(), amount = mandatory(), args = [], results = []) {
    this.recurseOnGlobalFunction(name, amount, args, results)
  }

  /**
   * Return a stored global or null if it does not exist.
   * @param  {string} name String name of the variable
   * @return {?*}
   */
  getGlobal(name = mandatory(), setDefault) {
    if (this.globals.hasOwnProperty(name)) {
      return (this.globals[name])
    } else if (typeof setDefault !== 'undefined') {
      this.globals[name] = setDefault
      return this.globals[name]
    }
    debugWarn(`StateManager: globals do not contain variable '${name}' - and no default is given`)
    return (null)
  }

  get(name = mandatory(), setDefault) {
    return (this.getGlobal(name, setDefault))
  }

  /**
   * Stores a global variable. Beware if storing objects (stored by reference, any modification outside of the statemanager will affect the stored variable).
   * Maybe a _.cloneDeep would be better... lets think about it for a while.
   * @param {string} name  Name of the variable
   * @param {*} value Variable
   */
  setGlobal(name = mandatory(), value = mandatory()) {
    this.globals[name] = value
    debuglog(`StateManager: global '${name}' set to '${value}'`)
  }

  set(name = mandatory(), value = mandatory()) {
    this.setGlobal(name, value)
  }

  getStateObject(key) {
    if (_.has(this.states, key)) {
      return (this.states[key])
    }
    debugError('StateManager: Invalid state key.')
  }

  /* ======== Getters and Setters ======== */

  // TODO Redo documentation of those functions
  // static get context() {}
  // static get currentStateKey() {}
  // static get currentState() {}
  // static get eventHeap() {}
  // static get firstEvent() {}
  // static get time() {}
  // static get timeInSec() {}
  // static get timeInMs() {}

  /**
   * Returns a summary object containing the taskObject, dataManager, ressourceManager
   * as well as current scene, stateManager, and state.
   * Used as a a context accros the library when calling state functions (with .bind(context))
   */
  get context() {
    if (this._taskObject) {
      return (this._taskObject.getContext(this))
    }
    return ({
      taskObject: null,
      dataManager: this.dataManager,
      scene: this._parent, // TODO Force the ._parent to be the .scene ?
      stateManager: this,
      state: this.currentState,
      R: this.R,
    })
  }

  get stateKeys() {
    return (Object.keys(this.states))
  }

  get currentStateKey() {
    return (this._currentStateKey)
  }

  set currentStateKey(key) {
    if (_.has(this.states, key)) {
      this.goToState(key)
    } else {
      debugError('StateManager: Invalid state key.')
    }
  }

  get currentState() {
    return this.states[this.currentStateKey]
  }

  set currentState(state) {
    if (typeof state.key !== 'undefined') {
      this.currentStateKey = state.key
    } else {
      debugError('StateManager: Invalid state, it has no state key defined.')
    }
  }

  get eventHeap() {
    return (this._eventHeap)
  }

  set eventHeap(value) { // eslint-disable-line
    debugError('StateManager: eventHeap is readonly. Add events through the class methods.')
  }

  get firstEvent() {
    if (this._eventHeap.length) {
      return (this._eventHeap[0])
    }
    return undefined
  }

  set firstEvent(value) {
    // TODO not implemented -- maybe somekind of bruteforce to have an important input be treated first
    debugError('StateManager: firstEvent is readonly.')
  }

  /* === Time functions === */

  get time() {
    return (this.timeInMs)
  }

  get timeInSec() {
    return (new Date().getTime() / 1000)
  }

  get timeInMs() {
    return (new Date().getTime())
  }

}
