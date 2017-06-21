import _ from 'lodash'
import $ from 'jquery'
import Promise from 'bluebird' // eslint-disable-line
import { SmartForm, SmartModal } from 'experiment-boxes'
import {
  Array,
  String,
  Deferred,
  mandatory,
  debuglog,
  debugError,
  delay,
  hasConstructor,
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

    /* --- Logs --- */

    /**
     * Logs is an object holding collections that can be of any format
     * Contrary to dataTables those are not constrained
     * @type {Object}
     */
    this.logs = {}

    /* --- Data tables --- */
    /**
     * Object containing all the data tables
     * @type {Object}
     */
    this.dataTables = {}


    this.tablesLastIndex = {}

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
    this.GLOBAL_LOG_FIELDS = ['id', 'flag', 'forState', 'happenedAt', 'handledAt', 'data'] // in data object add "handledAt", "storedAt",
    this.addTable('globalLog', this.GLOBAL_LOG_FIELDS)

    /* --- API --- */
    this.INTERFACE_REST = 'rest'
    this.INTERFACE_GRAPHQL = 'graphql'
    this.INTERFACE_WEBSOCKET = 'websocket'
    this.QUERY_LOGIN = 'login'
    this.QUERY_ADD = 'add'
    this.QUERY_GET_CHECKPOINT = 'getCheckpoints'
    this.QUERY_SET_CHECKPOINT = 'setCheckpoint'
    this.MAX_NUMBER_OF_RETRY = 5

    /**
     * Boolean if set to true, credentials returned from the server are stored in the local storage
     * for automatic identification
     * @type {[type]}
     */
    this.useLocalStorageCredentials = true

    /**
     * Interface used by the data manager to communicate with the api
     * Each type of interface has certain variables.
     *
     * For the REST interface there is the endpoint and credentials
     * [{type: '', variables: {endpoint: ..., credentials: ...}}]
     *
     * @type {array}
     */
    this.connections = []

    this.addRate = 2000

    this.loginDeferred = null
    this.isCurrentlySigningIn = null

    /** Determines wether the current environment is Node or the Browser */
    this.isNode = false
    if (typeof module !== 'undefined' && module.exports) {
      this.isNode = true
    }
  }

  /* ======= Logs function ======= */
  log(data = mandatory(), name = 'global') {
    if (!this.logs.hasOwnProperty(name)) {
      this.logs[name] = []
    }

    this.logs[name].push(data)
  }

  /* ======== Data tables function ======== */
  /**
   * [addTable description]
   * @param {[type]} name   [description]
   * @param {[type]} fields [description]
   */
  addTable(name = mandatory(), fields = mandatory()) {
    try {
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
    } catch (e) {
      debugError(e)
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
   * Returns a set of field names for the specified data tableNames
   * @method fieldNames
   * @param  {string}   [name=mandatory()] table name
   * @return {set}                      set of table field names
   */
  fieldNames(name = mandatory()) {
    if (this.tableNames.has(name)) {
      return new Set(Object.keys(this.dataTables[name]))
    }
    debugError('DataManager.fieldNames: unknown table.')
    return null
  }

  /**
   * Adds a row to the specified data table. Can generate automatically ids if not present in the rows
   * @param {string} name name of the dataTable
   * @param {object} rows Object containing a property for each column of the specified data table. Those can be array but all must have the same length (adding the same number of rows for each columns of data).
   */
  addRows(name = mandatory(), rows = mandatory()) {
    try {
      rows = this.toDataObject(rows, name)
      if (this.isValidRows(rows, name)) {
        const columnNamesRows = new Set(Object.keys(rows))
        const columnNamesDataTableWithoutId = new Set(Object.keys(this.dataTables[name]))
        columnNamesDataTableWithoutId.delete('id')

        if ((!columnNamesRows.has('id')) && (this.automaticID)) {
          const id = this.generateIds(name, 1)
          this.dataTables[name].id = this.dataTables[name].id.concat(id)
        }

        for (const field of columnNamesDataTableWithoutId) {
          this.dataTables[name][field] = this.dataTables[name][field].concat(rows[field])
        }

        const firstField = Array.from(columnNamesRows)[0]
        const nrows = (rows[firstField].constructor !== Array) ? 1 : rows[firstField].length
        debuglog(`DataManager.addRows: added ${nrows} rows to ${name} data table.`)

        return this.prepareToPush(name)
      }
      throw new Error('DataManager.addRows: Row is of invalid format.')
    } catch (e) {
      debugError('DataManager.addRows: ', e)
      return Promise.resolve()
    }
  }

  /**
   * Generate an array of new Ids for the selected data table
   * @param  {string} name        Data table name
   * @param  {Number} numberOfIds Number of Ids to generate
   * @return {array}             Range of ids
   */
  generateIds(name = mandatory(), numberOfIds = 1) {
    try {
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
    } catch (e) {
      debugError(e)
      return null
    }
  }

  /**
   * Generate an object with properties for each columns of the specified data table. The object properties are defined as empty array.
   * Useful function to prepare adequate rows to add to the data.
   * @param  {string} name Name of the model data table.
   * @return {object}      Empty data table row
   */
  getEmptyRow(name = mandatory()) {
    if (!(_.has(this.dataTables, name))) {
      debugError(`DataManager.getEmptyRow: Data table with name '${name}' does not exists`)
      return null
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
  isValidRows(rows = mandatory(), name = null) {
    if ((name !== null) && (!this.tableNames.has(name))) {
      throw new Error(`DataManager.isValidRows: Data table with name '${name}' does not exists`)
    }

    if (rows.constructor !== Object) {
      return (false)
    }

    const columnNamesRows = Object.keys(rows)
    const columnNamesDataTable = (name === null) ? columnNamesRows : Object.keys(this.dataTables[name])

    let previousLenght = null
    for (let i = 0; i < columnNamesDataTable.length; i++) {
      if (_.indexOf(columnNamesRows, columnNamesDataTable[i]) !== -1) {
        if (hasConstructor(Array, rows[columnNamesDataTable[i]])) {
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

    // TODO add check for variable type inside the columns

    return (true)
  }

  /* ======== Export formats ======== */
  /**
   * Transforms a dataArray to a dataObject if it is not already in a dataObject format.
   * A sata array is an array of rows. A data object is an object with a property
   * for each columns. This function also checks the data format is valid by calling
   * isValidRows().
   * @method toDataObject
   * @param  {string}           [name=mandatory()] table name
   * @param  {object|array}     [rows=mandatory()] dataArray or dataObject
   * @return {object}                              dataObject
   */
  toDataObject(rows = mandatory(), name = null) {
    // TODO discuss creating a class representing rows in a formalized way
    if (rows.constructor === Array) {
      if (rows.length === 0) {
        debugError('DataManager.toDataObject: rows is empty.')
        return null
      }

      if (rows[0].constructor !== Object) {
        debugError('DataManager.toDataObject: dataArray rows are invalid.')
        return null
      }

      const fields = Object.keys(rows[0])

      const dataObject = rows[0]
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        for (const field of fields) {
          if (!row.hasOwnProperty(field)) {
            throw new Error(`DataManager.toDataObject: field ${field} absent from at least one row`)
          }
          if (dataObject[field].constructor !== Array) {
            dataObject[field] = []
          }
          dataObject[field].push(row[field])
        }
      }
    }

    if (this.isValidRows(rows, name)) {
      return rows
    }
    debugError('DataManager.toDataObject: Row is of invalid format.')
    return null
  }

  /**
   * [Transforms a dataObject to a dataArray if it is not already in a dataArray format.
   * A data array is an array of rows. A data object is an object with a property
   * for each columns. This function also checks the data format is valid by calling
   * isValidRows().
   * @method toDataArray
   * @param  {[type]}    [name] [description]
   * @param  {[type]}    [rows=mandatory()] [description]
   * @return {[type]}                       [description]
   */
  toDataArray(rows = mandatory(), name = null) {
    if (rows.constructor === Array) {
      if ((rows.length > 0) && (rows[0].constructor === Object)) {
        // seems to be a valid dataArray already
        // TODO do a isValidDataArray function that test every row against the table fields
        return rows
      }
      debugError('DataManager.toDataArray: Row is of invalid format.')
      return null
    }

    if (this.isValidRows(rows, name)) {
      const fields = new Set(Object.keys(rows))
      const numRows = rows[fields[0]].length
      const dataArray = []
      for (let i = 0; i < numRows; i++) {
        const row = {}
        for (const field of fields) {
          if (rows[field].length <= i) {
            debugError(`DataManager.toDataArray: field array ${field} is of invalid size.`)
            return null
          }
          row[field] = rows[field][i]
        }
        dataArray.push(row)
      }

      return dataArray
    }
    debugError('DataManager.toDataArray: Row is of invalid format.')
    return null
  }

  toCsv(data = null, format = 'dataObject') {
    if (data.constructor === String) {
      if (!(this.hasTable(name))) {
        debugError(`DataManager.toCsv: Data table with name '${name}' does not exists`)
        return null
      }
      data = this.dataTables[data]
    }

    data = (format === 'dataObject') ? this.toDataObject(data) : this.toDataArray(data)

    const columnNamesDataTable = Object.keys(data)

    const lineArray = []
    for (let i = 0; i < columnNamesDataTable[0].length; i++) {
      const row = []
      for (let j = 0; j < columnNamesDataTable.length; j++) {
        row.push(`"${columnNamesDataTable[j][i]}"`)
      }
      const line = row.join(',')
      lineArray.push(i === 0 ? `data:text/csv;charset=utf-8,${line}` : line)
    }

    const csvContent = lineArray.join('\n')

    return (csvContent)
  }

  toJSON(data = null, format = 'dataObject') {
    if (data === null) {
      data = {}
      const tableNames = this.tableNames
      if (format === 'dataArray') {
        for (const name of tableNames) {
          data[name] = this.toDataArray(this.dataTables[name])
        }
      } else {
        data = this.dataTables
      }
    } else if ((data.constructor === String) && (this.hasTable(data))) {
      data = this.toDataArray(this.dataTables[data])
    }

    data = (format === 'dataObject') ? this.toDataObject(data) : this.toDataArray(data)

    return JSON.stringify(data)
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

  /* ======= Credentials ======= */
  signInForm(formGenerator = null, message = null) {
    const deferred = new Deferred()
    let form = null
    if (hasConstructor(Function, formGenerator)) {
      form = formGenerator()
      if (!hasConstructor(SmartForm, form)) {
        form = null
        debugError('DataManager.signInForm: sign in form function does not return a SmartForm')
      }
    }

    if (form === null) {
      // generate a basic form with userId and password
      const fields = {
        userId: {
          type: 'input', // field type: input, select, textaera, slider, radio
          constraints: 'alpha; length:10,300', // list of constraints that will be automatically verified: mandatory; alpha; numeric; length:XX; contains:a,b,@,.;
          authorizedValues: null, // athorized values
          parent: null,
          title: 'Enter your UserId',
        },
        password: {
          type: 'input', // field type: input, select, textaera, slider, radio
          constraints: 'alpha; length:6,300', // list of constraints that will be automatically verified: mandatory; alpha; numeric; length:XX; contains:a,b,@,.;
          authorizedValues: null, // athorized values
          parent: null,
          title: 'Enter your password:',
        },
      }
      const options = { fields, title: 'Login Form', format: 'topCentralSmall' }
      form = new SmartForm(options)
    }

    if (hasConstructor(String, message)) {
      const html = `<div class="col-sm-10 bindedfield-errordiv" >
                      <i class="glyphicon glyphicon-remove"></i><span class="bindedfield-error" style="font-size: 15px;">${message}</span>
                    </div>`
      form.prepend(html)
    }

    form.buttonText = 'OK'
    form.promise.then((fields) => {
      const values = {}
      for (const field in fields) {
        if ((fields.hasOwnProperty(field) && fields[field].value)) {
          values[field] = fields[field].value
        }
      }
      deferred.resolve(values)
    })

    return deferred
  }

  login(connection = mandatory(), variables = null, deferred = null) {
    if ((hasConstructor(Deferred, this.loginDeferred) && this.loginDeferred.pending)) {
      if (deferred !== this.loginDeferred) {
        return this.loginDeferred.promise
      }
      deferred = this.loginDeferred
    } else {
      if (!hasConstructor(Deferred, deferred)) {
        deferred = new Deferred()
      }
      this.loginDeferred = deferred
    }

    if (deferred.status > this.MAX_NUMBER_OF_RETRY) {
      deferred.reject('DataManager.login: login failure - reach max retry.')
    }
    deferred.status += 1

    if (hasConstructor(Deferred, this.isCurrentlySigningIn) && this.isCurrentlySigningIn.pending) {
      return this.isCurrentlySigningIn.promise
    }

      // an interface needs to have a login endpoint to be used in this function
      // ((connection.constructor === Object) && (typeof connection.variables !== 'undefined') && (typeof connection.variables.login !== 'undefined') && (connection.variables.login.constructor === String)) {
    if ((_.has(connection, 'login')) && (connection.login.constructor === String)) {
      if (variables === null) {
        const errorMessage = connection.lastErrorMessage || null
        const formDeferred = this.signInForm(connection.signInForm, errorMessage)
        this.isCurrentlySigningIn = formDeferred
        return formDeferred.promise.then((credentials) => {
          deferred.status = 0
          return this.login(connection, credentials, deferred)// call a smartForm modal with userId and password
        })
      }
        // perform ajax with the variables as credentials
      const data = {
        interface: connection.type,
        credentials: variables,
        query: connection.login,
      }

          // send the data through ajax in json format
      $.ajax({
        url: connection.endpoint,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
      })
          .done(function done(data, status) {
            // if success set credentials inside the connection
            connection.credentials = data.credentials
            connection.loggedIn = true
            if (this.useLocalStorageCredentials) {
              this.local(connection.name, { credentials: data.credentials })
            }
            debuglog(`DataManager.push: successful ajax call with status ${status}`, data)
            deferred.resolve()
          }.bind(this))
          .fail(function (connection, xhr) {
            // if failure call login with no variables to call a smartForm
            const json = xhr.responseJSON || { message: '', tooMuchTry: false }
            const message = json.message
            debugError(`DataManager.push: error during login with message ${message}`)
            connection.loggedIn = false
            connection.lastErrorMessage = message
            if (json.tooMuchTry) {
              const modal = new SmartModal('centralSmall')
              modal.title = 'Login Failure'
              modal.content = 'Too many login failure. Wait 5min before trying to log again.'
              deferred.reject('DataManager.login: Too many login failure. Wait 5min before trying to log again.')
            } else {
              this.login(connection, null, deferred)
            }
          }.bind(this, connection))
    } else {
      deferred.reject(`DataManager.login: no valid login enpoint for the connection ${connection.name}`)
    }


    return deferred.promise
  }

  /* ======= Checkpoints ======= */
  query(query = mandatory(), variables = {}, connection = null, deferred = new Deferred()) {
    if (deferred.status > this.MAX_NUMBER_OF_RETRY) {
      deferred.reject('DataManager.query: query failure - reach max retry.', query)
    } else {
      deferred.status += 1

      if (connection === null) {
        if (this.connections.length > 0) {
          connection = this.connections[0]
        } else {
          deferred.reject('DataManager.query: no valid connection available.')
        }
      }

      if (connection.type === this.INTERFACE_REST) {
        // build the data object to send
        const data = {
          interface: connection.type,
          credentials: connection.credentials,
          query,
          variables,
        }

        // send the data through ajax in json format
        $.ajax({
          url: connection.endpoint,
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
        })
        .done((data, status) => {
          // once the ajax call is done, check status of http
          debuglog(`DataManager.push: successful ajax call with status ${status}`, data)
          deferred.resolve(data)
        })
        .fail((xhr) => {
          const json = xhr.responseJSON || { message: '', shouldLog: false }
          if (json.shouldLog) {
            debugError('DataManager.push: user is not logged in -- will call the log function.')
            this.login(connection).then(() => { this.query(query, variables, connection, deferred) })
          } else {
            debugError('DataManager.push: could not perform query -- will retry', JSON.stringify(query), json.message)
            this.query(query, variables, connection, deferred)
          }
        })
      } else {
        deferred.reject('DataManager.query: unsupported connection.')
      }
    }


    return deferred.promise
  }

  /* ======= Push ======= */

  /**
   * Sets or retrieve a variable from local storage in a JSON format
   * @method local
   * @param  {string} [variable=null]        variable name, if not specified returns the whole localStorage object
   * @param  {any} [data=null]               if specified, the variable will be set and not retrieved
   * @return {!any}                          undefined if set, variable value if get
   */
  local(variable = null, data = null) {
    if (variable === null) {
      return localStorage
    }

    if (data !== null) {
      localStorage[variable] = JSON.stringify(data)
      return undefined
    }
    if (!localStorage.hasOwnProperty(variable)) {
      debugError(`DataManager.local: localStorage has no variable named ${variable}`)
      return undefined
    }

    try {
      const data = JSON.parse(localStorage[variable])
      return data
    } catch (e) {
      debugError('DataManager.local: variable is probably not JSON ', e)
    }
    return localStorage[variable]
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
    if ((!hasConstructor(Deferred, this.pushDeferred)) || (!this.pushDeferred.pending)) {
      this.pushDeferred = new Deferred()
    }

    return this.pushDeferred
  }

  getStagedData(table = mandatory(), format = 'dataArray') {
    // check that the table is valid
    let returned = [[], 0]
    try {
      if (!this.tableNames.has(table)) {
        throw new Error('DataManager.getStagedData: unknown table.')
      }

      // check if we have a last index, if not set it to 0
      if (Object.keys(this.tablesLastIndex).indexOf(table) === -1) {
        this.tablesLastIndex[table] = 0
      }

      const dataTable = this.dataTables[table]
      const fields = this.fieldNames(table)
      const numRows = dataTable[fields.sample()].length
      const lastIndex = this.tablesLastIndex[table]

      // create a new array with the unpushed data (without cloning the parent array)
      const data = format === 'dataArray' ? [] : {}
      let j = 0
      for (let i = lastIndex; i < numRows; i++) {
        if (format === 'dataArray') {
          const row = {}
          for (const field of fields) {
            if (field === 'id') continue

            if (dataTable[field].length <= i) {
              throw new Error(`DataManager.toDataArray: field array ${field} is of invalid size.`)
            }
            row[field] = dataTable[field][i]
          }

          data.push(row)
        } else {
          for (const field of fields) {
            if (field === 'id') continue

            if (!data.hasOwnProperty(field)) {
              data[field] = []
            }
            if (dataTable[field].length <= i) {
              throw new Error(`DataManager.getStagedData: field ${field} of invalid size in the DataManager.`)
            }
            data[field][j].push(dataTable[field][i])
          }
          j += 1
        }
      }
      returned = [data, numRows]
    } catch (e) {
      debugError(e)
    }
    return returned
  }

  push() {
    if ((hasConstructor(Deferred, this.loginDeferred) && this.loginDeferred.pending)) {
      delay(this.addRate).then(() => {
        this.push()
      })
    } else {
      this.waitForPush = 0
      for (let i = 0; i < this.connections.length; i++) {
        const connection = this.connections[i]
        if (connection.type === this.INTERFACE_REST) {
          const toPushSize = this.toPush.length
          let pushed = 0
          const pushDeferred = this.pushDeferred
          const checkIfPushed = function () {
            if (pushed >= toPushSize - 1) {
              pushDeferred.resolve()
            }
          }
          for (const table of this.toPush) {
            // get last index pushed to the server
            // get the new data from that index
            if ((this.useLocalStorageCredentials) && (typeof this.local(connection.name) !== 'undefined') && (this.local(connection.name).hasOwnProperty('credentials'))) {
              connection.credentials = this.local(connection.name).credentials
            }

            const [rows, lastIndex] = this.getStagedData(table)
            const data = {
              interface: connection.type,
              credentials: connection.credentials,
              query: connection.add,
              variables: {
                table,
                rows,
              },
            }

            // send the data through ajax in json format
            $.ajax({
              url: connection.endpoint,
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
            })
            .done(function (table, lastIndex, data, status) {
              // once the ajax call is done, check status of http
              // if 200 this.waitForPush = false and update the last updated index
              // bind a context with the name of the table
              pushed += 1
              checkIfPushed()
              this.tablesLastIndex[table] = lastIndex
              this.toPush.delete(table)
              debuglog(`DataManager.push: successful ajax call with status ${status}`, data)
            }.bind(this, table, lastIndex))
            .fail(function (connection, table, xhr) {
              const json = xhr.responseJSON || { message: '', shouldLog: false }
              if (json.shouldLog) {
                debugError('DataManager.push: user is not logged in -- will call the log function.')
                // will pop a form to log
                this.login(connection).then(() => { this.prepareToPush(table) })
              } else {
                debugError(`DataManager.push: could not push ${table} -- will retry`, json.message)
                this.prepareToPush(table)
              }
            }.bind(this, connection, table))
          }
        }

        if (connection.type === this.INTERFACE_GRAPHQL) {
          //
        }
      }
    }
  }

  setConnection(variables = mandatory()) {
    const deferred = new Deferred()
    if ((!variables.hasOwnProperty('type')) || (variables.type === this.INTERFACE_REST)) {
      const defaultVariables = {
        type: this.INTERFACE_REST,
        name: null,
        endpoint: null,
        credentials: null,
        loggedIn: false,
        add: this.QUERY_ADD,
        checkpoint: this.QUERY_CHECKPOINT,
        login: this.QUERY_LOGIN,
        // TODO rest of basic api
      }

      const connection = _.extend(defaultVariables, variables)
      if (connection.endpoint !== null) {
        connection.name = connection.name || connection.type

        if ((connection.credentials === null) && (this.useLocalStorageCredentials && (typeof this.local(connection.name) !== 'undefined') && (this.local(connection.name).hasOwnProperty('credentials')))) {
          connection.credentials = this.local(connection.name).credentials
        }

        if (connection.credentials !== null) {
          this.login(connection, connection.credentials)
          .then(() => {
            this.connections.push(connection)
            deferred.resolve(connection)
          })
          .catch((e) => {
            deferred.reject(e)
          })
        } else {
          this.connections.push(connection)
          deferred.resolve(connection)
        }
      } else {
        deferred.reject('DataManager.setInterface: needs at least an endpoint.')
      }
    } else {
      deferred.reject('DataManager.setInterface: unsupported connection type.')
    }
    return deferred.promise
  }

  /* ======== Getters and setters ======== */


  /**
   * tableNames - readonly - Set of table names.
   *
   * @returns {Set}
   */
  get tableNames() {
    return (new Set(Object.keys(this.dataTables)))
  }

  set tableNames(value) {
    throw new Error('DataManager.tableNames: readonly.')
  }

  /**
   * globalLog - The complete log since the creation of the DataManager
   *
   * @returns {Object}
   */
  get globalLog() {
    return (this._globalLog)
  }

  set globalLog(value) {
    throw new Error('DataManager.tableNames: readonly.')
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
