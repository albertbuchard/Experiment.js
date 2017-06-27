/** @module RessourceManager */
import $ from 'jquery'
import Promise from 'bluebird'

import { mandatory, debugError, Deferred } from './utilities'

//eslint-disable-next-line
const yaml = require('js-yaml') // TODO try to find another way... this is too heavy
// const toml = require('toml') // smaller ~100ko unimified


/* JS Class for ressource management */
export default class RessourceManager {
  /**
   * RessourceManager - class which allows to load text file in different allowed
   * format, convert it to javascript objects accessible by proxy allowing for
   * easy localization and debuging.
   * TODO Allow for array as multiline strings
   * TODO Add layout/html loading to RessourceManager
   * TODO Add the image preloader
   * TODO make en/fr/ge etc. keywords able to classify not only strings like so R.get.wolfFmriFirstAppear_(en_)title
   * @constructor
   * @param {...string} filepaths iterable of strings of file paths to load
   *
   * @return {RessourceManager}
   */
  constructor(...filepaths) {
    /* --- Set language --- */
    this.defaultLanguage = 'en'
    this.currentLanguage = this.defaultLanguage

    /* --- Initialize data --- */
    this.data = {}

    /* --- Custom parameters --- */

    /**
     * overwrite - determines default behavior when adding an already existing
     * variables
     *
     * @type {Boolean}
     */
    this.overwrite = true

    /**
     * useAjax - If set to false, files will not be loaded and data can only be added in code
     * using addDataFamilly, or by directly modifying this.data object.
     * Useful to make sure local app do not try to use ajax without a server.
     *
     * @type {Boolean}
     */
    this.useAjax = true


    /* --- Register sprecified file paths --- */
    this.addFiles(filepaths)
  }

  /* === File management === */

  /**
   * addFiles - Add all the files listed, then calls for each the load functions
   * and store it in a promise array.
   * Returns a Promise.all() that is resolves when all files are loaded, parsed
   * and stored.
   *
   * @param {...string} filepaths iterable of file paths
   *
   * @returns {Promise} Promise that will resolve when all files are loaded and
   *                    processed
   */
  addFiles(...filepaths) {
    if (this.useAjax === false) {
      throw new Error("RessourceManager.addFiles: useAjax set to false - can't add files over the network")
    }

    const concatFilepaths = [].concat(...filepaths)

    this.files = []
    const promises = []
    for (let i = 0; i < concatFilepaths.length; i++) {
      if (this.isOfValidFormat(concatFilepaths[i])) {
        this.files[i] = {}
        this.files[i].type = this.getFormat(concatFilepaths[i])
        this.files[i].path = concatFilepaths[i]
        this.files[i].loaded = false // once the raw string is uncovered
        this.files[i].validated = false // once data is parse from the raw string
        this.files[i].added = false // once the parsed data is organized in this.data
        this.files[i].raw = false
        this.files[i].data = null
        promises.push(this.loadFile(i))
      } else {
        console.warn(`RessourceManager.addFiles: invalid type for ${concatFilepaths[i]}`)
      }
    }

    return Promise.all(promises)
  }


  /**
   * loadFile - Performs an jQuery ajax call to get the file at specified index
   * in this.files[fileIndex]. Then call this.parseRaw() on the result.
   * Returns a promise.
   *
   * @param {number} fileIndex Index in the files array
   *
   * @returns {Promise} Will resolve when file processed
   */
  loadFile(fileIndex = mandatory()) {
    const deffered = new Deferred()

    if (typeof this.files[fileIndex] === 'undefined') {
      return deffered.reject('RessourceManager.loadFile: files[fileIndex] is not defined')
    }

    const thisObject = this
    $.ajax({
      type: 'GET',
      url: this.files[fileIndex].path,
      crossDomain: true,
    }).done((data, textStatus, jqXHR) => { //eslint-disable-line
      thisObject.files[fileIndex].loaded = true
      thisObject.files[fileIndex].raw = data

      try {
        thisObject.parseRaw(fileIndex)
      } catch (e) {
        deffered.reject(e)
      } finally {
        deffered.resolve(`RessourceManager.loadFile: ${thisObject.files[fileIndex].path} parsed`)
      }
    })

    return deffered.promise
  }

  parseRaw(fileIndex = mandatory()) {
    if (typeof this.files[fileIndex] === 'undefined') {
      throw new Error('RessourceManager.parseRaw: files[fileIndex] is not defined')
    }

    const file = this.files[fileIndex]

    if (file.raw === null) {
      throw new Error('RessourceManager.parseRaw: file.raw is null or not validated')
    } else if (file.raw.constructor === String) {
      let parser
      let arg = null
      switch (file.type) {
        case 'json':
        // read json
          parser = JSON.parse
          break
        case 'csv':
        // read csv
          parser = $.csv.toObjects
          break
        case 'xml':
        // read xml
          if (window.DOMParser) {
            parser = new DOMParser()
            parser = parser.parseFromString
            arg = 'text/xml'
          } else {
            // Internet Explorer
            parser = new window.ActiveXObject('Microsoft.XMLDOM')
            parser.async = false
            parser = parser.loadXML
          }
          break
        // case 'toml':
        //   parser = toml.parse
        //   break
        case 'yaml':
          parser = yaml.safeLoad
          break
        default:
          throw new Error('RessourceManager.parseRaw: file.type is null or not validated')
      }

      try {
        if (arg) {
          file.data = parser(file.raw, arg)
        } else {
          file.data = parser(file.raw)
        }
      } catch (e) {
        file.validated = false
        file.data = null
        throw new Error(e)
      } finally {
        // file has been correctly parsed and stored in object format
        file.validated = true

        // when a file is parsed, merge the new data
        this.processParsed()
      }
    } else if (file.raw.constructor === Object) {
      file.data = file.raw
      // file has been correctly parsed and stored in object format
      file.validated = true

      // when a file is parsed, merge the new data
      this.processParsed()
    } else {
      throw new Error('RessourceManager.parseRaw: invalid file.raw format')
    }
  }

  processParsed() {
    // first level are data famillies e.g strings, constants, ids, flags etc...
    for (let i = 0; i < this.files.length; i++) {
      if ((this.files[i].validated !== false) && (this.files[i].data) && (!this.files[i].added)) {
        const data = this.files[i].data
        const keys = Object.keys(data)
        for (let j = 0; j < keys.length; j++) {
          this.addDataFamilly(keys[j], data[keys[j]])
        }

        this.files[i].added = true
      }
    }
  }


  /**
   * addDataFamilly - adds the familly if does not exist to the data set, then
   * extend it with the data.
   *
   * @param {String}  familly          Familly name
   * @param {Object}  data             Each property of this object is a variable
   *                                   name
   * @param {Boolean} [overwrite=null] If overwrite is set to true, new values
   *                                   overwrites old one, if false only new
   *                                   variables are kept.
   *
   * @returns {undefined}
   */
  addDataFamilly(familly = mandatory(), data = mandatory(), overwrite = null) {
    let toAdd = data
    let id
    if (data.constructor !== Object) { // If the data is not an object: organize by type
      id = familly
      familly = `${data.constructor.name.toLowerCase()}s`
      toAdd = {
        [id]: data,
      }
    }

    if (typeof this.data[familly] === 'undefined') {
      this.data[familly] = {}
    }

    if (overwrite === null) {
      overwrite = this.overwrite
    }

    if (overwrite) {
      this.data[familly] = this.extend(this.data[familly], toAdd)
    } else {
      this.data[familly] = this.extend(toAdd, this.data[familly])
    }
  }


  /**
   * getNextId - Returns the lenght of the specified familly
   *
   * @param {string} familly
   *
   * @returns {number} 0 if the familly does not exist, the total number of keys otherwise.
   */
  getNextId(familly = mandatory()) {
    if (this.data.hasOwnProperty(familly)) {
      return Object.keys(this.data[familly]).length
    }
    return 0
  }


  /**
   * add - Parse and add the object to the data.
   *
   * @param {Object}  object  Object with either variables at the root
   * e.g {variable: "example"} or with familly name at the root e.g
   * {familly : { variable: "example"}}
   * @param {Boolean} [overwrite=null]  If overwrite is set to true,
   * new values overwrites old one, if false only new variables are kept.
   *
   * @returns {undefined}
   */
  add(object = mandatory(), overwrite = null) {
    if (object.constructor !== Object) {
      throw new Error('RessourceManager.add: cannot add data from a non object')
    }
    const oldOverwrite = this.overwrite
    if (overwrite === null) {
      overwrite = oldOverwrite
    } else {
      this.overwrite = overwrite
    }

    const keys = Object.keys(object)
    for (let i = 0; i < keys.length; i++) {
      if (object[keys[i]].constructor === Object) {
        this.addDataFamilly(keys[i], object[keys[i]])
      } else if (object[keys[i]].constructor === Array) {
        this.addByName(keys[i], object[keys[i]], 'arrays')
      } else {
        this.addByName(keys[i], object[keys[i]])
      }
    }

    this.overwrite = oldOverwrite
  }


  /**
   * addByName - Add a single variable to the data with specified name and value,
   * in the specified familly. If no familly is specified, using strings.
   *
   * @param {string} name              Variable name
   * @param {object} value             Variable value
   * @param {string} [familly=strings] Familly name
   * @param {null}   [overwrite=null]  If overwrite is set to true,new values
   *                                   overwrites old one, if false only new
   *                                   variables are kept.
   *
   * @returns {undefined}
   */
  addByName(name = mandatory(), value = mandatory(), familly = 'strings', overwrite = null) {
    if (typeof this.data[familly] === 'undefined') {
      this.data[familly] = {}
    }

    if (overwrite === null) {
      overwrite = this.overwrite
    }

    if (!(this.data[familly].hasOwnProperty(name)) || overwrite) {
      console.warn(`RessourceManager.addByName: already a ressource named ${name} - Overwriting it.`)
      this.data[familly][name] = value
    }
  }

  /**
   * getFormat - Returns the extension of the file in filepath or an empty string
   * if no etension is found
   *
   * @param {string} filepath
   *
   * @returns {string}
   */
  getFormat(filepath = mandatory()) {
    // fancy way of making sure we substr(index) with
    // index >>> filepath.lenght if no . is found
    // from http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/1203361#1203361
    return filepath.substr((~-filepath.lastIndexOf('.') >>> 0) + 2) // eslint-disable-line
  }

  isOfValidFormat(filepath = mandatory()) {
    const validFormats = ['json', 'csv', 'xml', 'yaml']
    if (validFormats.indexOf(this.getFormat(filepath)) !== -1) {
      return true
    }
    return false
  }

  /**
   * mergeWith - Merge current data with another RessourceManager. Duplicated
   * keys gets overwritten by those of the other RessourceManager.
   *
   * @param {RessourceManager} ressourceManager Another RessourceManager to merge
   *
   */
  mergeWith(ressourceManager = mandatory()) {
    if (ressourceManager.constructor !== RessourceManager) {
      throw new Error('RessourceManager.mergeWith: specified ressourceManager is not of class RessourceManager.')
    }

    const currentFamillies = this.famillies
    const mergingFamillies = ressourceManager.famillies

    for (let i = 0; i < mergingFamillies.length; i++) {
      if (currentFamillies.indexOf(mergingFamillies[i]) === -1) {
        this.data[mergingFamillies[i]] = ressourceManager.data[mergingFamillies[i]]
      } else {
        this.data[mergingFamillies[i]] = this.extend(this.data[mergingFamillies[i]], ressourceManager.data[mergingFamillies[i]])
      }
    }
  }


  /**
   * lookFor - Looks for a variable name in all the famillies
   *
   * @param {string} variable variable to look for
   *
   * @returns {?object} data[familly][variable] if found, or undefined
   */
  lookFor(...variable) {
    let result
    if (variable.length === 1) {
      if (this.data.hasOwnProperty(variable)) {
        result = this.data[variable]
      } else {
        const famillies = this.famillies
        for (let i = 0; i < famillies.length; i++) {
          if (this.data[famillies[i]].hasOwnProperty(variable)) {
            result = this.data[famillies[i]][variable]
            break
          }
        }
      }
    } else if (variable.length > 1) {
      result = {}
      for (let i = 0; i < variable.length; i++) {
        result[variable[i]] = this.lookFor(variable[i])
      }
    }

    return result
  }


  /**
   * Pass in the objects to merge as arguments.
   * For a deep extend, set the first argument to `true`.
   * Adapted from JQuery haters :
   * https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
   *
   * @param {array} args list of objects to extend. If first arguemnt is true, a deep
   * copy is performed.
   *
   * @returns {type} Description
   */
  extend(...args) {
    // Variables
    const extended = {}
    let deep = false
    let i = 0
    const length = args.length

    // Check if a deep merge
    if (Object.prototype.toString.call(args[0]) === '[object Boolean]') {
      deep = args[0]
      i += 1
    }

    // Merge the object into the extended object
    const merge = function (obj) {
      for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          // If deep merge and property is an object, merge properties
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = this.extend(true, extended[prop], obj[prop])
          } else {
            extended[prop] = obj[prop]
          }
        }
      }
    }

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
      const obj = args[i]
      merge(obj)
    }

    return extended
  }


  /**
   * famillies - Description
   *
   * @returns {type} Description
   */
  get famillies() {
    return Object.keys(this.data)
  }

  get has() {
    return new Proxy(this, {
      get(target, pathString) {
        if (typeof target.get[pathString] === 'undefined') {
          return false
        }
        return true
      },
    })
  }

  get get() {
    return new Proxy(this, {
      get(target, pathString) {
        const path = pathString.split('_')
        const famillies = target.famillies
        let lookForLanguage = target.currentLanguage
        let lookForFamilly = 'strings'
        let lookForVariable
        let couldSwapForVariable = false
        for (let i = 0; i < path.length; i++) {
          if (famillies.indexOf(path[i]) !== -1) {
            lookForFamilly = path[i]
            couldSwapForVariable = true
          } else if (path[i].length === 2) {
            lookForLanguage = path[i]
          } else {
            if (typeof lookForVariable !== 'undefined') {
              console.error(`RessourceManager.get: at least two possible variable names into path: ${lookForVariable} and ${path[i]}`)
              return undefined
            }
            lookForVariable = path[i]
          }
        }

        if (typeof lookForVariable === 'undefined') {
          if (couldSwapForVariable) {
            lookForVariable = lookForFamilly
          } else {
            debugError(`RessourceManager.get: no variable name found in ${pathString}`)
            return undefined
          }
        }

        let result
        if ((target.data.hasOwnProperty(lookForFamilly)) && (target.data[lookForFamilly].hasOwnProperty(lookForVariable))) {
          result = target.data[lookForFamilly][lookForVariable]
        } else {
          result = target.lookFor(lookForVariable)
          if (typeof result === 'undefined') {
            console.error(`RessourceManager.get: no ressource for path ${lookForFamilly}.${lookForVariable}`)
            return undefined
          }
        }

        if (result.constructor !== Object) {
          return result
        } else if (result.hasOwnProperty(lookForLanguage)) {
          return result[lookForLanguage]
        } else if (result.hasOwnProperty(target.currentLanguage)) {
          console.warn(`RessourceManager.get: no valid language, defaulting to ${target.currentLanguage}`)
          return result[target.currentLanguage]
        }
        console.warn('RessourceManager.get: no localization language found, returning the whole object')
        return result
      },

    })
  }


}
