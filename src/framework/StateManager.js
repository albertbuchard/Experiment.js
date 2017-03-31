
/** @module StateManager */
import _ from 'lodash'
import BABYLON from 'experiment-babylon-js'
import Promise from 'bluebird'

import RessourceManager from './RessourceManager'
import State from './State'
import DataManager from './DataManager'
import EventData from './EventData'
import { mandatory, debuglog, debugWarn, debugError, mustBeDefined, mustHaveConstructor } from './utilities'

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
    this._dataManager = dataManager

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
    if (this._dataManager.constructor !== DataManager) {
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
        this._dataManager.addRows(belongsTo[i], event)
      } catch (error) {
        console.error(`StateManager.storeEvent: Could not store data in ${belongsTo[i]} dataTable. Data was stored in the errorLog. DataManager error was: ${error}`)
        this.storeInErrorLog(event)
      } finally {
        debuglog('StateManager.storeEvent: event stored.', event)
      }
    }
  }

  storeData(data = mandatory()) {
    if (this._dataManager.constructor !== DataManager) {
      throw new Error('StateManager.storeData: dataManager is not set, cannot store event.')
    }

    if (!(_.has(data, 'belongsTo'))) {
      debuglog(data)
      throw new Error('StateManager: data needs a belongsTo property in order to store it in the dataManager.')
    }

    data.storedInErrorLog = false
    for (let i = 0; i < data.belongsTo.length; i++) {
      try {
        this._dataManager.addRows(data.belongsTo[i], data)
      } catch (error) {
        console.error(`StateManager: Could not store data in ${data.belongsTo[i]} dataTable. Data was stored in the errorLog. DataManager error was: ${error}`)
        this.storeInErrorLog(data)
      }
    }
  }

  storeInErrorLog(data = mandatory()) {
    if (data.storedInErrorLog === false) {
      data.storedInErrorLog = true
      this.errorLog = this.errorLog.concat(data)
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
  }

  /* === State change === */
  goToState(key = mandatory(), reload = false) {
    if (_.has(this.states, key)) {
      this.currentState.end()

      this._currentStateKey = key
      this.states[key].awake(reload)
    } else {
      throw new Error('StateManager: Invalid state key.')
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
  }

  /* === Pause State === */

  /**
   * Funtion to set the PAUSE mode for all states. Default uses spacebar keydown event from this._parent.
   * @param {Number} key  keyCode of the the pause button, default to 32 (spacebar)
   * @param {string} flag event flag, defaults to this._parent.FLAG_EVENTS_INPUT_KEYDOWN
   */
  setPauseKeyStroke(key = 32, flag = null, addDefaultDesign = true) {
    const pauseState = function (options = null) {
      if (typeof this.state === 'undefined') {
        throw new Error('state.pauseState: state is undefined')
      }
      const state = this.state
      const stateManager = this.stateManager
      const R = this.R

      if (options.data.keyCode === key) {
        state.freeze() // key function
        stateManager.goToState(R.get.states_pause)
      }

      return ('state.pauseState: resolved')
    }

    const unPause = function (options = null) {
      if (typeof this.stateManager === 'undefined') { // TODO Discuss wether it is a good idea to check the context
        throw new Error('state.unPause: state is undefined')
      }


      if (options.data.keyCode === key) {
        if (this.stateManager.frozenState !== null) {
          this.stateManager.goToState(this.stateManager.frozenState)
        } else {
          throw new Error('state.unPause: no frozen state !')
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
      } else {
        this.registerEventFunction(stateKeys[i], flag, unPause)
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
      if (typeof this.taskObject === 'undefined') {
        throw new Error('state.awakePause: taskObject is undefined')
      }
      const stateManager = this.stateManager

      const pauseBackground2D = stateManager.get('pauseBackground2D')

      if (pauseBackground2D !== null) {
        pauseBackground2D.levelVisible = true
      } else {
        const canvas = this.scene.initialCanvas
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

        let customSized = null
        if ((options.width !== canvas.width) || (options.height !== canvas.height)) {
          customSized = new BABYLON.Size(options.width, options.height)
        }

        const canvasOptions = {
          id: options.id,
          backgroundFill: options.fill,
          backgroundRoundRadius: options.backgroundRoundRadius,
          fill: options.fill,
          x: (canvas.width / 2) - ((options.width) / 2),
          y: (canvas.height / 2) - ((options.height) / 2),
          designSize: customSized,
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

        const pauseBackground2D = new BABYLON.ScreenSpaceCanvas2D(this.scene, canvasOptions)

        stateManager.set('pauseBackground2D', pauseBackground2D) // TODO Make those string part of R.
      }

      return ('state.awakePause: resolved')
    }

    const endPause = function () {
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
      throw new Error('StateManager.stateWasUnfreezed: stateKey does not correspond to the frozenState')
    }

    this.frozenState = null
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
        throw new Error('stateManager.newEvent: belongs to need to be either a string or an array')
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
      eventOptions.data = data
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

  getFirstEventAndRemoveFromHeap() {
    const event = this.firstEvent
    this.removeFirstEvent()

    return (event)
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

    if (this._dataManager.constructor === DataManager) {
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
    mustBeDefined(stateKey, eventFlag, ...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    if (_.has(this.states, stateKey)) {
      this.states[stateKey].registerEventFunctions(eventFlag, true, ...handlingFunctions) // TODO Handle overwrite better ?
    } else {
      throw new Error(`StateManager: Invalid state key '${stateKey}'. Create the state before adding event handling functions.`)
    }
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
      throw new Error(`StateManager: Invalid state key '${stateKey}'. Create the state before adding awakening handling functions.`)
    }
  }

  registerEndingFunction(stateKey = mandatory(), handlingFunction = mandatory(), overwrite = false) {
    if (_.has(this.states, stateKey)) {
      this.states[stateKey].registerCycleFunctions('ending', overwrite, handlingFunction)
    } else {
      throw new Error(`StateManager: Invalid state key '${stateKey}'. Create the state before adding awakening handling functions.`)
    }
  }

  registerUpdateFunction(stateKey = mandatory(), handlingFunction = mandatory(), overwrite = false) {
    if (_.has(this.states, stateKey)) {
      this.states[stateKey].registerCycleFunctions('udpate', overwrite, handlingFunction)
      debuglog(`StateManager: handling function added to awakeningFunctions array for state '${stateKey}'`)
    } else {
      throw new Error(`StateManager: Invalid state key '${stateKey}'. Create the state before adding awakening handling functions.`)
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
      throw new Error('StateManager.registerGlobalFunction: func is not a function')
    }
    // TODO checks that it works
    // var promiseFunction = looksLikeAPromise(func) ? func : Promise.method(func); Do no promisify here - give user the choice
    if (name === null) { name = func.name }

    this.globalFunctions[name] = func
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
    mustBeDefined(name)

    if (typeof name === 'undefined') {
      throw new Error('StateManager.call: name of the function needs to be defined.')
    }
    if (_.has(this.globalFunctions, name)) {
      return (this.globalFunctions[name].bind(this.context)(...args))
    }
    debugWarn(`StateManager.call: globals do not contain function '${name}'`)
    return undefined
  }

  promise(name, ...args) {
    mustBeDefined(name)

    if (typeof name === 'undefined') {
      throw new Error('StateManager.promiseGlobalFunction: name is undefined.')
    }

    if (_.has(this.globalFunctions, name)) {
      return (Promise.method(this.globalFunctions[name]).bind(this.context)(...args))
    }

    debugWarn(`StateManager.promiseGlobalFunction: globals do not contain function '${name}'`)
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
      throw new Error(`StateManager.recurseOnGlobalFunction: globals do not contain function '${name}'`)
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
  getGlobal(name = mandatory()) {
    if (_.has(this.globals, name)) {
      return (this.globals[name])
    }
    debugWarn(`StateManager: globals do not contain variable '${name}'`)
    return (null)
  }

  get(name = mandatory()) {
    return (this.getGlobal(name))
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
    throw new Error('StateManager: Invalid state key.')
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
      dataManager: this._dataManager,
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
      throw new Error('StateManager: Invalid state key.')
    }
  }

  get currentState() {
    return this.states[this.currentStateKey]
  }

  set currentState(state) {
    if (typeof state.key !== 'undefined') {
      this.currentStateKey = state.key
    } else {
      throw new Error('StateManager: Invalid state, it has no state key defined.')
    }
  }

  get eventHeap() {
    return (this._eventHeap)
  }

  set eventHeap(value) { // eslint-disable-line
    throw new Error('StateManager: eventHeap is readonly. Add events through the class methods.')
  }

  get firstEvent() {
    if (this._eventHeap.length) {
      return (this._eventHeap[0])
    }
    return undefined
  }

  set firstEvent(value) {
    // TODO not implemented -- maybe somekind of bruteforce to have an important input be treated first
    throw new Error('StateManager: firstEvent is readonly.')
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
