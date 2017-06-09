
/** @module State */
import _ from 'lodash'
import Promise from 'bluebird'
import EventData from './EventData'
import { mandatory, debuglog, debugWarn, debugError, mustBeDefined, mustHaveConstructor } from './utilities'

/* State object has a specific way to handle input and update objects */
export default class State {


  /**
   * @constructor
   * @param {object} [stateManager]
   * @param {string} [stateKey]
   */
  constructor(stateManager = mandatory(), stateKey = mandatory()) {
    this._stateManager = stateManager
    this._parent = stateManager._parent
    this._dataManager = stateManager._dataManager

    this.stateKey = stateKey

    /**
     * Object in which properties names are handling function to be called for specific events.
     * The key of those properties are the event flags. Handling functions should return a Promise.
     * @type {Object}
     */
    this._eventFunctions = {}

    /**
     * Object containing array of function to be called once for specific events
     * The key of those properties are the event flags. Handling functions should return a Promise.
     * @type {Object}
     */
    this._nextEventFunctions = {}

    /**
     * Array of handling function to be called when the state awaken, just after state change.
     * This is where redrawing should go. Handling functions should return a Promise.
     * @type {Array}
     * @private
     */
    this._awakeningFunctions = []

    /**
     * Array of handling functions to be called when the state is dismissed, just before the state change.
     * Handling functions should return a Promise.
     * @type {Array}
     * @private
     */
    this._endingFunctions = []

    /**
     * Array of functions that are to be called upon each updates.
     * Those functions should return a Promise.
     * @type {Array}
     */
    this._updateFunctions = []

    /**
     * Array of stored timed event in case of state freezing
     * @type {Array}
     */
    this._frozenEvents = []

    /**
     * Timestamp of frozen time. Value is null if the state is not frozen.
     * @type {int}
     */
    this._frozenAt = null

    /**
     * Constant. When unfreezing if the time difference etween happenedAt and the current timeInMs is less than
     * this value, the event is directly added to the event heap. Else it is treated as a tigger event.
     * @type {Number}
     */
    this.FREEZE_DELAY = 50
  }

  /* ======== Class Methods ======== */

  /* === Lifecycle hook functions === */

  /**
   * Function called at state awakening.
   * All functions of the _awakeningFunctions array will be called, they must return a Promise.
   */
  awake(reload = false) {
    if (reload) {
      if (this._frozenAt !== null) {
        this._frozenAt = null
        this._frozenEvents = []
        this.stateManager.stateWasUnfreezed(this.stateKey)
      }
      // NOTE Might have other things to do here...
    }

    /* --- If state was frozen unfreeze it but do not re-awake --- */
    if (this._frozenAt !== null) {
      this.unfreeze()
    } else {
      if (typeof this._parent.sceneKey !== 'undefined') { debuglog(`${this.stateKey} of scene ${this._parent.sceneKey} awaken.`) }

      const calledFunctions = []
      for (let i = 0; i < this._awakeningFunctions.length; i++) {
        calledFunctions[i] = Promise.method(this._awakeningFunctions[i].bind(this.context))()
      }

      Promise.all(calledFunctions).then(() => {
        /* Promise ran as expected, returned data */
        debuglog('State: Awakening functions completed as expected.', calledFunctions)
      }).catch((error) => {
        /* an error occured */
        debugError(error)
      })
    }
  }

  /**
   * Function called when state ends, just before state change.
   * All functions of the _endingFunctions array will be called, they must return a Promise.
   */
  end() {
    if (this._frozenAt === null) {
      const calledFunctions = []
      for (let i = 0; i < this._endingFunctions.length; i++) {
        calledFunctions[i] = Promise.method(this._endingFunctions[i].bind(this.context))()
      }

      Promise.all(calledFunctions).then((data) => {
      /* Promise ran as expected, returned data */
        debuglog('State: Ending functions completed as expected.', calledFunctions)
        debuglog(`${this.stateKey} ended.`)
        return data
      }).catch((error) => {
      /* an error occured */
        debugError(error)
        return null
      })
    }
  }

  update() {
    if ((this._frozenAt === null) && (this._stateManager._eventHeap.length)) {
      let nextEvent
      const events = this._stateManager.spliceEventsForState(this.stateKey)
      for (let i = 0; i < events.length; i++) {
        nextEvent = events[i]
        debuglog(`State: first event is ${nextEvent.flag}`)

        this.handleEvent(nextEvent)
      }
      // while (events.length) {
      //   nextEvent = his._stateManager.getFirstEventAndRemoveFromHeap(this.stateKey)
      //   if (typeof nextEvent === 'undefined') {
      //     debuglog('State.update: first event is undefined. Probably bc not meant for this state.') // TODO not good do better
      //     break
      //   }
      // }

      // if (typeof this._updateFunctions !== 'undefined') {
      //
    }

    // debuglog(this.stateKey + " updated.");
  }

  /* === Event based functions === */

  handleEvent(event) {
    // for each input flag have a specific function ready - that can be customizable
    // rename input with Event ?
    // make a promise and chain it with .then(stateHasFinishedHandlingEvent())
    let handled = false
    if (this.hasEventFunction(event.flag)) {
      /* Promise allow for assynchronous handling of events */
      const eventFunctions = this._eventFunctions[event.flag]
      if (eventFunctions.constructor === Array) {
        for (let i = 0; i < eventFunctions.length; i++) {
          Promise.method(eventFunctions[i].bind(this.context))(event)
            .then(function (functionName, data) {
              /* Promise ran as expected, returned data */
              debuglog(data)
              const eventClone = _.cloneDeep(event)
              eventClone.data.handlingFunction = functionName
              this._stateManager.stateHasFinishedHandlingEvent(eventClone)
            }.bind(this, eventFunctions[i].name))
            .catch((error) => {
              /* an error occured */
              debugError(error)
            })
        }
      } else {
        Promise.method(eventFunctions.bind(this.context))()
          .then(function (functionName, data) {
            /* Promise ran as expected, returned data */
            debuglog(data)
            const eventClone = _.cloneDeep(event)
            eventClone.data.handlingFunction = functionName
            this._stateManager.stateHasFinishedHandlingEvent(eventClone)
          }.bind(this, eventFunctions.name))
          .catch((error) => {
            /* an error occured */
            debugError(error)
          })
      }
      handled = true
    }
    if (this._nextEventFunctions.hasOwnProperty(event.flag)) {
      let eventFunctions = this._nextEventFunctions[event.flag]
      if (eventFunctions !== null) {
        if (eventFunctions.constructor === Function) { eventFunctions = [eventFunctions] }
        for (const eventFunction of eventFunctions) {
          Promise.method(eventFunction)(event)
            .then(function (functionName, data) {
              /* Promise ran as expected, returned data */
              debuglog(data)
              const eventClone = _.cloneDeep(event)
              eventClone.data.handlingFunction = functionName
              this._stateManager.stateHasFinishedHandlingEvent(eventClone)
            }.bind(this, eventFunction.name))
            .catch((error) => {
              /* an error occured */
              debugError(error)
            })
        }
        this._nextEventFunctions[event.flag].length = 0
        handled = true
      }
    }

    if (!handled) {
      this._stateManager.stateHasFinishedHandlingEvent(event)
      debuglog(`State: Event '${event.flag}' not handled by state '${this.stateKey}'`)
    }
  }

  onNext(eventFlag, ...handlingFunctions) {
    try {
      mustBeDefined(eventFlag, ...handlingFunctions)
      mustHaveConstructor(Function, ...handlingFunctions)

      // checks if functions should be stacked in an array for this flag
      if (this._nextEventFunctions.hasOwnProperty(eventFlag)) {
        if (this._nextEventFunctions[eventFlag].constructor === Array) {
          // push the handlingFunction to the array of _eventFunctions[eventFlag]
          this._nextEventFunctions[eventFlag] = this._nextEventFunctions[eventFlag].concat(handlingFunctions)
          debuglog(`State ${this.stateKey}.onNext: several handling functions - handling function pushed to the array of event functions on event '${eventFlag}'`)
        } else {
          // creates array of event function
          this._nextEventFunctions[eventFlag] = [this._nextEventFunctions[eventFlag]].concat(handlingFunctions)
          debuglog(`State ${this.stateKey}.onNext: several handling functions - array created for handling functions for state on event '${eventFlag}'`)
        }
      } else {
        this._nextEventFunctions[eventFlag] = handlingFunctions
        debuglog(`State ${this.stateKey}.onNext: handling function added to state '${this.stateKey}' for event '${eventFlag}'`)
      }
    } catch (e) {
      debugError(e)
    }
  }

  freeze() {
    const stateManager = this._stateManager

    this._frozenAt = stateManager.timeInMs
    this._frozenEvents = stateManager.getAllEvents()
    debugWarn(this._frozenEvents)
    stateManager.stateWasFrozen(this.stateKey) // TODO: make sure only one state can be frozen ? or add multiple frozen thingy
  }

  unfreeze() {
    if (this._frozenAt === null) {
      debugWarn('State.unfreeze: state was not frozen')
      return
    }

    const stateManager = this._stateManager
    const frozenEvents = this._frozenEvents

    for (let i = 0; i < frozenEvents.length; i++) {
      if (frozenEvents[i].constructor === EventData) {
        frozenEvents[i].happenedAt += stateManager.timeInMs - this._frozenAt
        if ((frozenEvents[i].happenedAt - stateManager.timeInMs) > this.FREEZE_DELAY) {
          stateManager.addTimeTriggerEvent(frozenEvents[i])
          console.log('timetrigger')
          debugWarn(frozenEvents[i])
        } else {
          stateManager.addEvent(frozenEvents[i])
          console.log('added event')
          debugWarn(frozenEvents[i])
        }
      }
    }

    this._frozenAt = null
    this._frozenEvents = []
    stateManager.stateWasUnfreezed(this.stateKey) // TODO: make sure only one state can be frozen ? or add multiple frozen thingy
  }

  /* = Main functions = */
  // TODO Use Promise.method
  // TODO Change all _eventFunctions to arrays
  registerEventFunctions(eventFlag, overwrite, ...handlingFunctions) {
    mustBeDefined(eventFlag, overwrite, ...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    // checks if functions should be stacked in an array for this flag
    if (this.hasEventFunction(eventFlag)) {
      if (this._eventFunctions[eventFlag].constructor === Array) {
        // push the handlingFunction to the array of _eventFunctions[eventFlag]
        this._eventFunctions[eventFlag] = this._eventFunctions[eventFlag].concat(handlingFunctions)
        debuglog(`State ${this.stateKey}: several handling functions - handling function pushed to the array of event functions on event '${eventFlag}'`)
      } else {
        // creates array of event function
        this._eventFunctions[eventFlag] = [this._eventFunctions[eventFlag]].concat(handlingFunctions)
        debuglog(`State ${this.stateKey}: several handling functions - array created for handling functions for state on event '${eventFlag}'`)
      }
    } else {
      this._eventFunctions[eventFlag] = handlingFunctions
      debuglog(`State ${this.stateKey}: handling function added to state '${this.stateKey}' for event '${eventFlag}'`)
    }
  }

  registerCycleFunctions(cycle, overwrite, ...handlingFunctions) {
    mustBeDefined(cycle, overwrite, ...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    let arrayName
    switch (cycle) {
      case 'awakening':
        arrayName = '_awakeningFunctions'
        break
      case 'ending':
        arrayName = '_endingFunctions'
        break
      case 'update':
        arrayName = '_updateFunctions'
        break
      default:
        throw new Error('State.registerCycleFunctions: Invalid cycle parameter.')
    }

    if (overwrite) {
      this[arrayName] = handlingFunctions
      debuglog(`State ${this.stateKey}: handling function overwrited ${arrayName}`)
    } else {
      this[arrayName] = this[arrayName].concat(handlingFunctions)
      debuglog(`State ${this.stateKey}: handling function added to ${arrayName} array for state '${this.stateKey}'`)
    }
  }

  /* = Short handle = */

  /**
   * Short hand function that adds several events using the handlingFunctions name as handle.
   * @param [...function] handlingFunctions
   */
  addHandledEvents(...handlingFunctions) {
    mustBeDefined(...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    for (let i = 0; i < handlingFunctions.length; i++) {
      this.registerEventFunctions(handlingFunctions[i].name, true, handlingFunctions[i])
    }
  }

  addEventFunctions(eventFlag, ...handlingFunctions) {
    mustBeDefined(eventFlag, ...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)
    this.registerEventFunctions(eventFlag, false, ...handlingFunctions)
  }

  overwriteEventFunctions(eventFlag, ...handlingFunctions) {
    mustBeDefined(eventFlag, ...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)
    this.registerEventFunctions(eventFlag, true, ...handlingFunctions)
  }

  addAwakeningFunctions(...handlingFunctions) {
    mustBeDefined(...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    this.registerCycleFunctions('awakening', false, ...handlingFunctions)
  }

  overwriteAwakeningFunctions(...handlingFunctions) {
    mustBeDefined(...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    this.registerCycleFunctions('awakening', true, ...handlingFunctions)
  }

  overwriteEndingFunction(...handlingFunctions) {
    mustBeDefined(...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    this.registerCycleFunctions('ending', true, ...handlingFunctions)
  }

  addEndingFunctions(...handlingFunctions) {
    mustBeDefined(...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    this.registerCycleFunctions('ending', false, ...handlingFunctions)
  }

  overwriteUpdateFunctions(...handlingFunctions) {
    mustBeDefined(...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    this.registerCycleFunctions('udpate', false, ...handlingFunctions)
  }

  addUpdateFunctions(...handlingFunctions) {
    mustBeDefined(...handlingFunctions)
    mustHaveConstructor(Function, ...handlingFunctions)

    this.registerCycleFunctions('udpate', false, ...handlingFunctions)
  }


  hasEventFunction(eventFlag = mandatory()) {
    return (_.has(this._eventFunctions, eventFlag))
  }


  /* ======= Getters / Setters ======= */
  /* === Globals getter / setter === */
  getGlobal(name = mandatory()) {
    return (this._stateManager.getGlobal(name))
  }

  setGlobal(name = mandatory(), value = mandatory()) {
    return (this._stateManager.setGlobal(name, value))
  }

  get context() {
    if (this._stateManager._taskObject) {
      return (this._stateManager._taskObject.getContext(this))
    }
    return ({
      taskObject: null,
      dataManager: this._stateManager._dataManager,
      scene: this._parent, // TODO Force the ._parent to be the .scene ?
      stateManager: this._stateManager,
      state: this,
      R: this._stateManager.R,
    })
  }

}
