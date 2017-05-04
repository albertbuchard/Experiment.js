/** @module EventData */
import _ from 'lodash'
import { mandatory } from './utilities'

/** Class storing all types of event to be handled by a StateManager*/
export default class EventData {
  /**
   *
   * @param {string} flag       flag describing the input type
   * @param {number} happenedAt real time of input
   * @param {object} data       stored data in the event
   *
   */
  constructor(flag = mandatory('flag'), happenedAt = EventData.timeInMs, data = null) { // TODO destructure it ?
    this.flag = flag

    /* --- Set data and happenedAt --- */
    this.BASE_DATA_FIELDS = {
      belongsTo: ['globalLog'], // could be an array of strings
      handledAt: null,
      storedAt: null,
    }


    if (happenedAt.constructor === Object) {
      // Treat it as the data
      if (data === null) {
        this.happenedAt = EventData.timeInMs
        this.data = _.extend(this.BASE_DATA_FIELDS, happenedAt)
      } else {
        throw new Error('EventData.constructor: parameters order or type is invalid.')
      }
    } else {
      this.happenedAt = happenedAt
      this.data = _.extend(this.BASE_DATA_FIELDS, data)
    }


    this.forState = 'any'
    if (this.data.hasOwnProperty('forState')) {
      this.forState = this.data.forState
    }


    /**
     * Wether the event was already handled by the state handleEvent function.
     * @type {Boolean}
     */
    this.handled = false

    /**
     * Wether event data was stored by the stateManager storeInformation function.
     * @type {Boolean}
     */
    this.stored = false
  }

  static get timeInMs() {
    return new Date().getTime()
  }

  get specificData() {
    const dataKeys = Object.keys(this.data)
    const result = {}
    for (let i = 0; i < dataKeys.length; i++) {
      result[dataKeys[i]] = this.data[dataKeys]
    }
    return result
  }

  get formatted() {
    return {
      flag: this.flag,
      forState: this.forState,
      happenedAt: this.happenedAt,
      handledAt: this.data.handledAt,
      storedAt: this.data.storedAt,
      data: JSON.stringify(this.specificData),
    }
  }
}
