import _ from 'lodash'
import Promise from 'bluebird'
import {
  Array,
  String,
  mandatory,
  debuglog,
  debugError,
} from './utilities'

/* Handles your data and logs for you */
export default class DataManager {
  /**
   * DataManager handle data tables and a general log of event. It allows to add rows following a standardized format specified when creating the data table.
   * IDs can be generated automatically (automaticID = true by default) if not specified. And the DataManager has methods to export to different format as well
   * as handling REST api calls, or node-webkit permanent storage capabilities when using NW.js or Electron.
   * @param  {object} parent    Parent object
   * @param  {[type]} subjectID [description]
   * @return {[type]}           [description]
   */
  constructor(parent = mandatory(), subjectID = null) {
    /**
     * DataManager parent object.
     * @type {object}
     */
    this._parent = parent

    /**
     * ID of the subject as defined in the parent subjectID public variable.
     * @type {string}
     */
    if (subjectID) {
      this._subjectID = subjectID
    }

    /**
     * Determine if the data managershould create ID on its own for the added data.
     * @type {Boolean}
     */
    this.automaticID = true

    /* --- Constants --- */

    /**
     * Value to replace NA in the exported data
     * @type {?number}
     * @const
     */
    this.VALUE_FOR_NA = null

    this.FLAG_EVENT_NOFLAG = 'EVENT_UNFLAGGED'

    /* --- Data tables --- */
    /**
     * Object containing all the data tables
     * @type {Object}
     */
    this.dataTables = {}

    /**
     * dataTables.globalLog is the default data table that stores all events of the task with this format:
     * * id : string
     * * flag : string
     * * happenedAt : timeStamp
     * * data : object
     * @private
     */
    const globalLogFields = ['id', 'flag', 'happenedAt', 'data'] // in data object add "handledAt", "storedAt",
    this.addTable('globalLog', globalLogFields)

    /* --- REST API --- */
    /**
     * URL of the page to which data is sent to be stored.
     * Note: Login credentials can't be managed with frontend javascript and security should be integrated with the backend.
     * @type {string}
     */
    this.restURL = null

    /** Determines wether the current environment is Node or the Browser */
    this.isNode = false
    if (typeof module !== 'undefined' && module.exports) {
      this.isNode = true
    }
  }

  /* ======== Data tables function ======== */
  /**
   * [addTable description]
   * @param {[type]} name   [description]
   * @param {[type]} fields [description]
   */
  addTable(name = mandatory(), fields = mandatory()) {
    if (_.has(this.dataTables, name)) {
      throw new Error(`DataManager: Data table with name '${name}' already exists`)
    }

    /* --- Create the dataTable object and define the fields --- */
    this.dataTables[name] = {}
    for (let i = 0; i < fields.length; i++) {
      this.dataTables[name][fields[i]] = []
    }

    if (_.indexOf(fields, 'id') === -1) {
      this.dataTables[name].id = []
    }
  }

  /**
   * Checks if a table of specified name already exist in the dataTables object
   * @param  {string}  name name of the datatable
   * @return {Boolean}
   */
  hasTable(name = mandatory()) {
    if (_.has(this.dataTables, name)) {
      return (true)
    }
    return (false)
  }

  /**
   * Adds a row to the specified data table. Can generate automatically ids if not present in the rows
   * @param {string} name name of the dataTable
   * @param {object} rows Object containing a property for each column of the specified data table. Those can be array but all must have the same length (adding the same number of rows for each columns of data).
   */
  addRows(name = mandatory(), rows = mandatory()) {
    if (this.isValidRows(name, rows)) {
      const columnNamesRows = _.keys(rows)
      const columnNamesDataTableWithoutId = _.without(_.keys(this.dataTables[name]), 'id')

      if ((_.indexOf(columnNamesRows, 'id') === -1) && (this.automaticID)) {
        this.dataTables[name].id = this.dataTables[name].id.concat(this.generateIds(name, rows[columnNamesRows[0].length]))
      }

      for (let i = 0; i < columnNamesDataTableWithoutId.length; i++) {
        this.dataTables[name][columnNamesDataTableWithoutId[i]] = this.dataTables[name][columnNamesDataTableWithoutId[i]].concat(rows[columnNamesDataTableWithoutId[i]])
      }

      const nrows = (typeof rows.length === 'undefined') ? 1 : rows.length
      debuglog(`DataManager: added ${nrows} rows to ${name} data table.`)
    } else {
      throw new Error('DataManager: Row is of invalid format.')
    }
  }

  /**
   * Generate an array of new Ids for the selected data table
   * @param  {string} name        Data table name
   * @param  {Number} numberOfIds Number of Ids to generate
   * @return {array}             Range of ids
   */
  generateIds(name = mandatory(), numberOfIds = 1) {
    if (!(_.has(this.dataTables, name))) {
      throw new Error(`DataManager: Data table with name '${name}' does not exists`)
    }

    if (!(_.has(this.dataTables[name], 'id'))) {
      throw new Error(`DataManager: Data table with name '${name}' does not have an 'id' field`)
    }

    let startId = 0
    if (this.dataTables[name].id.length !== 0) {
      startId = _.max(this.dataTables[name].id) + 1
    }

    return (_.range(startId, startId + numberOfIds))
  }

  /**
   * Generate an object with properties for each columns of the specified data table. The object properties are defined as empty array.
   * Useful function to prepare adequate rows to add to the data.
   * @param  {string} name Name of the model data table.
   * @return {object}      Empty data table row
   */
  getEmptyRow(name = mandatory()) {
    if (!(_.has(this.dataTables, name))) {
      throw new Error(`DataManager: Data table with name '${name}' does not exists`)
    }

    const emptyTable = {}
    const columnNamesDataTable = _.keys(this.dataTables[name])

    for (let i = 0; i < columnNamesDataTable.length; i++) {
      emptyTable[columnNamesDataTable[i]] = []
    }

    return (emptyTable)
  }

  /**
   * Checks if the given rows follow the same structure as the selected datatable.
   * @param  {string}  name Key of the datatable in the dataTables object
   * @param  {object}  rows Object containing on or several rows for each columns.
   * @return {Boolean}
   */
  isValidRows(name = mandatory(), rows = mandatory()) {
    if (!(_.has(this.dataTables, name))) {
      throw new Error(`DataManager: Data table with name '${name}' does not exists`)
    }

    if (typeof rows !== 'object') {
      return (false)
    }

    const columnNamesDataTable = _.keys(this.dataTables[name])
    const columnNamesRows = _.keys(rows)
    let previousLenght = null
    for (let i = 0; i < columnNamesDataTable.length; i++) {
      if (_.indexOf(columnNamesRows, columnNamesDataTable[i]) !== -1) {
        if (rows[columnNamesDataTable[i]].constructor === Array) {
          if (previousLenght === null) {
            previousLenght = rows[columnNamesDataTable[i]].length
          } else {
            const newLenght = rows[columnNamesDataTable[i]].length
            if (previousLenght !== newLenght) {
              /* at least 2 columns do not have the same number of rows */
              return (false)
            }
          }
        } else if (previousLenght !== null) {
          return (false)
        }
      } else if ((columnNamesDataTable[i] !== 'id') && (!this.automaticID)) {
        /* check if the column it did not find was the id column - if automaticID is set to true row is still valid */
        debugError(`DataManager: Invalid row, does not contain column ${columnNamesDataTable[i]} of dataTable${name}`)
        return (false)
      }
    }

    // add check for variable tpe inside the columns

    return (true)
  }

  /* ======== Export formats ======== */
  toCsv(name = mandatory()) {
    if (!(_.has(this.dataTables, name))) {
      throw new Error(`DataManager: Data table with name '${name}' does not exists`)
    }

    const columnNamesDataTable = _.keys(this.dataTables[name])

    const lineArray = []
    for (let i = 0; i < columnNamesDataTable[0].length; i++) {
      const row = []
      for (let j = 0; j < columnNamesDataTable.length; j++) {
        row.push(columnNamesDataTable[j][i])
      }
      const line = row.join(',')
      lineArray.push(i === 0 ? `data:text/csv;charset=utf-8,${line}` : line)
    }

    const csvContent = lineArray.join('\n')

    return (csvContent)
  }

  toDataArray(name = mandatory()) {
    if (!(_.has(this.dataTables, name))) {
      throw new Error(`DataManager: Data table with name '${name}' does not exists`)
    }

    const columnNamesDataTable = _.keys(this.dataTables[name])

    const dataArray = []
    for (let i = 0; i < columnNamesDataTable.length; i++) {
      dataArray.push(columnNamesDataTable[i])
    }

    return (dataArray)
  }

  toJSON(name = null) {
    if (name) {
      if (!(_.has(this.dataTables, name))) {
        throw new Error(`DataManager: Data table with name '${name}' does not exists`)
      }

      JSON.stringify(this.dataTables[name])
    } else {
      JSON.stringify(this.dataTables)
    }
  }

  saveData() {
    /* Check if context is node-webkit (native app) */
    if (typeof require === 'function') {
      /* node-webkit can be used */
      // https://github.com/nwjs/nw.js/wiki/Save-persistent-data-in-app
      try {
        // require('nwjs-osx-menu')(window)
      } catch (error) {
        debugError(error)
      }
    } else if (this.restURL) {
        // $.ajax();
    }
  }

  /* ======== Getters and setters ======== */


  /** The complete log since the creation of the DataManager  */
  get globalLog() {
    return (this._globalLog)
  }

  set globalLog(value) { // eslint-disable-line
    // readonly
  }

  /** Integer value of the next id for the global log */
  get nextLogId() {
    if (this.globalLog.id.length > 0) {
      return (_.max(this.globalLog.id) + 1)
    }
    return (0)
  }


  set nextLogId(value) {
    if (value.constructor === String) {
      this._customNextID = value // TODO to implement
      console.log(`DataManager: next event 'id' will be ${value}`)
    } else {
      throw new Error('DataManager: id should be a string.')
    }
  }

}
