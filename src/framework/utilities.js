/**
 * This file should contain utility functions that are independant of the task.
 *
 *
 */
import $ from 'jquery'
import _ from 'lodash'
import math from 'experiment-mathjs'
import Promise from 'bluebird'

import { DEBUG_MODE_ON } from '../config'

Promise.config({
    // Enable warnings
  warnings: false,
    // Enable long stack traces
  longStackTraces: false,
    // Enable cancellation
  cancellation: false,
    // Enable monitoring
  monitoring: false,
})

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
      throw new Error(`Argument ${i} is undefined.`) // TODO transform that into debugError...
    }
  }

  return true
}

/**
 * Creates a new object of class TargetClass = defaultValue.constructor from the object parameter, only if the object is not
 * already an instance of TargetClass. If object is an array, the object is created like so new TargetClass(...object)
 * @method spreadToObject
 * @param  {Object|Array}       object      The object or array to be converted into TargetClass
 * @param  {Object}       defaultValue      If the object is undefined or null this value is returned.
 *                                          If not, the object is Transformed into the TargetClass which is defaultValue.constructor
 * @return {[type]}                         Object of class TargetClass
 */
function spreadToObject(object, defaultValue) {
  if ((typeof object === 'undefined') || (object === null)) {
    return defaultValue
  }

  const TargetClass = defaultValue.constructor
  if (object.constructor === TargetClass) {
    return object
  } else if (object.constructor === Array) {
    return new TargetClass(...object)
  }
  debugWarn('spreadToObject: cannot spread to target class')
  return defaultValue
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

function hasConstructor(constructorObject, ...args) {
  if (args.allHaveConstructor(constructorObject) === false) {
    return false
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
  this.resolve = null
  this.reject = null
  this.resolved = false
  this.rejected = false
  this.status = 0
  /* A newly created Pomise object.
   * Initially in pending state.
   */
  this.promise = new Promise((resolve, reject) => {
    this.resolve = (data) => {
      this.resolved = true
      resolve(data)
    }
    this.reject = (e) => {
      this.rejected = true
      if (e.constructor === String) {
        e = new Error(e)
      }
      reject(e)
    }
  })
  // Object.freeze(this)
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

/* ======= Loading ======= */
function preloadImages(...images) { // TODO make it a RessourceManager function
  const imgArray = []
  const promiseArray = []
  for (const image of images) {
    if (image.constructor === String) {
      const deferred = new Deferred()
      const img = new Image()
      img.src = image
      imgArray.push(img)

      if (img.complete) {
        deferred.resolve()
      } else {
        img.addEventListener('load', function () { this.resolve() }.bind(deferred))
      }

      // $(img).on('load', function () {
      //   this.resolve()
      //   debugError('THIS IS LOAD')
      // }.bind(deferred))

      promiseArray.push(deferred.promise)
    } else {
      debugError('preloadImages: invalid string url ', image)
    }
  }


  return [Promise.all(promiseArray), imgArray]
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

/* ======= BABYLON HELPERS ======= */

function sizeToVec(size = null) {
  mustHaveConstructor(BABYLON.Size, size)
  return (new BABYLON.Vector2(size.width, size.height))
}

function scaleSize(size = null, scale = 1) {
  mustHaveConstructor(BABYLON.Size, size)

  const floatScale = parseFloat(scale)
  if (isNaN(floatScale)) {
    throw new Error(`taskObject.scaleSize: scale is invalid ${scale}`)
  }

  return new BABYLON.Size(size.width * floatScale, size.height * floatScale)
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
    if ((typeof this[i] === 'undefined') || (this[i] === null) || (this[i].constructor !== constructorObject)) {
      return false
    }
  }
  return true
}

Array.prototype.includes = function includes(...array) {
  if ((array.length === 1) && ((array[0].constructor === Set) || (array[0].constructor === Array))) {
    array = array[0]
  }
  // returns a bool wether all value of specified array are in current array
  for (let i = 0; i < array.length; i++) {
    if (this.indexOf(array[i]) === -1) { return false }
  }
  return true
}


/**
 * observe - Starts a repeated check (default to every 500 millisecond) on the attribute of an object until it is set to a
 *           specified value. Returns a promise that will resolve when the value match.
 *           TODO maybe think of creating an _observedValues property somewhere... maybe in a global object
 *
 * @param {string} [attribute=string]   attribute to check
 * @param {boolean} [lookForValue=true] value to match
 * @param {number}  [rate=500]          how many milliseconds between two checks
 *
 * @returns {Promise} Promise will resolve when the attribute has the value lookForValue
 */
Object.defineProperty(Object.prototype, 'observe', {
  value: function observe(attribute = mandatory(), lookForValue = true, rate = 500): Promise {
    const deferred = new Deferred()
    debuglog('Started observing ', this, ' attribute ', attribute, ' for value ', lookForValue, ' current value ', this[attribute])
    const checkForValue = () => {
      if (this[attribute] === lookForValue) {
        debuglog('Finished observing ', this, ' attribute ', attribute, ' for value ', lookForValue, ' current value ', this[attribute])
        deferred.resolve(lookForValue)
      } else {
        debuglog('im still observing ', this, ' attribute ', attribute, ' for value ', lookForValue, ' current value ', this[attribute])
        delay(rate).then(checkForValue)
      }
    }
    checkForValue()
    return deferred.promise
  },
  enumerable: false,
})


/**
 * isSuperset - Returns true if the set is a superset of the specified subset
 *
 * @param {Set} subset a set
 *
 * @returns {bool}
 */
Set.prototype.isSuperset = function (subset) {
  for (const elem of subset) {
    if (!this.has(elem)) {
      return false
    }
  }
  return true
}

Set.prototype.union = function (setB) {
  const union = new Set(this)
  for (const elem of setB) {
    union.add(elem)
  }
  return union
}

Set.prototype.sample = function (n = 1, repeat = true) {
  const result = []
  const array = Array.from(this)
  for (let i = 0; i < n; i++) {
    const index = _.random(0, array.length - 1)
    result.push(array[index])
    if (!repeat) {
      array.splice(index, 1)
    }
  }
  return result
}

/**
 * unite - Performs union in place. Replaces current set.
 *
 * @param {Set} setB
 *
 * @returns {undefined}
 */
Set.prototype.unite = function (setB) {
  for (const elem of setB) {
    this.add(elem)
  }
  return undefined
}

Set.prototype.intersection = function (setB) {
  const intersection = new Set()
  for (const elem of setB) {
    if (this.has(elem)) {
      intersection.add(elem)
    }
  }
  return intersection
}


/**
 * intersect - Performs an intersection in place (replace current set values)
 *
 * @param {Set} setB Description
 *
 * @returns {undefined}
 */
Set.prototype.intersect = function (setB) {
  for (const elem of this) {
    if (!setB.has(elem)) {
      this.remove(elem)
    }
  }
  return undefined
}

Set.prototype.difference = function (setB) {
  const difference = new Set(this)
  for (const elem of setB) {
    difference.delete(elem)
  }
  return difference
}

export {
  Array,
  String,
  Object,
  Number,
  Set,
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
  spreadToObject,
  sizeToVec,
  scaleSize,
  hasConstructor,
  preloadImages,
}
