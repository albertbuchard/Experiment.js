import _ from 'lodash'
import $ from 'jquery'
import Promise from 'bluebird'
import {
  Array,
  String,
  mandatory,
  debuglog,
  debugError,
  delay,
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
     * Keeps the names of the table that need to be pushed
     */
    this.toPush = new Set()

    /** Keeps track of whether the DataManager is waiting to push */
    this.waitForPush = false

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
      throw new Error(`DataManager.addTable: Data table with name '${name}' already exists`)
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
    if (rows.constructor === Object) {
      rows = [rows]
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      if (this.isValidRows(name, row)) {
        const columnNamesRows = new Set(Object.keys(row))
        const columnNamesDataTableWithoutId = new Set(Object.keys(this.dataTables[name]))
        columnNamesDataTableWithoutId.delete('id')

        if ((!columnNamesRows.has('id')) && (this.automaticID)) {
          const id = this.generateIds(name, 1)
          this.dataTables[name].id = this.dataTables[name].id.concat(id)
        }

        for (let i = 0; i < columnNamesDataTableWithoutId.length; i++) {
          this.dataTables[name][columnNamesDataTableWithoutId[i]] = this.dataTables[name][columnNamesDataTableWithoutId[i]].concat(row[columnNamesDataTableWithoutId[i]])
        }
      } else {
        throw new Error('DataManager.addRows: Row is of invalid format.')
      }
    }

    const nrows = (typeof rows.length === 'undefined') ? 1 : rows.length
    debuglog(`DataManager.addRows: added ${nrows} rows to ${name} data table.`)

    this.prepareToPush(name)
  }

  prepareToPush(...names) {
    if (names === []) {
      names = new Set(Object.keys(this.dataTables))
    }

    this.toPush.unite(names)
    if (!this.waitForPush) {
      this.waitForPush = true
      delay(this.addRate).then(() => {
        this.push()
      })
    }
  }

  push() {
    // TODO
    /*
    if (this.interface === this.INTERFACE_REST) {
      for (const table of this.toPush) {
        // get last index pushed to the server
        // get the new data from that index
        // send the data through ajax in json format
        // once the ajax call is done, check status of http
        // if 200 this.waitForPush = false and update the last updated index
        // bind a context with the name of the table
        const [data, lastIndex] = this.getStagedData(table)


        $.ajax({
          url: this.restURL,
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
        })
        .done(function (table, lastIndex, data, status) {
          if (status === 200) {
            this.setLastIndex(table, lastIndex)
            this.toPush.delete(table)
          }
        }.bind(this, table, lastIndex))
        .fail((xhr, status, e) => {

        })
      }
    }

    if (this.interface === this.INTERFACE_GRAPHQL) {
      //
    }*/
  }

  getStagedData(table = mandatory()) {
    // TODO check that the tableis valid
    // check if we have a last index, if not tset it to 0
    // create a new array with the unpushed data
    // lastIndex = table.length
    const data = [table]
    const lastIndex = null
    return [data, lastIndex]
  }

  /**
   * Generate an array of new Ids for the selected data table
   * @param  {string} name        Data table name
   * @param  {Number} numberOfIds Number of Ids to generate
   * @return {array}             Range of ids
   */
  generateIds(name = mandatory(), numberOfIds = 1) {
    if (!(_.has(this.dataTables, name))) {
      throw new Error(`DataManager.generateIds: Data table with name '${name}' does not exists`)
    }

    if (!(_.has(this.dataTables[name], 'id'))) {
      throw new Error(`DataManager.generateIds: Data table with name '${name}' does not have an 'id' field`)
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
      throw new Error(`DataManager.getEmptyRow: Data table with name '${name}' does not exists`)
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
      throw new Error(`DataManager.isValidRows: Data table with name '${name}' does not exists`)
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
        debugError(`DataManager.isValidRows: Invalid row, does not contain column ${columnNamesDataTable[i]} of dataTable${name}`)
        return (false)
      }
    }

    // add check for variable tpe inside the columns

    return (true)
  }

  /* ======== Export formats ======== */
  toCsv(name = mandatory()) {
    if (!(_.has(this.dataTables, name))) {
      throw new Error(`DataManager.toCsv: Data table with name '${name}' does not exists`)
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
      throw new Error(`DataManager.toDataArray: Data table with name '${name}' does not exists`)
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
        throw new Error(`DataManager.toJSON: Data table with name '${name}' does not exists`)
      }

      return JSON.stringify(this.dataTables[name])
    }
    return JSON.stringify(this.dataTables)
  }

  saveData() { // TODO
    // Depends the save mode : API (Needs web) // File system (Electron/Node/Meteor) // Database (Electron/Node/Meteor)
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

  sendData() { // TODO
    // Websocket (like hackathon)
    // TTL
    // Post or get HTTP
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
