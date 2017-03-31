/**
 * This file should contain utility functions that are independant of the task.
 *
 *
 */

import _ from 'lodash'
import math from 'experiment-mathjs'
import Promise from 'bluebird'

import { DEBUG_MODE_ON } from '../config'

/**
 * noop - just your friendly empty function
 *
 * @returns {undefined}
 */
function noop() {}


/**
 * Debug functions
 */
const debuglog = DEBUG_MODE_ON ? console.log.bind(console) : noop
const debugWarn = DEBUG_MODE_ON ? console.warn.bind(console) : noop
const debugError = DEBUG_MODE_ON ? console.error.bind(console) : noop

/**
 * Allows to return an error for missing parameters.
 * @param  {String} param Optional string to add after the error.
 */
function mandatory(param = '') {
  throw new Error(`Missing parameter ${param}`)
}

/**
 * Checks the type of all given parameters, return an error if one is undefined.
 * @param  {...object} args List of arguments to checks
 * @return {bool}      true if all arguments are defined
 */

function mustBeDefined(...args) {
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'undefined') {
      throw new Error(`Argument ${i} is undefined.`)
    }
  }

  return true
}

/**
 * Checks the constructor of all given parameters, return an error if one is not as specified.
 * @param  {object} constructorObject constructor
 * @param  {...object} args         list of arguments to check
 * @return {bool}                   true if all arguments have specified constructorObject as constructor
 */

function mustHaveConstructor(constructorObject, ...args) {
  if (args.allHaveConstructor(constructorObject) === false) {
    throw new Error('Wrong constructor in arguments.')
  }

  return true
}

/**
 * Returns true if o looks like a promise. From the es-promisify package.
 * https://github.com/digitaldesignlabs/es6-promisify/
 * @param  {object} o Object to test
 * @return {bool}   True if looks like a promise, false otherwise
 */
function looksLikeAPromise(o) {
  return o && typeof o.then === 'function' && typeof o.catch === 'function'
}


/**
 * From http://www.datchley.name/promise-patterns-anti-patterns/
 * @param  {int} ms delay in ms
 * @return {promise} promise which will resolve in delay ms
 */
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * @param  {int} min min delay in ms
 * @param  {int} max max delay in ms
 * @return {promise} promise which will resolve in delay ms
 */
function jitter(min = mandatory(), max = mandatory()) {
  return new Promise((resolve) => {
    const randomDuration = _.random(min, max)
    setTimeout(resolve, randomDuration)
  })
}

/**
 * Recurse on a given promise chain
 * @param  {Promise} promise Promise to recurse on
 * @param  {numeric} amount  amount of time to recurse
 * @return {Promise}         Promise
 */
function recurse(promiseGenerator = mandatory(),
  amount = mandatory(),
  target = this, args = [],
  concatOnArray = []) {
  // Base case - just return the promisified result
  if (amount === 0) {
    return new Promise((resolve) => {
      resolve(concatOnArray)
    })
  }


  const next = promiseGenerator.apply(target, args).then((r) => {
    concatOnArray = concatOnArray.concat(r)
    return (recurse(promiseGenerator, amount - 1, target, args, concatOnArray))
  })

  return next
}

/**
 * Compatible helper to replace the now defunc Promise.defer()
 * @method Deferred
 */
function Deferred() {
  // update 062115 for typeof
  // if (typeof (Promise) !== 'undefined' && Promise.defer) {
  //   //need import of Promise.jsm for example: Cu.import('resource:/gree/modules/Promise.jsm');
  //   return Promise.defer();
  // } else if (typeof (PromiseUtils) != 'undefined' && PromiseUtils.defer) {
  //   //need import of PromiseUtils.jsm for example: Cu.import('resource:/gree/modules/PromiseUtils.jsm');
  //   return PromiseUtils.defer();
  // } else {
  /* A method to resolve the associated Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param {anything} value : This value is used to resolve the promise
   * If the value is a Promise then the associated promise assumes the state
   * of Promise passed as value.
   */
  this.resolve = null

  /* A method to reject the assocaited Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param {anything} reason: The reason for the rejection of the Promise.
   * Generally its an Error object. If however a Promise is passed, then the Promise
   * itself will be the reason for rejection no matter the state of the Promise.
   */
  this.reject = null

  /* A newly created Pomise object.
   * Initially in pending state.
   */
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })
  Object.freeze(this)
  // }
}

/**
 * From http://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
 * TODO Pull request math js
 * @param  {object} content Repeated sequence
 * @param  {int} count   Number of time the sequence must be repeat
 * @return {array}       Array with repeated sequence
 */
function rep(content = mandatory(), count = mandatory()) {
  let result = []
  if (typeof (content) === 'function') {
    for (let i = 0; i < count; i++) {
      result = result.concat(content(i))
    }
  } else {
    for (let i = 0; i < count; i++) {
      result = result.concat(content)
    }
  }
  return result
}

function samplePermutation(sequence = mandatory(), repetition = false, n = null) {
  if (sequence.constructor !== Array) {
    throw new Error('samplePermutation: sequence needs to be an array.')
  }

  if (n === null) {
    n = sequence.length
  }

  const copy = sequence.slice(0)
  let permutation = []
  let add
  while ((repetition && (permutation.length < n)) || ((!repetition) && (copy.length))) {
    const index = Math.floor(Math.random() * copy.length)
    if (repetition) {
      add = copy[index]
    } else {
      add = copy.splice(index, 1)
    }
    permutation = permutation.concat(add)
  }

  return (permutation)
}

/* =============== Personalized Matrix Functions =============== */
function matrix(rows = mandatory(), cols = mandatory(), fill = 0) {
  const matrixObject = []

  for (let i = 0; i < rows; i++) {
    matrixObject[i] = []
    for (let j = 0; j < cols; j++) {
      matrixObject[i][j] = fill
    }
  }

  return (matrixObject)
}

function getRow(matrixObject = mandatory(), rowIndex = mandatory()) {
  matrixObject = math.matrix(matrixObject)
  const size = (matrixObject.size())[0]
  const row = math.subset(matrixObject, math.index(rowIndex, math.range(0, size)))

  return (row)
}

function rowSum(matrixObject = mandatory(), rows = null) {
  matrixObject = math.matrix(matrixObject)
  const size = (matrixObject.size())[0]
  if (rows === null) {
    rows = math.range(0, size - 1)
  }
  if (rows.constructor !== Array) {
    rows = [rows]
  }

  const rowSumArray = []
  for (let i = 0; i < rows.length; i++) {
    rowSumArray.push(math.sum(getRow(matrixObject, rows[i])))
  }

  return (rowSumArray)
}

// set or get the diagonal of a matrix
function diag(matrixObject = mandatory(), setTo = null): Array {
  const rows = matrixObject.length
  // const cols = matrixObject[0].length

  const diagonalValues = []

  for (let i = 0; i < rows; i++) {
    if (setTo) {
      matrixObject[i][i] = setTo
    }
    diagonalValues.push(matrixObject[i][i])
  }

  return ([diagonalValues, matrixObject])
}

/* ======= Number functions ======= */
Number.prototype.boundTo = function boundTo(min = mandatory(), max = mandatory()) {
  mustHaveConstructor(Number, min, max)
  return Math.max(Math.min(this, max), min)
}


/* =============== String functions =============== */

/**
 * Find all the positions of a needle in a haystack string
 * @param  {string} needle   string to find
 * @param  {string} haystack string to scan
 * @return {Array}  Either -1 if no match is found or an array containing the indicies
 */
String.prototype.indicesOf = function indicesOf(needle = mandatory()): Array<number> | -1 {
  const haystack = this
  const indices = []
  for (let i = 0; i < haystack.length; i++) {
    if ((haystack.substr(i, needle.length)) === needle) {
      indices.push(i)
    }
  }

  if (indices.length) {
    return (indices)
  }
  return (-1)
}

/* =============== Array prototype overload =============== */
Array.prototype.hasNeighbouringRepeat = function hasNeighbouringRepeat() {
  let previousElement = null
  for (let i = 0; i < this.length; i++) {
    if (previousElement === this[i]) {
      return true
    }
    previousElement = this[i]
  }
  return false
}

Array.prototype.toCsv = function toCsv() {
  const lineArray = []
  this.forEach((array, index) => {
    const line = array.join(',')
    lineArray.push(index === 0 ?
      `data:text/csv;charset=utf-8,${line}` :
      line)
  })
  const csvContent = lineArray.join('\n')

  return (csvContent)
}

Array.prototype.uniqueValues = function uniqueValues() {
  const u = {}
  const a = []

  for (let i = 0; i < this.length; i++) {
    if (!u.hasOwnProperty(this[i])) {
      a.push(this[i])
      u[this[i]] = 1
    }
  }
  return a
}

Array.prototype.min = function min() {
  const u = this.uniqueValues()

  if (u.allHaveConstructor(Number)) {
    let minValue = u[0]
    for (let i = 0; i < u.length; i++) {
      if (u[i] < minValue) { minValue = u[i] }
    }
    return minValue
  }
  return NaN
}

Array.prototype.max = function max() {
  const u = this.uniqueValues()

  if (u.allHaveConstructor(Number)) {
    let maxValue = u[0]
    for (let i = 0; i < u.length; i++) {
      if (u[i] > maxValue) { maxValue = u[i] }
    }
    return maxValue
  }
  return NaN
}


/**
 * multisplice - from http://upshots.org/actionscript/javascript-splice-array-on-multiple-indices-multisplice
 * With some es6 magic
 *
 * @returns {Array}
 */
Array.prototype.multisplice = function (...args) {
  args.sort((a, b) => a - b)
  const spliced = []
  for (let i = 0; i < args.length; i++) {
    const index = args[i] - i
    spliced.push(this.splice(index, 1)[0])
  }
  return spliced
}

/**
 * Return an array of objects with x and y property. Y is taken as the values of the array, and x is either the index if null, or the values of the specified array.
 * @param  {?array} x X values, if null, the index is taken as x
 * @return {array}   Array of x and y [{x: x[i], y: this[i]},...]
 */
Array.prototype.getXY = function getXY(x = null): Array {
  if (x !== null) {
    if (x.constructor !== Array) {
      throw new Error('Array.getXY: x needs to be an array.')
    }

    if (x.length !== this.length) {
      throw new Error('Array.getXY: x needs to be of the same length as array')
    }
  } else {
    debuglog('Array.getXY: x === null, x will be taken as the index of each value.')
  }

  const xyArray = []
  for (let i = 0; i < this.length; i++) {
    if (x !== null) {
      xyArray.push({
        x: x[i],
        y: this[i],
      })
    } else {
      xyArray.push({
        x: i,
        y: this[i],
      })
    }
  }

  return (xyArray)
}

Array.prototype.average = function average(type = 'global', size = 5): ?Number {
  if (type === 'global') {
    const sum = this.sum()
    if (!isNaN(sum)) {
      return (sum / this.length)
    }
  } else if (type === 'sliding') {
    const windowAverages = []
    for (let i = 0; i < this.length; i++) {
      let endIndex = i + size
      if (endIndex > this.length) {
        endIndex = this.length
      }
      const windowArray = this.slice(i, endIndex)

      const sum = windowArray.sum()
      if (!isNaN(sum)) {
        windowAverages.push(sum / windowArray.length)
      }
    }
    return (windowAverages)
  } else if (type === 'bins') {
    const bins = []
    let position = 0
    while (position < this.length) {
      const endIndex = position + size
      if (endIndex > this.length) {
        break
      }

      const windowArray = this.slice(position, endIndex)

      const sum = windowArray.sum()
      if (!isNaN(sum)) {
        bins.push(sum / windowArray.length)
      }

      position = endIndex
    }

    return (bins)
  }

  return undefined
}

Array.prototype.sum = function sum() {
  let total = 0
  for (let i = 0; i < this.length; i++) {
    if (isNaN(this[i])) {
      return (NaN)
    }
    total += this[i]
  }
  return (total)
}

Array.prototype.integrate = function integrate() {
  let sum = 0
  const cumulativeArray = []
  for (let i = 0; i < this.length; i++) {
    if (isNaN(this[i])) {
      return (NaN)
    }

    sum += this[i]
    cumulativeArray.push(sum)
  }
  return (cumulativeArray)
}

Array.prototype.equals = function equals(value) {
  const resultVector = []
  let result = null
  for (let i = 0, l = this.length; i < l; ++i) {
    result = (this[i] === value)
    resultVector.push(result)
  }
  return resultVector
}

Array.prototype.ntrue = function ntrue() {
  let resultSum = 0
  let result = null
  for (let i = 0, l = this.length; i < l; ++i) {
    result = (this[i] === true) ?
      1 :
      0
    resultSum += result
  }
  return resultSum
}

Array.prototype.nEquals = function nEquals(value) {
  return this.equals(value).ntrue()
}

Array.prototype.indicesOf = function indicesOf(value) {
  const resultVector = []
  for (let i = 0, l = this.length; i < l; i++) {
    if (this[i] === value) {
      resultVector.push(i)
    }
  }
  return resultVector
}

Array.prototype.exclude = function exclude(values) {
  // returns an array without exluded values
  const resultVector = []
  for (let i = 0, l = this.length; i < l; ++i) {
    let addit = true
    for (let j = 0; j < values.length; ++j) {
      if (this[i] === values[j]) {
        addit = false
      }
    }
    if (addit) {
      resultVector.push(this[i])
    }
  }
  return resultVector
}

Array.prototype.allHaveConstructor = function allHaveConstructor(constructorObject) {
  for (let i = 0; i < this.length; i++) {
    if (this[i].constructor !== constructorObject) {
      return false
    }
  }
  return true
}

Array.prototype.includes = function includes(array) {
  // returns a bool wether all value of specified array are in current array
  for (let i = 0; i < array.length; i++) {
    if (this.indexOf(array[i]) === -1) { return false }
  }
  return true
}

export {
  Array,
  String,
  Number,
  diag,
  rowSum,
  getRow,
  matrix,
  samplePermutation,
  rep,
  Deferred,
  recurse,
  jitter,
  delay,
  looksLikeAPromise,
  mustHaveConstructor,
  mustBeDefined,
  mandatory,
  debuglog,
  debugWarn,
  debugError,
  noop,
}
