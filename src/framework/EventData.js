/** @module EventData */
import _ from 'lodash'
import { mandatory } from './utilities'

/** Class storing all types of event to be handled by a StateManager*/
export default class EventData {
  /**
   * Maybe make a class out of this...
   * @param {string} flag      flag describing the input type
   * @param {number} timeStamp real time of input
   */
  constructor(flag = mandatory('flag'), timeStamp = mandatory('timeStamp'), data = null) {
    this.flag = flag
    this.happenedAt = timeStamp

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

    const baseData = {
      belongsTo: 'globalLog', // could be an array of strings
      handledAt: null,
      storedAt: null,
    }

    this.data = _.extend(baseData, data)
  }
}
