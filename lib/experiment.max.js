(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("experiment-babylon-js"), require("jQuery"), require("experiment-boxes"), require("experiment-mathjs"));
	else if(typeof define === 'function' && define.amd)
		define("experiment", ["lodash", "experiment-babylon-js", "jQuery", "experiment-boxes", "experiment-mathjs"], factory);
	else if(typeof exports === 'object')
		exports["experiment"] = factory(require("lodash"), require("experiment-babylon-js"), require("jQuery"), require("experiment-boxes"), require("experiment-mathjs"));
	else
		root["experiment"] = factory(root["_"], root["BABYLON"], root["jQuery"], root["experimentBoxes"], root["math"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preloadImages = exports.hasConstructor = exports.scaleSize = exports.sizeToVec = exports.spreadToObject = exports.noop = exports.debugError = exports.debugWarn = exports.debuglog = exports.mandatory = exports.mustBeDefined = exports.mustHaveConstructor = exports.looksLikeAPromise = exports.delay = exports.jitter = exports.recurse = exports.Deferred = exports.rep = exports.samplePermutation = exports.matrix = exports.getRow = exports.rowSum = exports.diag = exports.Set = exports.Number = exports.Object = exports.String = exports.Array = undefined;

var _jquery = __webpack_require__(8);

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentMathjs = __webpack_require__(13);

var _experimentMathjs2 = _interopRequireDefault(_experimentMathjs);

var _bluebird = __webpack_require__(2);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = __webpack_require__(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * This file should contain utility functions that are independant of the task.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     *
                                                                                                                                                                                                     */


_bluebird2.default.config({
  // Enable warnings
  warnings: false,
  // Enable long stack traces
  longStackTraces: false,
  // Enable cancellation
  cancellation: false,
  // Enable monitoring
  monitoring: false
}

/**
 * noop - just your friendly empty function
 *
 * @returns {undefined}
 */
);function noop() {}

/**
 * Debug functions
 */
var debuglog = _config.DEBUG_MODE_ON ? console.log.bind(console) : noop;
var debugWarn = _config.DEBUG_MODE_ON ? console.warn.bind(console) : noop;
var debugError = _config.DEBUG_MODE_ON ? console.error.bind(console) : noop;

/**
 * Allows to return an error for missing parameters.
 * @param  {String} param Optional string to add after the error.
 */
function mandatory() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  throw new Error('Missing parameter ' + param);
}

/**
 * Checks the type of all given parameters, return an error if one is undefined.
 * @param  {...object} args List of arguments to checks
 * @return {bool}      true if all arguments are defined
 */

function mustBeDefined() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] === 'undefined') {
      throw new Error('Argument ' + i + ' is undefined.'); // TODO transform that into debugError...
    }
  }

  return true;
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
  if (typeof object === 'undefined' || object === null) {
    return defaultValue;
  }

  var TargetClass = defaultValue.constructor;
  if (object.constructor === TargetClass) {
    return object;
  } else if (object.constructor === Array) {
    return new (Function.prototype.bind.apply(TargetClass, [null].concat(_toConsumableArray(object))))();
  }
  debugWarn('spreadToObject: cannot spread to target class');
  return defaultValue;
}

/**
 * Checks the constructor of all given parameters, return an error if one is not as specified.
 * @param  {object} constructorObject constructor
 * @param  {...object} args         list of arguments to check
 * @return {bool}                   true if all arguments have specified constructorObject as constructor
 */

function mustHaveConstructor(constructorObject) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (args.allHaveConstructor(constructorObject) === false) {
    throw new Error('Wrong constructor in arguments.');
  }

  return true;
}

function hasConstructor(constructorObject) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  if (args.allHaveConstructor(constructorObject) === false) {
    return false;
  }

  return true;
}

/**
 * Returns true if o looks like a promise. From the es-promisify package.
 * https://github.com/digitaldesignlabs/es6-promisify/
 * @param  {object} o Object to test
 * @return {bool}   True if looks like a promise, false otherwise
 */
function looksLikeAPromise(o) {
  return o && typeof o.then === 'function' && typeof o.catch === 'function';
}

/**
 * From http://www.datchley.name/promise-patterns-anti-patterns/
 * @param  {int} ms delay in ms
 * @return {promise} promise which will resolve in delay ms
 */
function delay(ms) {
  return new _bluebird2.default(function (resolve) {
    setTimeout(resolve, ms);
  });
}

/**
 * @param  {int} min min delay in ms
 * @param  {int} max max delay in ms
 * @return {promise} promise which will resolve in delay ms
 */
function jitter() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory();

  return new _bluebird2.default(function (resolve) {
    var randomDuration = _lodash2.default.random(min, max);
    setTimeout(resolve, randomDuration);
  });
}

/**
 * Recurse on a given promise chain
 * @param  {Promise} promise Promise to recurse on
 * @param  {numeric} amount  amount of time to recurse
 * @return {Promise}         Promise
 */
function recurse() {
  var promiseGenerator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory();
  var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;
  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var concatOnArray = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  // Base case - just return the promisified result
  if (amount === 0) {
    return new _bluebird2.default(function (resolve) {
      resolve(concatOnArray);
    });
  }

  var next = promiseGenerator.apply(target, args).then(function (r) {
    concatOnArray = concatOnArray.concat(r);
    return recurse(promiseGenerator, amount - 1, target, args, concatOnArray);
  });

  return next;
}

/**
 * Compatible helper to replace the now defunc Promise.defer()
 * @method Deferred
 */
function Deferred() {
  var _this = this;

  this.resolve = null;
  this.reject = null;
  this.resolved = false;
  this.rejected = false;
  this.pending = true;
  this.status = 0;
  /* A newly created Pomise object.
   * Initially in pending state.
   */
  this.promise = new _bluebird2.default(function (resolve, reject) {
    _this.resolve = function (data) {
      _this.resolved = true;
      _this.pending = false;
      resolve(data);
    };
    _this.reject = function (e) {
      _this.rejected = true;
      _this.pending = false;
      if (e.constructor === String) {
        e = new Error(e);
      }
      reject(e);
    };
  });
  // Object.freeze(this)
}

/**
 * From http://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
 * TODO Pull request math js
 * @param  {object} content Repeated sequence
 * @param  {int} count   Number of time the sequence must be repeat
 * @return {array}       Array with repeated sequence
 */
function rep() {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory();

  var result = [];
  if (typeof content === 'function') {
    for (var i = 0; i < count; i++) {
      result = result.concat(content(i));
    }
  } else {
    for (var _i = 0; _i < count; _i++) {
      result = result.concat(content);
    }
  }
  return result;
}

function samplePermutation() {
  var sequence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var repetition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (sequence.constructor !== Array) {
    throw new Error('samplePermutation: sequence needs to be an array.');
  }

  if (n === null) {
    n = sequence.length;
  }

  var copy = sequence.slice(0);
  var permutation = [];
  var add = void 0;
  while (repetition && permutation.length < n || !repetition && copy.length) {
    var index = Math.floor(Math.random() * copy.length);
    if (repetition) {
      add = copy[index];
    } else {
      add = copy.splice(index, 1);
    }
    permutation = permutation.concat(add);
  }

  return permutation;
}

/* ======= Loading ======= */
function preloadImages() {
  // TODO make it a RessourceManager function
  var imgArray = [];
  var promiseArray = [];

  for (var _len4 = arguments.length, images = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    images[_key4] = arguments[_key4];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var image = _step.value;

      if (image.constructor === String) {
        var deferred = new Deferred();
        var img = new Image();
        img.src = image;
        imgArray.push(img);

        if (img.complete) {
          deferred.resolve();
        } else {
          img.addEventListener('load', function () {
            this.resolve();
          }.bind(deferred));
        }

        // $(img).on('load', function () {
        //   this.resolve()
        //   debugError('THIS IS LOAD')
        // }.bind(deferred))

        promiseArray.push(deferred.promise);
      } else {
        debugError('preloadImages: invalid string url ', image);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return [_bluebird2.default.all(promiseArray), imgArray];
}

/* =============== Personalized Matrix Functions =============== */
function matrix() {
  var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var cols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory();
  var fill = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var matrixObject = [];

  for (var i = 0; i < rows; i++) {
    matrixObject[i] = [];
    for (var j = 0; j < cols; j++) {
      matrixObject[i][j] = fill;
    }
  }

  return matrixObject;
}

function getRow() {
  var matrixObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var rowIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory();

  matrixObject = _experimentMathjs2.default.matrix(matrixObject);
  var size = matrixObject.size()[0];
  var row = _experimentMathjs2.default.subset(matrixObject, _experimentMathjs2.default.index(rowIndex, _experimentMathjs2.default.range(0, size)));

  return row;
}

function rowSum() {
  var matrixObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  matrixObject = _experimentMathjs2.default.matrix(matrixObject);
  var size = matrixObject.size()[0];
  if (rows === null) {
    rows = _experimentMathjs2.default.range(0, size - 1);
  }
  if (rows.constructor !== Array) {
    rows = [rows];
  }

  var rowSumArray = [];
  for (var i = 0; i < rows.length; i++) {
    rowSumArray.push(_experimentMathjs2.default.sum(getRow(matrixObject, rows[i])));
  }

  return rowSumArray;
}

// set or get the diagonal of a matrix
function diag() {
  var matrixObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var setTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var rows = matrixObject.length;
  // const cols = matrixObject[0].length

  var diagonalValues = [];

  for (var i = 0; i < rows; i++) {
    if (setTo) {
      matrixObject[i][i] = setTo;
    }
    diagonalValues.push(matrixObject[i][i]);
  }

  return [diagonalValues, matrixObject];
}

/* ======= BABYLON HELPERS ======= */

function sizeToVec() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  mustHaveConstructor(BABYLON.Size, size);
  return new BABYLON.Vector2(size.width, size.height);
}

function scaleSize() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  mustHaveConstructor(BABYLON.Size, size);

  var floatScale = parseFloat(scale);
  if (isNaN(floatScale)) {
    throw new Error('taskObject.scaleSize: scale is invalid ' + scale);
  }

  return new BABYLON.Size(size.width * floatScale, size.height * floatScale);
}

/* ======= Number functions ======= */
Number.prototype.boundTo = function boundTo() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory();

  mustHaveConstructor(Number, min, max);
  return Math.max(Math.min(this, max), min);
};

/* =============== String functions =============== */

/**
 * Find all the positions of a needle in a haystack string
 * @param  {string} needle   string to find
 * @param  {string} haystack string to scan
 * @return {Array}  Either -1 if no match is found or an array containing the indicies
 */
String.prototype.indicesOf = function indicesOf() {
  var needle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();

  var haystack = this;
  var indices = [];
  for (var i = 0; i < haystack.length; i++) {
    if (haystack.substr(i, needle.length) === needle) {
      indices.push(i);
    }
  }

  if (indices.length) {
    return indices;
  }
  return -1;
};

/* =============== Array prototype overload =============== */
Array.prototype.hasNeighbouringRepeat = function hasNeighbouringRepeat() {
  var previousElement = null;
  for (var i = 0; i < this.length; i++) {
    if (previousElement === this[i]) {
      return true;
    }
    previousElement = this[i];
  }
  return false;
};

Array.prototype.toCsv = function toCsv() {
  var lineArray = [];
  this.forEach(function (array, index) {
    var line = array.join(',');
    lineArray.push(index === 0 ? 'data:text/csv;charset=utf-8,' + line : line);
  });
  var csvContent = lineArray.join('\n');

  return csvContent;
};

Array.prototype.uniqueValues = function uniqueValues() {
  var u = {};
  var a = [];

  for (var i = 0; i < this.length; i++) {
    if (!u.hasOwnProperty(this[i])) {
      a.push(this[i]);
      u[this[i]] = 1;
    }
  }
  return a;
};

Array.prototype.min = function min() {
  var u = this.uniqueValues();

  if (u.allHaveConstructor(Number)) {
    var minValue = u[0];
    for (var i = 0; i < u.length; i++) {
      if (u[i] < minValue) {
        minValue = u[i];
      }
    }
    return minValue;
  }
  return NaN;
};

Array.prototype.max = function max() {
  var u = this.uniqueValues();

  if (u.allHaveConstructor(Number)) {
    var maxValue = u[0];
    for (var i = 0; i < u.length; i++) {
      if (u[i] > maxValue) {
        maxValue = u[i];
      }
    }
    return maxValue;
  }
  return NaN;
};

/**
 * multisplice - from http://upshots.org/actionscript/javascript-splice-array-on-multiple-indices-multisplice
 * With some es6 magic
 *
 * @returns {Array}
 */
Array.prototype.multisplice = function () {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  args.sort(function (a, b) {
    return a - b;
  });
  var spliced = [];
  for (var i = 0; i < args.length; i++) {
    var index = args[i] - i;
    spliced.push(this.splice(index, 1)[0]);
  }
  return spliced;
};

/**
 * Return an array of objects with x and y property. Y is taken as the values of the array, and x is either the index if null, or the values of the specified array.
 * @param  {?array} x X values, if null, the index is taken as x
 * @return {array}   Array of x and y [{x: x[i], y: this[i]},...]
 */
Array.prototype.getXY = function getXY() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (x !== null) {
    if (x.constructor !== Array) {
      throw new Error('Array.getXY: x needs to be an array.');
    }

    if (x.length !== this.length) {
      throw new Error('Array.getXY: x needs to be of the same length as array');
    }
  } else {
    debuglog('Array.getXY: x === null, x will be taken as the index of each value.');
  }

  var xyArray = [];
  for (var i = 0; i < this.length; i++) {
    if (x !== null) {
      xyArray.push({
        x: x[i],
        y: this[i]
      });
    } else {
      xyArray.push({
        x: i,
        y: this[i]
      });
    }
  }

  return xyArray;
};

Array.prototype.average = function average() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'global';
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  if (type === 'global') {
    var sum = this.sum();
    if (!isNaN(sum)) {
      return sum / this.length;
    }
  } else if (type === 'sliding') {
    var windowAverages = [];
    for (var i = 0; i < this.length; i++) {
      var endIndex = i + size;
      if (endIndex > this.length) {
        endIndex = this.length;
      }
      var windowArray = this.slice(i, endIndex);

      var _sum = windowArray.sum();
      if (!isNaN(_sum)) {
        windowAverages.push(_sum / windowArray.length);
      }
    }
    return windowAverages;
  } else if (type === 'bins') {
    var bins = [];
    var position = 0;
    while (position < this.length) {
      var _endIndex = position + size;
      if (_endIndex > this.length) {
        break;
      }

      var _windowArray = this.slice(position, _endIndex);

      var _sum2 = _windowArray.sum();
      if (!isNaN(_sum2)) {
        bins.push(_sum2 / _windowArray.length);
      }

      position = _endIndex;
    }

    return bins;
  }

  return undefined;
};

Array.prototype.sum = function sum() {
  var total = 0;
  for (var i = 0; i < this.length; i++) {
    if (isNaN(this[i])) {
      return NaN;
    }
    total += this[i];
  }
  return total;
};

Array.prototype.integrate = function integrate() {
  var sum = 0;
  var cumulativeArray = [];
  for (var i = 0; i < this.length; i++) {
    if (isNaN(this[i])) {
      return NaN;
    }

    sum += this[i];
    cumulativeArray.push(sum);
  }
  return cumulativeArray;
};

Array.prototype.equals = function equals(value) {
  var resultVector = [];
  var result = null;
  for (var i = 0, l = this.length; i < l; ++i) {
    result = this[i] === value;
    resultVector.push(result);
  }
  return resultVector;
};

Array.prototype.ntrue = function ntrue() {
  var resultSum = 0;
  var result = null;
  for (var i = 0, l = this.length; i < l; ++i) {
    result = this[i] === true ? 1 : 0;
    resultSum += result;
  }
  return resultSum;
};

Array.prototype.nEquals = function nEquals(value) {
  return this.equals(value).ntrue();
};

Array.prototype.indicesOf = function indicesOf(value) {
  var resultVector = [];
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === value) {
      resultVector.push(i);
    }
  }
  return resultVector;
};

Array.prototype.exclude = function exclude(values) {
  // returns an array without exluded values
  var resultVector = [];
  for (var i = 0, l = this.length; i < l; ++i) {
    var addit = true;
    for (var j = 0; j < values.length; ++j) {
      if (this[i] === values[j]) {
        addit = false;
      }
    }
    if (addit) {
      resultVector.push(this[i]);
    }
  }
  return resultVector;
};

Array.prototype.allHaveConstructor = function allHaveConstructor(constructorObject) {
  for (var i = 0; i < this.length; i++) {
    if (typeof this[i] === 'undefined' || this[i] === null || this[i].constructor !== constructorObject) {
      return false;
    }
  }
  return true;
};

Array.prototype.includes = function includes() {
  for (var _len6 = arguments.length, array = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    array[_key6] = arguments[_key6];
  }

  if (array.length === 1 && (array[0].constructor === Set || array[0].constructor === Array)) {
    array = array[0];
  }
  // returns a bool wether all value of specified array are in current array
  for (var i = 0; i < array.length; i++) {
    if (this.indexOf(array[i]) === -1) {
      return false;
    }
  }
  return true;
};

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
  value: function observe() {
    var attribute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory();

    var _this2 = this;

    var lookForValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var rate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

    var deferred = new Deferred();
    debuglog('Started observing ', this, ' attribute ', attribute, ' for value ', lookForValue, ' current value ', this[attribute]);
    var checkForValue = function checkForValue() {
      if (_this2[attribute] === lookForValue) {
        debuglog('Finished observing ', _this2, ' attribute ', attribute, ' for value ', lookForValue, ' current value ', _this2[attribute]);
        deferred.resolve(lookForValue);
      } else {
        debuglog('im still observing ', _this2, ' attribute ', attribute, ' for value ', lookForValue, ' current value ', _this2[attribute]);
        delay(rate).then(checkForValue);
      }
    };
    checkForValue();
    return deferred.promise;
  },
  enumerable: false
}

/**
 * isSuperset - Returns true if the set is a superset of the specified subset
 *
 * @param {Set} subset a set
 *
 * @returns {bool}
 */
);Set.prototype.isSuperset = function (subset) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = subset[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var elem = _step2.value;

      if (!this.has(elem)) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return true;
};

Set.prototype.union = function (setB) {
  var union = new Set(this);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = setB[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var elem = _step3.value;

      union.add(elem);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return union;
};

Set.prototype.sample = function () {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var repeat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var result = [];
  var array = Array.from(this);
  for (var i = 0; i < n; i++) {
    var index = _lodash2.default.random(0, array.length - 1);
    result.push(array[index]);
    if (!repeat) {
      array.splice(index, 1);
    }
  }
  return result;
};

/**
 * unite - Performs union in place. Replaces current set.
 *
 * @param {Set} setB
 *
 * @returns {undefined}
 */
Set.prototype.unite = function (setB) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = setB[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var elem = _step4.value;

      this.add(elem);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return undefined;
};

Set.prototype.intersection = function (setB) {
  var intersection = new Set();
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = setB[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var elem = _step5.value;

      if (this.has(elem)) {
        intersection.add(elem);
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  return intersection;
};

/**
 * intersect - Performs an intersection in place (replace current set values)
 *
 * @param {Set} setB Description
 *
 * @returns {undefined}
 */
Set.prototype.intersect = function (setB) {
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = this[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var elem = _step6.value;

      if (!setB.has(elem)) {
        this.remove(elem);
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  return undefined;
};

Set.prototype.difference = function (setB) {
  var difference = new Set(this);
  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = setB[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var elem = _step7.value;

      difference.delete(elem);
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return) {
        _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  return difference;
};

exports.Array = Array;
exports.String = String;
exports.Object = Object;
exports.Number = Number;
exports.Set = Set;
exports.diag = diag;
exports.rowSum = rowSum;
exports.getRow = getRow;
exports.matrix = matrix;
exports.samplePermutation = samplePermutation;
exports.rep = rep;
exports.Deferred = Deferred;
exports.recurse = recurse;
exports.jitter = jitter;
exports.delay = delay;
exports.looksLikeAPromise = looksLikeAPromise;
exports.mustHaveConstructor = mustHaveConstructor;
exports.mustBeDefined = mustBeDefined;
exports.mandatory = mandatory;
exports.debuglog = debuglog;
exports.debugWarn = debugWarn;
exports.debugError = debugError;
exports.noop = noop;
exports.spreadToObject = spreadToObject;
exports.sizeToVec = sizeToVec;
exports.scaleSize = scaleSize;
exports.hasConstructor = hasConstructor;
exports.preloadImages = preloadImages;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2017 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
/**
 * bluebird build version 3.5.0
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
*/
!function(e){if(true)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};

},{}],2:[function(_dereq_,module,exports){
"use strict";
var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = _dereq_("./schedule");
var Queue = _dereq_("./queue");
var util = _dereq_("./util");

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
};

Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
};

Async.prototype.enableTrampoline = function() {
    this._trampolineEnabled = true;
};

Async.prototype.disableTrampolineIfNecessary = function() {
    if (util.hasDevTools) {
        this._trampolineEnabled = false;
    }
};

Async.prototype.haveItemsQueued = function () {
    return this._isTickUsed || this._haveDrainedQueues;
};


Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
            "\n");
        process.exit(2);
    } else {
        this.throwLater(e);
    }
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

if (!util.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
} else {
    Async.prototype.invokeLater = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                setTimeout(function() {
                    fn.call(receiver, arg);
                }, 100);
            });
        }
    };

    Async.prototype.invoke = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvoke.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                fn.call(receiver, arg);
            });
        }
    };

    Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
            AsyncSettlePromises.call(this, promise);
        } else {
            this._schedule(function() {
                promise._settlePromises();
            });
        }
    };
}

Async.prototype._drainQueue = function(queue) {
    while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
            fn._settlePromises();
            continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
};

Async.prototype._drainQueues = function () {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    this._drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;

},{"./queue":26,"./schedule":29,"./util":36}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (((this._bitField & 50397184) === 0)) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    if (!calledBind) {
        calledBind = true;
        Promise.prototype._propagateFrom = debug.propagateFromFunction();
        Promise.prototype._boundValue = debug.boundValueFunction();
    }
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, undefined, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, undefined, ret, context);
        ret._setOnCancel(maybePromise);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~2097152);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 2097152) === 2097152;
};

Promise.bind = function (thisArg, value) {
    return Promise.resolve(value).bind(thisArg);
};
};

},{}],4:[function(_dereq_,module,exports){
"use strict";
var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = _dereq_("./promise")();
bluebird.noConflict = noConflict;
module.exports = bluebird;

},{"./promise":22}],5:[function(_dereq_,module,exports){
"use strict";
var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = _dereq_("./util");
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (false) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var args = [].slice.call(arguments, 1);;
    if (false) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};

},{"./util":36}],6:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, PromiseArray, apiRejection, debug) {
var util = _dereq_("./util");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

Promise.prototype["break"] = Promise.prototype.cancel = function() {
    if (!debug.cancellation()) return this._warn("cancellation is disabled");

    var promise = this;
    var child = promise;
    while (promise._isCancellable()) {
        if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
                child._followee().cancel();
            } else {
                child._cancelBranched();
            }
            break;
        }

        var parent = promise._cancellationParent;
        if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
                promise._followee().cancel();
            } else {
                promise._cancelBranched();
            }
            break;
        } else {
            if (promise._isFollowing()) promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
        }
    }
};

Promise.prototype._branchHasCancelled = function() {
    this._branchesRemainingToCancel--;
};

Promise.prototype._enoughBranchesHaveCancelled = function() {
    return this._branchesRemainingToCancel === undefined ||
           this._branchesRemainingToCancel <= 0;
};

Promise.prototype._cancelBy = function(canceller) {
    if (canceller === this) {
        this._branchesRemainingToCancel = 0;
        this._invokeOnCancel();
        return true;
    } else {
        this._branchHasCancelled();
        if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
        }
    }
    return false;
};

Promise.prototype._cancelBranched = function() {
    if (this._enoughBranchesHaveCancelled()) {
        this._cancel();
    }
};

Promise.prototype._cancel = function() {
    if (!this._isCancellable()) return;
    this._setCancelled();
    async.invoke(this._cancelPromises, this, undefined);
};

Promise.prototype._cancelPromises = function() {
    if (this._length() > 0) this._settlePromises();
};

Promise.prototype._unsetOnCancel = function() {
    this._onCancelField = undefined;
};

Promise.prototype._isCancellable = function() {
    return this.isPending() && !this._isCancelled();
};

Promise.prototype.isCancellable = function() {
    return this.isPending() && !this.isCancelled();
};

Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
    if (util.isArray(onCancelCallback)) {
        for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
        }
    } else if (onCancelCallback !== undefined) {
        if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
                var e = tryCatch(onCancelCallback).call(this._boundValue());
                if (e === errorObj) {
                    this._attachExtraTrace(e.e);
                    async.throwLater(e.e);
                }
            }
        } else {
            onCancelCallback._resultCancelled(this);
        }
    }
};

Promise.prototype._invokeOnCancel = function() {
    var onCancelCallback = this._onCancel();
    this._unsetOnCancel();
    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
};

Promise.prototype._invokeInternalOnCancel = function() {
    if (this._isCancellable()) {
        this._doInvokeOnCancel(this._onCancel(), true);
        this._unsetOnCancel();
    }
};

Promise.prototype._resultCancelled = function() {
    this.cancel();
};

};

},{"./util":36}],7:[function(_dereq_,module,exports){
"use strict";
module.exports = function(NEXT_FILTER) {
var util = _dereq_("./util");
var getKeys = _dereq_("./es5").keys;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function catchFilter(instances, cb, promise) {
    return function(e) {
        var boundTo = promise._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
            var item = instances[i];

            if (item === Error ||
                (item != null && item.prototype instanceof Error)) {
                if (e instanceof item) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (typeof item === "function") {
                var matchesPredicate = tryCatch(item).call(boundTo, e);
                if (matchesPredicate === errorObj) {
                    return matchesPredicate;
                } else if (matchesPredicate) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                    var key = keys[j];
                    if (item[key] != e[key]) {
                        continue predicateLoop;
                    }
                }
                return tryCatch(cb).call(boundTo, e);
            }
        }
        return NEXT_FILTER;
    };
}

return catchFilter;
};

},{"./es5":13,"./util":36}],8:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var longStackTraces = false;
var contextStack = [];

Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {};
Promise.prototype._popContext = function() {return null;};
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
    this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (this._trace !== undefined) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (this._trace !== undefined) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
    }
    return null;
};

function createContext() {
    if (longStackTraces) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
    var Promise_pushContext = Promise.prototype._pushContext;
    var Promise_popContext = Promise.prototype._popContext;
    var Promise_PeekContext = Promise._peekContext;
    var Promise_peekContext = Promise.prototype._peekContext;
    var Promise_promiseCreated = Promise.prototype._promiseCreated;
    Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext;
        Promise.prototype._popContext = Promise_popContext;
        Promise._peekContext = Promise_PeekContext;
        Promise.prototype._peekContext = Promise_peekContext;
        Promise.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
    };
    longStackTraces = true;
    Promise.prototype._pushContext = Context.prototype._pushContext;
    Promise.prototype._popContext = Context.prototype._popContext;
    Promise._peekContext = Promise.prototype._peekContext = peekContext;
    Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
    };
};
return Context;
};

},{}],9:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, Context) {
var getDomain = Promise._getDomain;
var async = Promise._async;
var Warning = _dereq_("./errors").Warning;
var util = _dereq_("./util");
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;
var bluebirdFramePattern =
    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
var stackFramePattern = null;
var formatStack = null;
var indentStackFrames = false;
var printWarning;
var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
                        (true ||
                         util.env("BLUEBIRD_DEBUG") ||
                         util.env("NODE_ENV") === "development"));

var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
    (debugging || util.env("BLUEBIRD_WARNINGS")));

var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

Promise.prototype.suppressUnhandledRejections = function() {
    var target = this._target();
    target._bitField = ((target._bitField & (~1048576)) |
                      524288);
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    if ((this._bitField & 524288) !== 0) return;
    this._setRejectionIsUnhandled();
    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
    fireRejectionEvent("rejectionHandled",
                                  unhandledRejectionHandled, undefined, this);
};

Promise.prototype._setReturnedNonUndefined = function() {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._returnedNonUndefined = function() {
    return (this._bitField & 268435456) !== 0;
};

Promise.prototype._notifyUnhandledRejection = function () {
    if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified();
        fireRejectionEvent("unhandledRejection",
                                      possiblyUnhandledRejection, reason, this);
    }
};

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 262144;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~262144);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 262144) > 0;
};

Promise.prototype._setRejectionIsUnhandled = function () {
    this._bitField = this._bitField | 1048576;
};

Promise.prototype._unsetRejectionIsUnhandled = function () {
    this._bitField = this._bitField & (~1048576);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled = function () {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
    return warn(message, shouldUseOwnTrace, promise || this);
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    var domain = getDomain();
    possiblyUnhandledRejection =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    var domain = getDomain();
    unhandledRejectionHandled =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

var disableLongStackTraces = function() {};
Promise.longStackTraces = function () {
    if (async.haveItemsQueued() && !config.longStackTraces) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
        config.longStackTraces = true;
        disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
            }
            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Context.deactivateLongStackTraces();
            async.enableTrampoline();
            config.longStackTraces = false;
        };
        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
        Context.activateLongStackTraces();
        async.disableTrampolineIfNecessary();
    }
};

Promise.hasLongStackTraces = function () {
    return config.longStackTraces && longStackTracesIsSupported();
};

var fireDomEvent = (function() {
    try {
        if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new CustomEvent(name.toLowerCase(), {
                    detail: event,
                    cancelable: true
                });
                return !util.global.dispatchEvent(domEvent);
            };
        } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new Event(name.toLowerCase(), {
                    cancelable: true
                });
                domEvent.detail = event;
                return !util.global.dispatchEvent(domEvent);
            };
        } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = document.createEvent("CustomEvent");
                domEvent.initCustomEvent(name.toLowerCase(), false, true,
                    event);
                return !util.global.dispatchEvent(domEvent);
            };
        }
    } catch (e) {}
    return function() {
        return false;
    };
})();

var fireGlobalEvent = (function() {
    if (util.isNode) {
        return function() {
            return process.emit.apply(process, arguments);
        };
    } else {
        if (!util.global) {
            return function() {
                return false;
            };
        }
        return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method) return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
        };
    }
})();

function generatePromiseLifecycleEventObject(name, promise) {
    return {promise: promise};
}

var eventToObjectGenerator = {
    promiseCreated: generatePromiseLifecycleEventObject,
    promiseFulfilled: generatePromiseLifecycleEventObject,
    promiseRejected: generatePromiseLifecycleEventObject,
    promiseResolved: generatePromiseLifecycleEventObject,
    promiseCancelled: generatePromiseLifecycleEventObject,
    promiseChained: function(name, promise, child) {
        return {promise: promise, child: child};
    },
    warning: function(name, warning) {
        return {warning: warning};
    },
    unhandledRejection: function (name, reason, promise) {
        return {reason: reason, promise: promise};
    },
    rejectionHandled: generatePromiseLifecycleEventObject
};

var activeFireEvent = function (name) {
    var globalEventFired = false;
    try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
    } catch (e) {
        async.throwLater(e);
        globalEventFired = true;
    }

    var domEventFired = false;
    try {
        domEventFired = fireDomEvent(name,
                    eventToObjectGenerator[name].apply(null, arguments));
    } catch (e) {
        async.throwLater(e);
        domEventFired = true;
    }

    return domEventFired || globalEventFired;
};

Promise.config = function(opts) {
    opts = Object(opts);
    if ("longStackTraces" in opts) {
        if (opts.longStackTraces) {
            Promise.longStackTraces();
        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
            disableLongStackTraces();
        }
    }
    if ("warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption;
        wForgottenReturn = config.warnings;

        if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
                wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
        }
    }
    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async.haveItemsQueued()) {
            throw new Error(
                "cannot enable cancellation after promises are in use");
        }
        Promise.prototype._clearCancellationData =
            cancellationClearCancellationData;
        Promise.prototype._propagateFrom = cancellationPropagateFrom;
        Promise.prototype._onCancel = cancellationOnCancel;
        Promise.prototype._setOnCancel = cancellationSetOnCancel;
        Promise.prototype._attachCancellationCallback =
            cancellationAttachCancellationCallback;
        Promise.prototype._execute = cancellationExecute;
        propagateFromFunction = cancellationPropagateFrom;
        config.cancellation = true;
    }
    if ("monitoring" in opts) {
        if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise.prototype._fireEvent = activeFireEvent;
        } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise.prototype._fireEvent = defaultFireEvent;
        }
    }
    return Promise;
};

function defaultFireEvent() { return false; }

Promise.prototype._fireEvent = defaultFireEvent;
Promise.prototype._execute = function(executor, resolve, reject) {
    try {
        executor(resolve, reject);
    } catch (e) {
        return e;
    }
};
Promise.prototype._onCancel = function () {};
Promise.prototype._setOnCancel = function (handler) { ; };
Promise.prototype._attachCancellationCallback = function(onCancel) {
    ;
};
Promise.prototype._captureStackTrace = function () {};
Promise.prototype._attachExtraTrace = function () {};
Promise.prototype._clearCancellationData = function() {};
Promise.prototype._propagateFrom = function (parent, flags) {
    ;
    ;
};

function cancellationExecute(executor, resolve, reject) {
    var promise = this;
    try {
        executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
                throw new TypeError("onCancel must be a function, got: " +
                                    util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
        });
    } catch (e) {
        return e;
    }
}

function cancellationAttachCancellationCallback(onCancel) {
    if (!this._isCancellable()) return this;

    var previousOnCancel = this._onCancel();
    if (previousOnCancel !== undefined) {
        if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
        } else {
            this._setOnCancel([previousOnCancel, onCancel]);
        }
    } else {
        this._setOnCancel(onCancel);
    }
}

function cancellationOnCancel() {
    return this._onCancelField;
}

function cancellationSetOnCancel(onCancel) {
    this._onCancelField = onCancel;
}

function cancellationClearCancellationData() {
    this._cancellationParent = undefined;
    this._onCancelField = undefined;
}

function cancellationPropagateFrom(parent, flags) {
    if ((flags & 1) !== 0) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        if (branchesRemainingToCancel === undefined) {
            branchesRemainingToCancel = 0;
        }
        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
    }
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}

function bindingPropagateFrom(parent, flags) {
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}
var propagateFromFunction = bindingPropagateFrom;

function boundValueFunction() {
    var ret = this._boundTo;
    if (ret !== undefined) {
        if (ret instanceof Promise) {
            if (ret.isFulfilled()) {
                return ret.value();
            } else {
                return undefined;
            }
        }
    }
    return ret;
}

function longStackTracesCaptureStackTrace() {
    this._trace = new CapturedTrace(this._peekContext());
}

function longStackTracesAttachExtraTrace(error, ignoreSelf) {
    if (canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack",
                parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
        }
    }
}

function checkForgottenReturns(returnValue, promiseCreated, name, promise,
                               parent) {
    if (returnValue === undefined && promiseCreated !== null &&
        wForgottenReturn) {
        if (parent !== undefined && parent._returnedNonUndefined()) return;
        if ((promise._bitField & 65535) === 0) return;

        if (name) name = name + " ";
        var handlerLine = "";
        var creatorLine = "";
        if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
                var line = stack[i];
                if (!nodeFramePattern.test(line)) {
                    var lineMatches = line.match(parseLinePattern);
                    if (lineMatches) {
                        handlerLine  = "at " + lineMatches[1] +
                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                    }
                    break;
                }
            }

            if (stack.length > 0) {
                var firstUserLine = stack[0];
                for (var i = 0; i < traceLines.length; ++i) {

                    if (traceLines[i] === firstUserLine) {
                        if (i > 0) {
                            creatorLine = "\n" + traceLines[i - 1];
                        }
                        break;
                    }
                }

            }
        }
        var msg = "a promise was created in a " + name +
            "handler " + handlerLine + "but was not returned from it, " +
            "see http://goo.gl/rRqMUw" +
            creatorLine;
        promise._warn(msg, true, promiseCreated);
    }
}

function deprecated(name, replacement) {
    var message = name +
        " is deprecated and will be removed in a future version.";
    if (replacement) message += " Use " + replacement + " instead.";
    return warn(message);
}

function warn(message, shouldUseOwnTrace, promise) {
    if (!config.warnings) return;
    var warning = new Warning(message);
    var ctx;
    if (shouldUseOwnTrace) {
        promise._attachExtraTrace(warning);
    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
        ctx.attachExtraTrace(warning);
    } else {
        var parsed = parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
    }

    if (!activeFireEvent("warning", warning)) {
        formatAndLogError(warning, "", true);
    }
}

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
    }
    return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
    for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 ||
            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
            stacks.splice(i, 1);
            i--;
        }
    }
}

function removeCommonRoots(stacks) {
    var current = stacks[0];
    for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;

        for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
            }
        }

        for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
            } else {
                break;
            }
        }
        current = prev;
    }
}

function cleanStack(stack) {
    var ret = [];
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = "    (No stack trace)" === line ||
            stackFramePattern.test(line);
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
            }
            ret.push(line);
        }
    }
    return ret;
}

function stackFramesAsArray(error) {
    var stack = error.stack.replace(/\s+$/g, "").split("\n");
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i > 0 && error.name != "SyntaxError") {
        stack = stack.slice(i);
    }
    return stack;
}

function parseStackAndMessage(error) {
    var stack = error.stack;
    var message = error.toString();
    stack = typeof stack === "string" && stack.length > 0
                ? stackFramesAsArray(error) : ["    (No stack trace)"];
    return {
        message: message,
        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
    };
}

function formatAndLogError(error, title, isSoft) {
    if (typeof console !== "undefined") {
        var message;
        if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof printWarning === "function") {
            printWarning(message, isSoft);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
}

function fireRejectionEvent(name, localHandler, reason, promise) {
    var localEventFired = false;
    try {
        if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
                localHandler(promise);
            } else {
                localHandler(reason, promise);
            }
        }
    } catch (e) {
        async.throwLater(e);
    }

    if (name === "unhandledRejection") {
        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
        }
    } else {
        activeFireEvent(name, promise);
    }
}

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj && typeof obj.toString === "function"
            ? obj.toString() : util.toString(obj);
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

function longStackTracesIsSupported() {
    return typeof captureStackTrace === "function";
}

var shouldIgnore = function() { return false; };
var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
    var matches = line.match(parseLineInfoRegex);
    if (matches) {
        return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
        };
    }
}

function setBounds(firstLineError, lastLineError) {
    if (!longStackTracesIsSupported()) return;
    var firstStackLines = firstLineError.stack.split("\n");
    var lastStackLines = lastLineError.stack.split("\n");
    var firstIndex = -1;
    var lastIndex = -1;
    var firstFileName;
    var lastFileName;
    for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
        }
    }
    for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
        }
    }
    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
        firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
    }

    shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
            if (info.fileName === firstFileName &&
                (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
            }
        }
        return false;
    };
}

function CapturedTrace(parent) {
    this._parent = parent;
    this._promisesCreated = 0;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
util.inherits(CapturedTrace, Error);
Context.CapturedTrace = CapturedTrace;

CapturedTrace.prototype.uncycle = function() {
    var length = this._length;
    if (length < 2) return;
    var nodes = [];
    var stackToIndex = {};

    for (var i = 0, node = this; node !== undefined; ++i) {
        nodes.push(node);
        node = node._parent;
    }
    length = this._length = i;
    for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === undefined) {
            stackToIndex[stack] = i;
        }
    }
    for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== undefined && index !== i) {
            if (index > 0) {
                nodes[index - 1]._parent = undefined;
                nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = undefined;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

            if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length =
                    cycleEdgeNode._parent._length + 1;
            } else {
                cycleEdgeNode._parent = undefined;
                cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
            }
            return;
        }
    }
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
    if (error.__stackCleaned__) return;
    this.uncycle();
    var parsed = parseStackAndMessage(error);
    var message = parsed.message;
    var stacks = [parsed.stack];

    var trace = this;
    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
    util.notEnumerableProp(error, "__stackCleaned__", true);
};

var captureStackTrace = (function stackDetection() {
    var v8stackFramePattern = /^\s*at\s*/;
    var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;

        if (error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit += 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;

        shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace(receiver, ignoreUntil);
            Error.stackTraceLimit -= 6;
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace(o) {
            o.stack = new Error().stack;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow &&
        typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            Error.stackTraceLimit += 6;
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
            Error.stackTraceLimit -= 6;
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    return null;

})([]);

if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
    printWarning = function (message) {
        console.warn(message);
    };
    if (util.isNode && process.stderr.isTTY) {
        printWarning = function(message, isSoft) {
            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
            console.warn(color + message + "\u001b[0m\n");
        };
    } else if (!util.isNode && typeof (new Error().stack) === "string") {
        printWarning = function(message, isSoft) {
            console.warn("%c" + message,
                        isSoft ? "color: darkorange" : "color: red");
        };
    }
}

var config = {
    warnings: warnings,
    longStackTraces: false,
    cancellation: false,
    monitoring: false
};

if (longStackTraces) Promise.longStackTraces();

return {
    longStackTraces: function() {
        return config.longStackTraces;
    },
    warnings: function() {
        return config.warnings;
    },
    cancellation: function() {
        return config.cancellation;
    },
    monitoring: function() {
        return config.monitoring;
    },
    propagateFromFunction: function() {
        return propagateFromFunction;
    },
    boundValueFunction: function() {
        return boundValueFunction;
    },
    checkForgottenReturns: checkForgottenReturns,
    setBounds: setBounds,
    warn: warn,
    deprecated: deprecated,
    CapturedTrace: CapturedTrace,
    fireDomEvent: fireDomEvent,
    fireGlobalEvent: fireGlobalEvent
};
};

},{"./errors":12,"./util":36}],10:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
function returner() {
    return this.value;
}
function thrower() {
    throw this.reason;
}

Promise.prototype["return"] =
Promise.prototype.thenReturn = function (value) {
    if (value instanceof Promise) value.suppressUnhandledRejections();
    return this._then(
        returner, undefined, undefined, {value: value}, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    return this._then(
        thrower, undefined, undefined, {reason: reason}, undefined);
};

Promise.prototype.catchThrow = function (reason) {
    if (arguments.length <= 1) {
        return this._then(
            undefined, thrower, undefined, {reason: reason}, undefined);
    } else {
        var _reason = arguments[1];
        var handler = function() {throw _reason;};
        return this.caught(reason, handler);
    }
};

Promise.prototype.catchReturn = function (value) {
    if (arguments.length <= 1) {
        if (value instanceof Promise) value.suppressUnhandledRejections();
        return this._then(
            undefined, returner, undefined, {value: value}, undefined);
    } else {
        var _value = arguments[1];
        if (_value instanceof Promise) _value.suppressUnhandledRejections();
        var handler = function() {return _value;};
        return this.caught(value, handler);
    }
};
};

},{}],11:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;
var PromiseAll = Promise.all;

function promiseAllThis() {
    return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, this, undefined);
};

Promise.prototype.mapSeries = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, promises, undefined);
};

Promise.mapSeries = PromiseMapSeries;
};


},{}],12:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5");
var Objectfreeze = es5.freeze;
var util = _dereq_("./util");
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
    });
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};

},{"./es5":13,"./util":36}],13:[function(_dereq_,module,exports){
var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5,
        propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
        }
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function (o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    };

    var ObjectGetDescriptor = function(o, key) {
        return {value: o[key]};
    };

    var ObjectDefineProperty = function (o, key, desc) {
        o[key] = desc.value;
        return o;
    };

    var ObjectFreeze = function (obj) {
        return obj;
    };

    var ObjectGetPrototypeOf = function (obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    };

    var ArrayIsArray = function (obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    };

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}

},{}],14:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function (fn, options) {
    return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function (promises, fn, options) {
    return PromiseMap(promises, fn, options, INTERNAL);
};
};

},{}],15:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
var util = _dereq_("./util");
var CancellationError = Promise.CancellationError;
var errorObj = util.errorObj;
var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);

function PassThroughHandlerContext(promise, type, handler) {
    this.promise = promise;
    this.type = type;
    this.handler = handler;
    this.called = false;
    this.cancelPromise = null;
}

PassThroughHandlerContext.prototype.isFinallyHandler = function() {
    return this.type === 0;
};

function FinallyHandlerCancelReaction(finallyHandler) {
    this.finallyHandler = finallyHandler;
}

FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
    checkCancel(this.finallyHandler);
};

function checkCancel(ctx, reason) {
    if (ctx.cancelPromise != null) {
        if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
        } else {
            ctx.cancelPromise._cancel();
        }
        ctx.cancelPromise = null;
        return true;
    }
    return false;
}

function succeed() {
    return finallyHandler.call(this, this.promise._target()._settledValue());
}
function fail(reason) {
    if (checkCancel(this, reason)) return;
    errorObj.e = reason;
    return errorObj;
}
function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    if (!this.called) {
        this.called = true;
        var ret = this.isFinallyHandler()
            ? handler.call(promise._boundValue())
            : handler.call(promise._boundValue(), reasonOrValue);
        if (ret === NEXT_FILTER) {
            return ret;
        } else if (ret !== undefined) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret, promise);
            if (maybePromise instanceof Promise) {
                if (this.cancelPromise != null) {
                    if (maybePromise._isCancelled()) {
                        var reason =
                            new CancellationError("late cancellation observer");
                        promise._attachExtraTrace(reason);
                        errorObj.e = reason;
                        return errorObj;
                    } else if (maybePromise.isPending()) {
                        maybePromise._attachCancellationCallback(
                            new FinallyHandlerCancelReaction(this));
                    }
                }
                return maybePromise._then(
                    succeed, fail, undefined, this, undefined);
            }
        }
    }

    if (promise.isRejected()) {
        checkCancel(this);
        errorObj.e = reasonOrValue;
        return errorObj;
    } else {
        checkCancel(this);
        return reasonOrValue;
    }
}

Promise.prototype._passThrough = function(handler, type, success, fail) {
    if (typeof handler !== "function") return this.then();
    return this._then(success,
                      fail,
                      undefined,
                      new PassThroughHandlerContext(this, type, handler),
                      undefined);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function (handler) {
    return this._passThrough(handler,
                             0,
                             finallyHandler,
                             finallyHandler);
};


Promise.prototype.tap = function (handler) {
    return this._passThrough(handler, 1, finallyHandler);
};

Promise.prototype.tapCatch = function (handlerOrPredicate) {
    var len = arguments.length;
    if(len === 1) {
        return this._passThrough(handlerOrPredicate,
                                 1,
                                 undefined,
                                 finallyHandler);
    } else {
         var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return Promise.reject(new TypeError(
                    "tapCatch statement predicate: "
                    + "expecting an object but got " + util.classString(item)
                ));
            }
        }
        catchInstances.length = j;
        var handler = arguments[i];
        return this._passThrough(catchFilter(catchInstances, handler, this),
                                 1,
                                 undefined,
                                 finallyHandler);
    }

};

return PassThroughHandlerContext;
};

},{"./catch_filter":7,"./util":36}],16:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise,
                          Proxyable,
                          debug) {
var errors = _dereq_("./errors");
var TypeError = errors.TypeError;
var util = _dereq_("./util");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
    for (var i = 0; i < yieldHandlers.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            traceParent._popContext();
            return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise) return maybePromise;
    }
    return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
    if (debug.cancellation()) {
        var internal = new Promise(INTERNAL);
        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
        this._promise = internal.lastly(function() {
            return _finallyPromise;
        });
        internal._captureStackTrace();
        internal._setOnCancel(this);
    } else {
        var promise = this._promise = new Promise(INTERNAL);
        promise._captureStackTrace();
    }
    this._stack = stack;
    this._generatorFunction = generatorFunction;
    this._receiver = receiver;
    this._generator = undefined;
    this._yieldHandlers = typeof yieldHandler === "function"
        ? [yieldHandler].concat(yieldHandlers)
        : yieldHandlers;
    this._yieldedPromise = null;
    this._cancellationPhase = false;
}
util.inherits(PromiseSpawn, Proxyable);

PromiseSpawn.prototype._isResolved = function() {
    return this._promise === null;
};

PromiseSpawn.prototype._cleanup = function() {
    this._promise = this._generator = null;
    if (debug.cancellation() && this._finallyPromise !== null) {
        this._finallyPromise._fulfill();
        this._finallyPromise = null;
    }
};

PromiseSpawn.prototype._promiseCancelled = function() {
    if (this._isResolved()) return;
    var implementsReturn = typeof this._generator["return"] !== "undefined";

    var result;
    if (!implementsReturn) {
        var reason = new Promise.CancellationError(
            "generator .return() sentinel");
        Promise.coroutine.returnSentinel = reason;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        result = tryCatch(this._generator["throw"]).call(this._generator,
                                                         reason);
        this._promise._popContext();
    } else {
        this._promise._pushContext();
        result = tryCatch(this._generator["return"]).call(this._generator,
                                                          undefined);
        this._promise._popContext();
    }
    this._cancellationPhase = true;
    this._yieldedPromise = null;
    this._continue(result);
};

PromiseSpawn.prototype._promiseFulfilled = function(value) {
    this._yieldedPromise = null;
    this._promise._pushContext();
    var result = tryCatch(this._generator.next).call(this._generator, value);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._promiseRejected = function(reason) {
    this._yieldedPromise = null;
    this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    var result = tryCatch(this._generator["throw"])
        .call(this._generator, reason);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._resultCancelled = function() {
    if (this._yieldedPromise instanceof Promise) {
        var promise = this._yieldedPromise;
        this._yieldedPromise = null;
        promise.cancel();
    }
};

PromiseSpawn.prototype.promise = function () {
    return this._promise;
};

PromiseSpawn.prototype._run = function () {
    this._generator = this._generatorFunction.call(this._receiver);
    this._receiver =
        this._generatorFunction = undefined;
    this._promiseFulfilled(undefined);
};

PromiseSpawn.prototype._continue = function (result) {
    var promise = this._promise;
    if (result === errorObj) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._rejectCallback(result.e, false);
        }
    }

    var value = result.value;
    if (result.done === true) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._resolveCallback(value);
        }
    } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise)) {
            maybePromise =
                promiseFromYieldHandler(maybePromise,
                                        this._yieldHandlers,
                                        this._promise);
            if (maybePromise === null) {
                this._promiseRejected(
                    new TypeError(
                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
                        "From coroutine:\u000a" +
                        this._stack.split("\n").slice(1, -7).join("\n")
                    )
                );
                return;
            }
        }
        maybePromise = maybePromise._target();
        var bitField = maybePromise._bitField;
        ;
        if (((bitField & 50397184) === 0)) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
        } else if (((bitField & 33554432) !== 0)) {
            Promise._async.invoke(
                this._promiseFulfilled, this, maybePromise._value()
            );
        } else if (((bitField & 16777216) !== 0)) {
            Promise._async.invoke(
                this._promiseRejected, this, maybePromise._reason()
            );
        } else {
            this._promiseCancelled();
        }
    }
};

Promise.coroutine = function (generatorFunction, options) {
    if (typeof generatorFunction !== "function") {
        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var yieldHandler = Object(options).yieldHandler;
    var PromiseSpawn$ = PromiseSpawn;
    var stack = new Error().stack;
    return function () {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                      stack);
        var ret = spawn.promise();
        spawn._generator = generator;
        spawn._promiseFulfilled(undefined);
        return ret;
    };
};

Promise.coroutine.addYieldHandler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    yieldHandlers.push(fn);
};

Promise.spawn = function (generatorFunction) {
    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};

},{"./errors":12,"./util":36}],17:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
         getDomain) {
var util = _dereq_("./util");
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var reject;

if (false) {
if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var promiseSetter = function(i) {
        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
    };

    var generateHolderClass = function(total) {
        var props = new Array(total);
        for (var i = 0; i < props.length; ++i) {
            props[i] = "this.p" + (i+1);
        }
        var assignment = props.join(" = ") + " = null;";
        var cancellationCode= "var promise;\n" + props.map(function(prop) {
            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
        }).join("\n");
        var passedArguments = props.join(", ");
        var name = "Holder$" + total;


        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

        code = code.replace(/\[TheName\]/g, name)
            .replace(/\[TheTotal\]/g, total)
            .replace(/\[ThePassedArguments\]/g, passedArguments)
            .replace(/\[TheProperties\]/g, assignment)
            .replace(/\[CancellationCode\]/g, cancellationCode);

        return new Function("tryCatch", "errorObj", "Promise", "async", code)
                           (tryCatch, errorObj, Promise, async);
    };

    var holderClasses = [];
    var thenCallbacks = [];
    var promiseSetters = [];

    for (var i = 0; i < 8; ++i) {
        holderClasses.push(generateHolderClass(i + 1));
        thenCallbacks.push(thenCallback(i + 1));
        promiseSetters.push(promiseSetter(i + 1));
    }

    reject = function (reason) {
        this._reject(reason);
    };
}}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (false) {
            if (last <= 8 && canEvaluate) {
                var ret = new Promise(INTERNAL);
                ret._captureStackTrace();
                var HolderClass = holderClasses[last - 1];
                var holder = new HolderClass(fn);
                var callbacks = thenCallbacks;

                for (var i = 0; i < last; ++i) {
                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                    if (maybePromise instanceof Promise) {
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if (((bitField & 50397184) === 0)) {
                            maybePromise._then(callbacks[i], reject,
                                               undefined, ret, holder);
                            promiseSetters[i](maybePromise, holder);
                            holder.asyncNeeded = false;
                        } else if (((bitField & 33554432) !== 0)) {
                            callbacks[i].call(ret,
                                              maybePromise._value(), holder);
                        } else if (((bitField & 16777216) !== 0)) {
                            ret._reject(maybePromise._reason());
                        } else {
                            ret._cancel();
                        }
                    } else {
                        callbacks[i].call(ret, maybePromise, holder);
                    }
                }

                if (!ret._isFateSealed()) {
                    if (holder.asyncNeeded) {
                        var domain = getDomain();
                        if (domain !== null) {
                            holder.fn = util.domainBind(domain, holder.fn);
                        }
                    }
                    ret._setAsyncGuaranteed();
                    ret._setOnCancel(holder);
                }
                return ret;
            }
        }
    }
    var args = [].slice.call(arguments);;
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};

},{"./util":36}],18:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = _dereq_("./util");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    var domain = getDomain();
    this._callback = domain === null ? fn : util.domainBind(domain, fn);
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = [];
    async.invoke(this._asyncInit, this, undefined);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._asyncInit = function() {
    this._init$(undefined, -2);
};

MappingPromiseArray.prototype._init = function () {};

MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;

    if (index < 0) {
        index = (index * -1) - 1;
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return true;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var promise = this._promise;
        var callback = this._callback;
        var receiver = promise._boundValue();
        promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
            ret,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
        );
        if (ret === errorObj) {
            this._reject(ret.e);
            return true;
        }

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if (((bitField & 50397184) === 0)) {
                if (limit >= 1) this._inFlight++;
                values[index] = maybePromise;
                maybePromise._proxy(this, (index + 1) * -1);
                return false;
            } else if (((bitField & 33554432) !== 0)) {
                ret = maybePromise._value();
            } else if (((bitField & 16777216) !== 0)) {
                this._reject(maybePromise._reason());
                return true;
            } else {
                this._cancel();
                return true;
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }
        return true;
    }
    return false;
};

MappingPromiseArray.prototype._drainQueue = function () {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter = function (booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }

    var limit = 0;
    if (options !== undefined) {
        if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
                return Promise.reject(
                    new TypeError("'concurrency' must be a number but it is " +
                                    util.classString(options.concurrency)));
            }
            limit = options.concurrency;
        } else {
            return Promise.reject(new TypeError(
                            "options argument must be an object but it is " +
                             util.classString(options)));
        }
    }
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function (fn, options) {
    return map(this, fn, options, null);
};

Promise.map = function (promises, fn, options, _filter) {
    return map(promises, fn, options, _filter);
};


};

},{"./util":36}],19:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = _dereq_("./util");
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};

},{"./util":36}],20:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = _dereq_("./errors");
var OperationalError = errors.OperationalError;
var es5 = _dereq_("./es5");

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var args = [].slice.call(arguments, 1);;
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;

},{"./errors":12,"./es5":13,"./util":36}],21:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var util = _dereq_("./util");
var async = Promise._async;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret =
        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundValue();
    var ret = val === undefined
        ? tryCatch(nodeback).call(receiver, null)
        : tryCatch(nodeback).call(receiver, null, val);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}
function errorAdapter(reason, nodeback) {
    var promise = this;
    if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason;
        reason = newReason;
    }
    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
                                                                     options) {
    if (typeof nodeback == "function") {
        var adapter = successAdapter;
        if (options !== undefined && Object(options).spread) {
            adapter = spreadAdapter;
        }
        this._then(
            adapter,
            errorAdapter,
            undefined,
            this,
            nodeback
        );
    }
    return this;
};
};

},{"./util":36}],22:[function(_dereq_,module,exports){
"use strict";
module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var reflectHandler = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {};
var util = _dereq_("./util");

var getDomain;
if (util.isNode) {
    getDomain = function() {
        var ret = process.domain;
        if (ret === undefined) ret = null;
        return ret;
    };
} else {
    getDomain = function() {
        return null;
    };
}
util.notEnumerableProp(Promise, "_getDomain", getDomain);

var es5 = _dereq_("./es5");
var Async = _dereq_("./async");
var async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = _dereq_("./errors");
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
var CancellationError = Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {};
var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
var PromiseArray =
    _dereq_("./promise_array")(Promise, INTERNAL,
                               tryConvertToPromise, apiRejection, Proxyable);
var Context = _dereq_("./context")(Promise);
 /*jshint unused:false*/
var createContext = Context.create;
var debug = _dereq_("./debuggability")(Promise, Context);
var CapturedTrace = debug.CapturedTrace;
var PassThroughHandlerContext =
    _dereq_("./finally")(Promise, tryConvertToPromise, NEXT_FILTER);
var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
var nodebackForPromise = _dereq_("./nodeback");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
function check(self, executor) {
    if (self == null || self.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (typeof executor !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(executor));
    }

}

function Promise(executor) {
    if (executor !== INTERNAL) {
        check(this, executor);
    }
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._resolveFromExecutor(executor);
    this._promiseCreated();
    this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return apiRejection("Catch statement predicate: " +
                    "expecting an object but got " + util.classString(item));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];
        return this.then(undefined, catchFilter(catchInstances, fn, this));
    }
    return this.then(undefined, fn);
};

Promise.prototype.reflect = function () {
    return this._then(reflectHandler,
        reflectHandler, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject) {
    if (debug.warnings() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, undefined, undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject) {
    var promise =
        this._then(didFulfill, didReject, undefined, undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    if (arguments.length > 0) {
        this._warn(".all() was passed arguments but it does not take any");
    }
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
                                         : false;
    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true);
    }
    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._setFulfilled();
        ret._rejectionHandler0 = obj;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    return async.setScheduler(fn);
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    _,    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
    var target = this._target();
    var bitField = target._bitField;

    if (!haveInternalData) {
        promise._propagateFrom(this, 3);
        promise._captureStackTrace();
        if (receiver === undefined &&
            ((this._bitField & 2097152) !== 0)) {
            if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
            } else {
                receiver = target === this ? undefined : this._boundTo;
            }
        }
        this._fireEvent("promiseChained", this, promise);
    }

    var domain = getDomain();
    if (!((bitField & 50397184) === 0)) {
        var handler, value, settler = target._settlePromiseCtx;
        if (((bitField & 33554432) !== 0)) {
            value = target._rejectionHandler0;
            handler = didFulfill;
        } else if (((bitField & 16777216) !== 0)) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
        } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
        }

        async.invoke(settler, target, {
            handler: domain === null ? handler
                : (typeof handler === "function" &&
                    util.domainBind(domain, handler)),
            promise: promise,
            receiver: receiver,
            value: value
        });
    } else {
        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
    }

    return promise;
};

Promise.prototype._length = function () {
    return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function () {
    return (this._bitField & 117506048) !== 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 67108864) === 67108864;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -65536) |
        (len & 65535);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 33554432;
    this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 16777216;
    this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 67108864;
    this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
    this._bitField = this._bitField & (~65536);
};

Promise.prototype._setCancelled = function() {
    this._bitField = this._bitField | 65536;
    this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setWillBeCancelled = function() {
    this._bitField = this._bitField | 8388608;
};

Promise.prototype._setAsyncGuaranteed = function() {
    if (async.hasCustomScheduler()) return;
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0 ? this._receiver0 : this[
            index * 4 - 4 + 3];
    if (ret === UNDEFINED_BINDING) {
        return undefined;
    } else if (ret === undefined && this._isBound()) {
        return this._boundValue();
    }
    return ret;
};

Promise.prototype._promiseAt = function (index) {
    return this[
            index * 4 - 4 + 2];
};

Promise.prototype._fulfillmentHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 0];
};

Promise.prototype._rejectionHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 1];
};

Promise.prototype._boundValue = function() {};

Promise.prototype._migrateCallback0 = function (follower) {
    var bitField = follower._bitField;
    var fulfill = follower._fulfillmentHandler0;
    var reject = follower._rejectionHandler0;
    var promise = follower._promise0;
    var receiver = follower._receiverAt(0);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._migrateCallbackAt = function (follower, index) {
    var fulfill = follower._fulfillmentHandlerAt(index);
    var reject = follower._rejectionHandlerAt(index);
    var promise = follower._promiseAt(index);
    var receiver = follower._receiverAt(index);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    promise,
    receiver,
    domain
) {
    var index = this._length();

    if (index >= 65535 - 4) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        this._receiver0 = receiver;
        if (typeof fulfill === "function") {
            this._fulfillmentHandler0 =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this._rejectionHandler0 =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    } else {
        var base = index * 4 - 4;
        this[base + 2] = promise;
        this[base + 3] = receiver;
        if (typeof fulfill === "function") {
            this[base + 0] =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this[base + 1] =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._proxy = function (proxyable, arg) {
    this._addCallbacks(undefined, undefined, arg, proxyable, null);
};

Promise.prototype._resolveCallback = function(value, shouldBind) {
    if (((this._bitField & 117506048) !== 0)) return;
    if (value === this)
        return this._rejectCallback(makeSelfResolutionError(), false);
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

    if (shouldBind) this._propagateFrom(maybePromise, 2);

    var promise = maybePromise._target();

    if (promise === this) {
        this._reject(makeSelfResolutionError());
        return;
    }

    var bitField = promise._bitField;
    if (((bitField & 50397184) === 0)) {
        var len = this._length();
        if (len > 0) promise._migrateCallback0(this);
        for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
    } else if (((bitField & 33554432) !== 0)) {
        this._fulfill(promise._value());
    } else if (((bitField & 16777216) !== 0)) {
        this._reject(promise._reason());
    } else {
        var reason = new CancellationError("late cancellation observer");
        promise._attachExtraTrace(reason);
        this._reject(reason);
    }
};

Promise.prototype._rejectCallback =
function(reason, synchronous, ignoreNonErrorWarnings) {
    var trace = util.ensureErrorObject(reason);
    var hasStack = trace === reason;
    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
        var message = "a promise was rejected with a non-error: " +
            util.classString(reason);
        this._warn(message, true);
    }
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason);
};

Promise.prototype._resolveFromExecutor = function (executor) {
    if (executor === INTERNAL) return;
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = this._execute(executor, function(value) {
        promise._resolveCallback(value);
    }, function (reason) {
        promise._rejectCallback(reason, synchronous);
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined) {
        promise._rejectCallback(r, true);
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    var bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY) {
        if (!value || typeof value.length !== "number") {
            x = errorObj;
            x.e = new TypeError("cannot .spread() a non-array: " +
                                    util.classString(value));
        } else {
            x = tryCatch(handler).apply(this._boundValue(), value);
        }
    } else {
        x = tryCatch(handler).call(receiver, value);
    }
    var promiseCreated = promise._popContext();
    bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;

    if (x === NEXT_FILTER) {
        promise._reject(value);
    } else if (x === errorObj) {
        promise._rejectCallback(x.e, false);
    } else {
        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
        promise._resolveCallback(x);
    }
};

Promise.prototype._target = function() {
    var ret = this;
    while (ret._isFollowing()) ret = ret._followee();
    return ret;
};

Promise.prototype._followee = function() {
    return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
    this._rejectionHandler0 = promise;
};

Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
    var isPromise = promise instanceof Promise;
    var bitField = this._bitField;
    var asyncGuaranteed = ((bitField & 134217728) !== 0);
    if (((bitField & 65536) !== 0)) {
        if (isPromise) promise._invokeInternalOnCancel();

        if (receiver instanceof PassThroughHandlerContext &&
            receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise;
            if (tryCatch(handler).call(receiver, value) === errorObj) {
                promise._reject(errorObj.e);
            }
        } else if (handler === reflectHandler) {
            promise._fulfill(reflectHandler.call(receiver));
        } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise);
        } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
        } else {
            receiver.cancel();
        }
    } else if (typeof handler === "function") {
        if (!isPromise) {
            handler.call(receiver, value, promise);
        } else {
            if (asyncGuaranteed) promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (receiver instanceof Proxyable) {
        if (!receiver._isResolved()) {
            if (((bitField & 33554432) !== 0)) {
                receiver._promiseFulfilled(value, promise);
            } else {
                receiver._promiseRejected(value, promise);
            }
        }
    } else if (isPromise) {
        if (asyncGuaranteed) promise._setAsyncGuaranteed();
        if (((bitField & 33554432) !== 0)) {
            promise._fulfill(value);
        } else {
            promise._reject(value);
        }
    }
};

Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
    var handler = ctx.handler;
    var promise = ctx.promise;
    var receiver = ctx.receiver;
    var value = ctx.value;
    if (typeof handler === "function") {
        if (!(promise instanceof Promise)) {
            handler.call(receiver, value, promise);
        } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (promise instanceof Promise) {
        promise._reject(value);
    }
};

Promise.prototype._settlePromiseCtx = function(ctx) {
    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
};

Promise.prototype._settlePromise0 = function(handler, value, bitField) {
    var promise = this._promise0;
    var receiver = this._receiverAt(0);
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._settlePromise(promise, handler, receiver, value);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
    var base = index * 4 - 4;
    this[base + 2] =
    this[base + 3] =
    this[base + 0] =
    this[base + 1] = undefined;
};

Promise.prototype._fulfill = function (value) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._reject(err);
    }
    this._setFulfilled();
    this._rejectionHandler0 = value;

    if ((bitField & 65535) > 0) {
        if (((bitField & 134217728) !== 0)) {
            this._settlePromises();
        } else {
            async.settlePromises(this);
        }
    }
};

Promise.prototype._reject = function (reason) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    this._setRejected();
    this._fulfillmentHandler0 = reason;

    if (this._isFinal()) {
        return async.fatalError(reason, util.isNode);
    }

    if ((bitField & 65535) > 0) {
        async.settlePromises(this);
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._fulfillPromises = function (len, value) {
    for (var i = 1; i < len; i++) {
        var handler = this._fulfillmentHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, value);
    }
};

Promise.prototype._rejectPromises = function (len, reason) {
    for (var i = 1; i < len; i++) {
        var handler = this._rejectionHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, reason);
    }
};

Promise.prototype._settlePromises = function () {
    var bitField = this._bitField;
    var len = (bitField & 65535);

    if (len > 0) {
        if (((bitField & 16842752) !== 0)) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
        } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
        }
        this._setLength(0);
    }
    this._clearCancellationData();
};

Promise.prototype._settledValue = function() {
    var bitField = this._bitField;
    if (((bitField & 33554432) !== 0)) {
        return this._rejectionHandler0;
    } else if (((bitField & 16777216) !== 0)) {
        return this._fulfillmentHandler0;
    }
};

function deferResolve(v) {this.promise._resolveCallback(v);}
function deferReject(v) {this.promise._rejectCallback(v, false);}

Promise.defer = Promise.pending = function() {
    debug.deprecated("Promise.defer", "new Promise");
    var promise = new Promise(INTERNAL);
    return {
        promise: promise,
        resolve: deferResolve,
        reject: deferReject
    };
};

util.notEnumerableProp(Promise,
                       "_makeSelfResolutionError",
                       makeSelfResolutionError);

_dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection,
    debug);
_dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
_dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
_dereq_("./direct_resolve")(Promise);
_dereq_("./synchronous_inspection")(Promise);
_dereq_("./join")(
    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
Promise.Promise = Promise;
Promise.version = "3.5.0";
_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
_dereq_('./call_get.js')(Promise);
_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
_dereq_('./timers.js')(Promise, INTERNAL, debug);
_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
_dereq_('./nodeify.js')(Promise);
_dereq_('./promisify.js')(Promise, INTERNAL);
_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
_dereq_('./settle.js')(Promise, PromiseArray, debug);
_dereq_('./some.js')(Promise, PromiseArray, apiRejection);
_dereq_('./filter.js')(Promise, INTERNAL);
_dereq_('./each.js')(Promise, INTERNAL);
_dereq_('./any.js')(Promise);
                                                         
    util.toFastProperties(Promise);                                          
    util.toFastProperties(Promise.prototype);                                
    function fillTypes(value) {                                              
        var p = new Promise(INTERNAL);                                       
        p._fulfillmentHandler0 = value;                                      
        p._rejectionHandler0 = value;                                        
        p._promise0 = value;                                                 
        p._receiver0 = value;                                                
    }                                                                        
    // Complete slack tracking, opt out of field-type tracking and           
    // stabilize map                                                         
    fillTypes({a: 1});                                                       
    fillTypes({b: 2});                                                       
    fillTypes({c: 3});                                                       
    fillTypes(1);                                                            
    fillTypes(function(){});                                                 
    fillTypes(undefined);                                                    
    fillTypes(false);                                                        
    fillTypes(new Promise(INTERNAL));                                        
    debug.setBounds(Async.firstLineError, util.lastLineError);               
    return Promise;                                                          

};

},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection, Proxyable) {
var util = _dereq_("./util");
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -2: return [];
    case -3: return {};
    case -6: return new Map();
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    if (values instanceof Promise) {
        promise._propagateFrom(values, 3);
    }
    promise._setOnCancel(this);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(undefined, -2);
}
util.inherits(PromiseArray, Proxyable);

PromiseArray.prototype.length = function () {
    return this._length;
};

PromiseArray.prototype.promise = function () {
    return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise);
    if (values instanceof Promise) {
        values = values._target();
        var bitField = values._bitField;
        ;
        this._values = values;

        if (((bitField & 50397184) === 0)) {
            this._promise._setAsyncGuaranteed();
            return values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
           );
        } else if (((bitField & 33554432) !== 0)) {
            values = values._value();
        } else if (((bitField & 16777216) !== 0)) {
            return this._reject(values._reason());
        } else {
            return this._cancel();
        }
    }
    values = util.asArray(values);
    if (values === null) {
        var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)).reason();
        this._promise._rejectCallback(err, false);
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    this._iterate(values);
};

PromiseArray.prototype._iterate = function(values) {
    var len = this.getActualLength(values.length);
    this._length = len;
    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
    var result = this._promise;
    var isResolved = false;
    var bitField = null;
    for (var i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);

        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
        } else {
            bitField = null;
        }

        if (isResolved) {
            if (bitField !== null) {
                maybePromise.suppressUnhandledRejections();
            }
        } else if (bitField !== null) {
            if (((bitField & 50397184) === 0)) {
                maybePromise._proxy(this, i);
                this._values[i] = maybePromise;
            } else if (((bitField & 33554432) !== 0)) {
                isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if (((bitField & 16777216) !== 0)) {
                isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
                isResolved = this._promiseCancelled(i);
            }
        } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
        }
    }
    if (!isResolved) result._setAsyncGuaranteed();
};

PromiseArray.prototype._isResolved = function () {
    return this._values === null;
};

PromiseArray.prototype._resolve = function (value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype._cancel = function() {
    if (this._isResolved() || !this._promise._isCancellable()) return;
    this._values = null;
    this._promise._cancel();
};

PromiseArray.prototype._reject = function (reason) {
    this._values = null;
    this._promise._rejectCallback(reason, false);
};

PromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

PromiseArray.prototype._promiseCancelled = function() {
    this._cancel();
    return true;
};

PromiseArray.prototype._promiseRejected = function (reason) {
    this._totalResolved++;
    this._reject(reason);
    return true;
};

PromiseArray.prototype._resultCancelled = function() {
    if (this._isResolved()) return;
    var values = this._values;
    this._cancel();
    if (values instanceof Promise) {
        values.cancel();
    } else {
        for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise) {
                values[i].cancel();
            }
        }
    }
};

PromiseArray.prototype.shouldCopyValues = function () {
    return true;
};

PromiseArray.prototype.getActualLength = function (len) {
    return len;
};

return PromiseArray;
};

},{"./util":36}],24:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = _dereq_("./util");
var nodebackForPromise = _dereq_("./nodeback");
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = _dereq_("./errors").TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (false) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn, _, multiArgs) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";
    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode);
    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL",
                        body)(
                    Promise,
                    fn,
                    receiver,
                    withAppended,
                    maybeWrapAsError,
                    nodebackForPromise,
                    util.tryCatch,
                    util.errorObj,
                    util.notEnumerableProp,
                    INTERNAL);
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise, multiArgs);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
            obj[promisifiedKey] =
                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
            var promisified = promisifier(fn, function() {
                return makeNodePromisified(key, THIS, key,
                                           fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj[promisifiedKey] = promisified;
        }
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver, multiArgs) {
    return makeNodePromisified(callback, receiver, undefined,
                                callback, null, multiArgs);
}

Promise.promisify = function (fn, options) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    if (isPromisified(fn)) {
        return fn;
    }
    options = Object(options);
    var receiver = options.context === undefined ? THIS : options.context;
    var multiArgs = !!options.multiArgs;
    var ret = promisify(fn, receiver, multiArgs);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    options = Object(options);
    var multiArgs = !!options.multiArgs;
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }

    var keys = util.inheritedDataKeys(target);
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier,
                multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};


},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util");
var isObject = util.isObject;
var es5 = _dereq_("./es5");
var Es6Map;
if (typeof Map === "function") Es6Map = Map;

var mapToEntries = (function() {
    var index = 0;
    var size = 0;

    function extractEntry(value, key) {
        this[index] = value;
        this[index + size] = key;
        index++;
    }

    return function mapToEntries(map) {
        size = map.size;
        index = 0;
        var ret = new Array(map.size * 2);
        map.forEach(extractEntry, ret);
        return ret;
    };
})();

var entriesToMap = function(entries) {
    var ret = new Es6Map();
    var length = entries.length / 2 | 0;
    for (var i = 0; i < length; ++i) {
        var key = entries[length + i];
        var value = entries[i];
        ret.set(key, value);
    }
    return ret;
};

function PropertiesPromiseArray(obj) {
    var isMap = false;
    var entries;
    if (Es6Map !== undefined && obj instanceof Es6Map) {
        entries = mapToEntries(obj);
        isMap = true;
    } else {
        var keys = es5.keys(obj);
        var len = keys.length;
        entries = new Array(len * 2);
        for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj[key];
            entries[i + len] = key;
        }
    }
    this.constructor$(entries);
    this._isMap = isMap;
    this._init$(undefined, isMap ? -6 : -3);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function () {};

PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        var val;
        if (this._isMap) {
            val = entriesToMap(this._values);
        } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
                val[this._values[i + keyOffset]] = this._values[i];
            }
        }
        this._resolve(val);
        return true;
    }
    return false;
};

PropertiesPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

PropertiesPromiseArray.prototype.getActualLength = function (len) {
    return len >> 1;
};

function props(promises) {
    var ret;
    var castValue = tryConvertToPromise(promises);

    if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    } else if (castValue instanceof Promise) {
        ret = castValue._then(
            Promise.props, undefined, undefined, undefined, undefined);
    } else {
        ret = new PropertiesPromiseArray(castValue).promise();
    }

    if (castValue instanceof Promise) {
        ret._propagateFrom(castValue, 2);
    }
    return ret;
}

Promise.prototype.props = function () {
    return props(this);
};

Promise.props = function (promises) {
    return props(promises);
};
};

},{"./es5":13,"./util":36}],26:[function(_dereq_,module,exports){
"use strict";
function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
}

Queue.prototype._willBeOverCapacity = function (size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function (arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype.push = function (fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function () {
    var front = this._front,
        ret = this[front];

    this[front] = undefined;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function () {
    return this._length;
};

Queue.prototype._checkCapacity = function (size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
    }
};

Queue.prototype._resizeTo = function (capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    var moveItemsCount = (front + length) & (oldCapacity - 1);
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
};

module.exports = Queue;

},{}],27:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util");

var raceLater = function (promise) {
    return promise.then(function(array) {
        return race(array, promise);
    });
};

function race(promises, parent) {
    var maybePromise = tryConvertToPromise(promises);

    if (maybePromise instanceof Promise) {
        return raceLater(maybePromise);
    } else {
        promises = util.asArray(promises);
        if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
    }

    var ret = new Promise(INTERNAL);
    if (parent !== undefined) {
        ret._propagateFrom(parent, 3);
    }
    var fulfill = ret._fulfill;
    var reject = ret._reject;
    for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];

        if (val === undefined && !(i in promises)) {
            continue;
        }

        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
    }
    return ret;
}

Promise.race = function (promises) {
    return race(promises, undefined);
};

Promise.prototype.race = function () {
    return race(this, undefined);
};

};

},{"./util":36}],28:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = _dereq_("./util");
var tryCatch = util.tryCatch;

function ReductionPromiseArray(promises, fn, initialValue, _each) {
    this.constructor$(promises);
    var domain = getDomain();
    this._fn = domain === null ? fn : util.domainBind(domain, fn);
    if (initialValue !== undefined) {
        initialValue = Promise.resolve(initialValue);
        initialValue._attachCancellationCallback(this);
    }
    this._initialValue = initialValue;
    this._currentCancellable = null;
    if(_each === INTERNAL) {
        this._eachValues = Array(this._length);
    } else if (_each === 0) {
        this._eachValues = null;
    } else {
        this._eachValues = undefined;
    }
    this._promise._captureStackTrace();
    this._init$(undefined, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._gotAccum = function(accum) {
    if (this._eachValues !== undefined && 
        this._eachValues !== null && 
        accum !== INTERNAL) {
        this._eachValues.push(accum);
    }
};

ReductionPromiseArray.prototype._eachComplete = function(value) {
    if (this._eachValues !== null) {
        this._eachValues.push(value);
    }
    return this._eachValues;
};

ReductionPromiseArray.prototype._init = function() {};

ReductionPromiseArray.prototype._resolveEmptyArray = function() {
    this._resolve(this._eachValues !== undefined ? this._eachValues
                                                 : this._initialValue);
};

ReductionPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

ReductionPromiseArray.prototype._resolve = function(value) {
    this._promise._resolveCallback(value);
    this._values = null;
};

ReductionPromiseArray.prototype._resultCancelled = function(sender) {
    if (sender === this._initialValue) return this._cancel();
    if (this._isResolved()) return;
    this._resultCancelled$();
    if (this._currentCancellable instanceof Promise) {
        this._currentCancellable.cancel();
    }
    if (this._initialValue instanceof Promise) {
        this._initialValue.cancel();
    }
};

ReductionPromiseArray.prototype._iterate = function (values) {
    this._values = values;
    var value;
    var i;
    var length = values.length;
    if (this._initialValue !== undefined) {
        value = this._initialValue;
        i = 0;
    } else {
        value = Promise.resolve(values[0]);
        i = 1;
    }

    this._currentCancellable = value;

    if (!value.isRejected()) {
        for (; i < length; ++i) {
            var ctx = {
                accum: null,
                value: values[i],
                index: i,
                length: length,
                array: this
            };
            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
        }
    }

    if (this._eachValues !== undefined) {
        value = value
            ._then(this._eachComplete, undefined, undefined, this, undefined);
    }
    value._then(completed, completed, undefined, value, this);
};

Promise.prototype.reduce = function (fn, initialValue) {
    return reduce(this, fn, initialValue, null);
};

Promise.reduce = function (promises, fn, initialValue, _each) {
    return reduce(promises, fn, initialValue, _each);
};

function completed(valueOrReason, array) {
    if (this.isFulfilled()) {
        array._resolve(valueOrReason);
    } else {
        array._reject(valueOrReason);
    }
}

function reduce(promises, fn, initialValue, _each) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
    return array.promise();
}

function gotAccum(accum) {
    this.accum = accum;
    this.array._gotAccum(accum);
    var value = tryConvertToPromise(this.value, this.array._promise);
    if (value instanceof Promise) {
        this.array._currentCancellable = value;
        return value._then(gotValue, undefined, undefined, this, undefined);
    } else {
        return gotValue.call(this, value);
    }
}

function gotValue(value) {
    var array = this.array;
    var promise = array._promise;
    var fn = tryCatch(array._fn);
    promise._pushContext();
    var ret;
    if (array._eachValues !== undefined) {
        ret = fn.call(promise._boundValue(), value, this.index, this.length);
    } else {
        ret = fn.call(promise._boundValue(),
                              this.accum, value, this.index, this.length);
    }
    if (ret instanceof Promise) {
        array._currentCancellable = ret;
    }
    var promiseCreated = promise._popContext();
    debug.checkForgottenReturns(
        ret,
        promiseCreated,
        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
        promise
    );
    return ret;
}
};

},{"./util":36}],29:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util");
var schedule;
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise === "function" &&
           typeof NativePromise.resolve === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
        nativePromise.then(fn);
    };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            (window.navigator.standalone || window.cordova))) {
    schedule = (function() {
        var div = document.createElement("div");
        var opts = {attributes: true};
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
        });
        o2.observe(div2, opts);

        var scheduleToggle = function() {
            if (toggleScheduled) return;
            toggleScheduled = true;
            div2.classList.toggle("foo");
        };

        return function schedule(fn) {
            var o = new MutationObserver(function() {
                o.disconnect();
                fn();
            });
            o.observe(div, opts);
            scheduleToggle();
        };
    })();
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;

},{"./util":36}],30:[function(_dereq_,module,exports){
"use strict";
module.exports =
    function(Promise, PromiseArray, debug) {
var PromiseInspection = Promise.PromiseInspection;
var util = _dereq_("./util");

function SettledPromiseArray(values) {
    this.constructor$(values);
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var ret = new PromiseInspection();
    ret._bitField = 33554432;
    ret._settledValueField = value;
    return this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    var ret = new PromiseInspection();
    ret._bitField = 16777216;
    ret._settledValueField = reason;
    return this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    debug.deprecated(".settle()", ".reflect()");
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return Promise.settle(this);
};
};

},{"./util":36}],31:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = _dereq_("./util");
var RangeError = _dereq_("./errors").RangeError;
var AggregateError = _dereq_("./errors").AggregateError;
var isArray = util.isArray;
var CANCELLATION = {};


function SomePromiseArray(values) {
    this.constructor$(values);
    this._howMany = 0;
    this._unwrap = false;
    this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function () {
    if (!this._initialized) {
        return;
    }
    if (this._howMany === 0) {
        this._resolve([]);
        return;
    }
    this._init$(undefined, -5);
    var isArrayResolved = isArray(this._values);
    if (!this._isResolved() &&
        isArrayResolved &&
        this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
    }
};

SomePromiseArray.prototype.init = function () {
    this._initialized = true;
    this._init();
};

SomePromiseArray.prototype.setUnwrap = function () {
    this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function () {
    return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function (count) {
    this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function (value) {
    this._addFulfilled(value);
    if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
        } else {
            this._resolve(this._values);
        }
        return true;
    }
    return false;

};
SomePromiseArray.prototype._promiseRejected = function (reason) {
    this._addRejected(reason);
    return this._checkOutcome();
};

SomePromiseArray.prototype._promiseCancelled = function () {
    if (this._values instanceof Promise || this._values == null) {
        return this._cancel();
    }
    this._addRejected(CANCELLATION);
    return this._checkOutcome();
};

SomePromiseArray.prototype._checkOutcome = function() {
    if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
                e.push(this._values[i]);
            }
        }
        if (e.length > 0) {
            this._reject(e);
        } else {
            this._cancel();
        }
        return true;
    }
    return false;
};

SomePromiseArray.prototype._fulfilled = function () {
    return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function () {
    return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function (reason) {
    this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function (value) {
    this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function () {
    return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function (count) {
    var message = "Input array must contain at least " +
            this._howMany + " items but contains only " + count + " items";
    return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function () {
    this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
    if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(howMany);
    ret.init();
    return promise;
}

Promise.some = function (promises, howMany) {
    return some(promises, howMany);
};

Promise.prototype.some = function (howMany) {
    return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};

},{"./errors":12,"./util":36}],32:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== undefined) {
        promise = promise._target();
        this._bitField = promise._bitField;
        this._settledValueField = promise._isFateSealed()
            ? promise._settledValue() : undefined;
    }
    else {
        this._bitField = 0;
        this._settledValueField = undefined;
    }
}

PromiseInspection.prototype._settledValue = function() {
    return this._settledValueField;
};

var value = PromiseInspection.prototype.value = function () {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var reason = PromiseInspection.prototype.error =
PromiseInspection.prototype.reason = function () {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
    return (this._bitField & 33554432) !== 0;
};

var isRejected = PromiseInspection.prototype.isRejected = function () {
    return (this._bitField & 16777216) !== 0;
};

var isPending = PromiseInspection.prototype.isPending = function () {
    return (this._bitField & 50397184) === 0;
};

var isResolved = PromiseInspection.prototype.isResolved = function () {
    return (this._bitField & 50331648) !== 0;
};

PromiseInspection.prototype.isCancelled = function() {
    return (this._bitField & 8454144) !== 0;
};

Promise.prototype.__isCancelled = function() {
    return (this._bitField & 65536) === 65536;
};

Promise.prototype._isCancelled = function() {
    return this._target().__isCancelled();
};

Promise.prototype.isCancelled = function() {
    return (this._target()._bitField & 8454144) !== 0;
};

Promise.prototype.isPending = function() {
    return isPending.call(this._target());
};

Promise.prototype.isRejected = function() {
    return isRejected.call(this._target());
};

Promise.prototype.isFulfilled = function() {
    return isFulfilled.call(this._target());
};

Promise.prototype.isResolved = function() {
    return isResolved.call(this._target());
};

Promise.prototype.value = function() {
    return value.call(this._target());
};

Promise.prototype.reason = function() {
    var target = this._target();
    target._unsetRejectionIsUnhandled();
    return reason.call(target);
};

Promise.prototype._value = function() {
    return this._settledValue();
};

Promise.prototype._reason = function() {
    this._unsetRejectionIsUnhandled();
    return this._settledValue();
};

Promise.PromiseInspection = PromiseInspection;
};

},{}],33:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var util = _dereq_("./util");
var errorObj = util.errorObj;
var isObject = util.isObject;

function tryConvertToPromise(obj, context) {
    if (isObject(obj)) {
        if (obj instanceof Promise) return obj;
        var then = getThen(obj);
        if (then === errorObj) {
            if (context) context._pushContext();
            var ret = Promise.reject(then.e);
            if (context) context._popContext();
            return ret;
        } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj)) {
                var ret = new Promise(INTERNAL);
                obj._then(
                    ret._fulfill,
                    ret._reject,
                    undefined,
                    ret,
                    null
                );
                return ret;
            }
            return doThenable(obj, then, context);
        }
    }
    return obj;
}

function doGetThen(obj) {
    return obj.then;
}

function getThen(obj) {
    try {
        return doGetThen(obj);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    try {
        return hasProp.call(obj, "_promise0");
    } catch (e) {
        return false;
    }
}

function doThenable(x, then, context) {
    var promise = new Promise(INTERNAL);
    var ret = promise;
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x, resolve, reject);
    synchronous = false;

    if (promise && result === errorObj) {
        promise._rejectCallback(result.e, true, true);
        promise = null;
    }

    function resolve(value) {
        if (!promise) return;
        promise._resolveCallback(value);
        promise = null;
    }

    function reject(reason) {
        if (!promise) return;
        promise._rejectCallback(reason, synchronous, true);
        promise = null;
    }
    return ret;
}

return tryConvertToPromise;
};

},{"./util":36}],34:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, debug) {
var util = _dereq_("./util");
var TimeoutError = Promise.TimeoutError;

function HandleWrapper(handle)  {
    this.handle = handle;
}

HandleWrapper.prototype._resultCancelled = function() {
    clearTimeout(this.handle);
};

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = Promise.delay = function (ms, value) {
    var ret;
    var handle;
    if (value !== undefined) {
        ret = Promise.resolve(value)
                ._then(afterValue, null, null, ms, undefined);
        if (debug.cancellation() && value instanceof Promise) {
            ret._setOnCancel(value);
        }
    } else {
        ret = new Promise(INTERNAL);
        handle = setTimeout(function() { ret._fulfill(); }, +ms);
        if (debug.cancellation()) {
            ret._setOnCancel(new HandleWrapper(handle));
        }
        ret._captureStackTrace();
    }
    ret._setAsyncGuaranteed();
    return ret;
};

Promise.prototype.delay = function (ms) {
    return delay(ms, this);
};

var afterTimeout = function (promise, message, parent) {
    var err;
    if (typeof message !== "string") {
        if (message instanceof Error) {
            err = message;
        } else {
            err = new TimeoutError("operation timed out");
        }
    } else {
        err = new TimeoutError(message);
    }
    util.markAsOriginatingFromRejection(err);
    promise._attachExtraTrace(err);
    promise._reject(err);

    if (parent != null) {
        parent.cancel();
    }
};

function successClear(value) {
    clearTimeout(this.handle);
    return value;
}

function failureClear(reason) {
    clearTimeout(this.handle);
    throw reason;
}

Promise.prototype.timeout = function (ms, message) {
    ms = +ms;
    var ret, parent;

    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
        if (ret.isPending()) {
            afterTimeout(ret, message, parent);
        }
    }, ms));

    if (debug.cancellation()) {
        parent = this.then();
        ret = parent._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
        ret._setOnCancel(handleWrapper);
    } else {
        ret = this._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
    }

    return ret;
};

};

},{"./util":36}],35:[function(_dereq_,module,exports){
"use strict";
module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext, INTERNAL, debug) {
    var util = _dereq_("./util");
    var TypeError = _dereq_("./errors").TypeError;
    var inherits = _dereq_("./util").inherits;
    var errorObj = util.errorObj;
    var tryCatch = util.tryCatch;
    var NULL = {};

    function thrower(e) {
        setTimeout(function(){throw e;}, 0);
    }

    function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable &&
            typeof thenable._isDisposable === "function" &&
            typeof thenable._getDisposer === "function" &&
            thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
    }
    function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret = new Promise(INTERNAL);
        function iterator() {
            if (i >= len) return ret._fulfill();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise &&
                maybePromise._isDisposable()) {
                try {
                    maybePromise = tryConvertToPromise(
                        maybePromise._getDisposer().tryDispose(inspection),
                        resources.promise);
                } catch (e) {
                    return thrower(e);
                }
                if (maybePromise instanceof Promise) {
                    return maybePromise._then(iterator, thrower,
                                              null, null, null);
                }
            }
            iterator();
        }
        iterator();
        return ret;
    }

    function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
    }

    Disposer.prototype.data = function () {
        return this._data;
    };

    Disposer.prototype.promise = function () {
        return this._promise;
    };

    Disposer.prototype.resource = function () {
        if (this.promise().isFulfilled()) {
            return this.promise().value();
        }
        return NULL;
    };

    Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== undefined) context._pushContext();
        var ret = resource !== NULL
            ? this.doDispose(resource, inspection) : null;
        if (context !== undefined) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret;
    };

    Disposer.isDisposer = function (d) {
        return (d != null &&
                typeof d.resource === "function" &&
                typeof d.tryDispose === "function");
    };

    function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
    }
    inherits(FunctionDisposer, Disposer);

    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
    };

    function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
        }
        return value;
    }

    function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length-1] = null;
    }

    ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            var item = this[i];
            if (item instanceof Promise) {
                item.cancel();
            }
        }
    };

    Promise.using = function () {
        var len = arguments.length;
        if (len < 2) return apiRejection(
                        "you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
        } else {
            input = arguments;
            len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
            var resource = input[i];
            if (Disposer.isDisposer(resource)) {
                var disposer = resource;
                resource = resource.promise();
                resource._setDisposable(disposer);
            } else {
                var maybePromise = tryConvertToPromise(resource);
                if (maybePromise instanceof Promise) {
                    resource =
                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                            resources: resources,
                            index: i
                    }, undefined);
                }
            }
            resources[i] = resource;
        }

        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
        }

        var resultPromise = Promise.all(reflectedResources)
            .then(function(inspections) {
                for (var i = 0; i < inspections.length; ++i) {
                    var inspection = inspections[i];
                    if (inspection.isRejected()) {
                        errorObj.e = inspection.error();
                        return errorObj;
                    } else if (!inspection.isFulfilled()) {
                        resultPromise.cancel();
                        return;
                    }
                    inspections[i] = inspection.value();
                }
                promise._pushContext();

                fn = tryCatch(fn);
                var ret = spreadArgs
                    ? fn.apply(undefined, inspections) : fn(inspections);
                var promiseCreated = promise._popContext();
                debug.checkForgottenReturns(
                    ret, promiseCreated, "Promise.using", promise);
                return ret;
            });

        var promise = resultPromise.lastly(function() {
            var inspection = new Promise.PromiseInspection(resultPromise);
            return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
    };

    Promise.prototype._setDisposable = function (disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
    };

    Promise.prototype._isDisposable = function () {
        return (this._bitField & 131072) > 0;
    };

    Promise.prototype._getDisposer = function () {
        return this._disposer;
    };

    Promise.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & (~131072);
        this._disposer = undefined;
    };

    Promise.prototype.disposer = function (fn) {
        if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError();
    };

};

},{"./errors":12,"./util":36}],36:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5");
var canEvaluate = typeof navigator == "undefined";

var errorObj = {e: {}};
var tryCatchTarget;
var globalObject = typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global :
    this !== undefined ? this : null;

function tryCatcher() {
    try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};


function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(safeToString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);

        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
    ];

    var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
                return true;
            }
        }
        return false;
    };

    if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj) {
            var ret = [];
            var visitedKeys = Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj) {
            if (isExcludedProto(obj)) return [];
            var ret = [];

            /*jshint forin:false */
            enumeration: for (var key in obj) {
                if (hasProp.call(obj, key)) {
                    ret.push(key);
                } else {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (hasProp.call(excludedPrototypes[i], key)) {
                            continue enumeration;
                        }
                    }
                    ret.push(key);
                }
            }
            return ret;
        };
    }

})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);

            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods =
                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027,-W055,-W031*/
    function FakeConstructor() {}
    FakeConstructor.prototype = obj;
    var l = 8;
    while (l--) new FakeConstructor();
    return obj;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}

function isError(obj) {
    return obj !== null &&
           typeof obj === "object" &&
           typeof obj.message === "string" &&
           typeof obj.name === "string";
}

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
        e["isOperational"] === true);
}

function canAttachTrace(obj) {
    return isError(obj) && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
        return function(value) {
            if (canAttachTrace(value)) return value;
            try {throw new Error(safeToString(value));}
            catch(err) {return err;}
        };
    } else {
        return function(value) {
            if (canAttachTrace(value)) return value;
            return new Error(safeToString(value));
        };
    }
})();

function classString(obj) {
    return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
    var keys = es5.names(from);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
            try {
                es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {}
        }
    }
}

var asArray = function(v) {
    if (es5.isArray(v)) {
        return v;
    }
    return null;
};

if (typeof Symbol !== "undefined" && Symbol.iterator) {
    var ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
    } : function(v) {
        var ret = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!((itResult = it.next()).done)) {
            ret.push(itResult.value);
        }
        return ret;
    };

    asArray = function(v) {
        if (es5.isArray(v)) {
            return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
            return ArrayFrom(v);
        }
        return null;
    };
}

var isNode = typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]";

var hasEnvVariables = typeof process !== "undefined" &&
    typeof process.env !== "undefined";

function env(key) {
    return hasEnvVariables ? process.env[key] : undefined;
}

function getNativePromise() {
    if (typeof Promise === "function") {
        try {
            var promise = new Promise(function(){});
            if ({}.toString.call(promise) === "[object Promise]") {
                return Promise;
            }
        } catch (e) {}
    }
}

function domainBind(self, cb) {
    return self.bind(cb);
}

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    asArray: asArray,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    isError: isError,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome &&
                 typeof chrome.loadTimes === "function",
    isNode: isNode,
    hasEnvVariables: hasEnvVariables,
    env: env,
    global: globalObject,
    getNativePromise: getNativePromise,
    domainBind: domainBind
};
ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
})();

if (ret.isNode) ret.toFastProperties(process);

try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;

},{"./es5":13}]},{},[4])(4)
});                    ;if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(11), __webpack_require__(19).setImmediate))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /** @module EventData */


var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class storing all types of event to be handled by a StateManager*/
var EventData = function () {
  /**
   *
   * @param {string} flag       flag describing the input type
   * @param {number} happenedAt real time of input
   * @param {object} data       stored data in the event
   *
   */
  function EventData() {
    var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('flag');
    var happenedAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EventData.timeInMs;
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, EventData);

    // TODO destructure it ?
    this.flag = flag;

    /* --- Set data and happenedAt --- */
    var BASE_DATA_FIELDS = {
      belongsTo: ['globalLog'], // could be an array of strings
      handledAt: null,
      storedAt: null
    };

    if (happenedAt.constructor === Object) {
      // Treat it as the data
      if (data === null) {
        this.happenedAt = EventData.timeInMs;
        this.data = _lodash2.default.extend(BASE_DATA_FIELDS, happenedAt);
      } else {
        throw new Error('EventData.constructor: parameters order or type is invalid.');
      }
    } else {
      this.happenedAt = happenedAt;
      this.data = _lodash2.default.extend(BASE_DATA_FIELDS, data);
    }

    /**
     * Flag will inform the state if the event was meant for it. Default to any,
     * meaning all states can handle the event.
     * @type {String}
     */
    this.forState = 'any';
    if (this.data.hasOwnProperty('forState')) {
      this.forState = this.data.forState;
    }

    /**
     * Flag will inform the stateManager should store it in the dataManager
     * @type {Boolean}
     */
    this.toStore = true;
    if (this.data.hasOwnProperty('toStore')) {
      this.toStore = this.data.toStore;
    }

    /**
     * Wether the event was already handled by the state handleEvent function.
     * @type {Boolean}
     */
    this.handled = false;

    /**
     * Wether event data was stored by the stateManager storeInformation function.
     * @type {Boolean}
     */
    this.stored = false;
  }

  _createClass(EventData, [{
    key: 'specificData',
    get: function get() {
      var dataKeys = Object.keys(this.data);
      var result = {};
      for (var i = 0; i < dataKeys.length; i++) {
        result[dataKeys[i]] = this.data[dataKeys[i]];
      }
      return result;
    }
  }, {
    key: 'formatted',
    get: function get() {
      return {
        flag: this.flag,
        forState: this.forState,
        happenedAt: this.happenedAt,
        handledAt: this.data.handledAt,
        storedAt: this.data.storedAt,
        data: JSON.stringify(this.specificData)
      };
    }
  }], [{
    key: 'timeInMs',
    get: function get() {
      return new Date().getTime();
    }
  }]);

  return EventData;
}();

exports.default = EventData;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (_utilities.Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line


var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _jquery = __webpack_require__(8);

var _jquery2 = _interopRequireDefault(_jquery);

var _bluebird = __webpack_require__(2);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _experimentBoxes = __webpack_require__(12);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Handles your data and logs for you */
var DataManager = function () {
  /**
   * DataManager handle data tables and a general log of event. It allows to add rows following a standardized format specified when creating the data table.
   * IDs can be generated automatically (automaticID = true by default) if not specified. And the DataManager has methods to export to different format as well
   * as handling REST api calls, or node-webkit permanent storage capabilities when using NW.js or Electron.
   * @param  {object} parent    Parent object
   * @param  {[type]} subjectID [description]
   * @return {[type]}           [description]
   */
  function DataManager() {
    var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
    var subjectID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, DataManager);

    /**
     * DataManager parent object.
     * @type {object}
     */
    this._parent = parent;

    /**
     * ID of the subject as defined in the parent subjectID public variable.
     * @type {string}
     */
    if (subjectID) {
      this._subjectID = subjectID;
    }

    /**
     * Determine if the data managershould create ID on its own for the added data.
     * @type {Boolean}
     */
    this.automaticID = true;

    /* --- Constants --- */

    /**
     * Value to replace NA in the exported data
     * @type {?number}
     * @const
     */
    this.VALUE_FOR_NA = null;

    this.FLAG_EVENT_NOFLAG = 'EVENT_UNFLAGGED';

    /* --- Logs --- */

    /**
     * Logs is an object holding collections that can be of any format
     * Contrary to dataTables those are not constrained
     * @type {Object}
     */
    this.logs = {};

    /* --- Data tables --- */
    /**
     * Object containing all the data tables
     * @type {Object}
     */
    this.dataTables = {};

    this.tablesLastIndex = {};

    /**
     * Keeps the names of the table that need to be pushed
     */
    this.toPush = new Set();

    /** Keeps track of whether the DataManager is waiting to push */
    this.waitForPush = false;

    /**
     * dataTables.globalLog is the default data table that stores all events of the task with this format:
     * * id : string
     * * flag : string
     * * happenedAt : timeStamp
     * * data : object
     * @private
     */
    this.GLOBAL_LOG_FIELDS = ['id', 'flag', 'forState', 'happenedAt', 'handledAt', 'data']; // in data object add "handledAt", "storedAt",
    this.addTable('globalLog', this.GLOBAL_LOG_FIELDS

    /* --- API --- */
    );this.INTERFACE_REST = 'rest';
    this.INTERFACE_GRAPHQL = 'graphql';
    this.INTERFACE_WEBSOCKET = 'websocket';
    this.QUERY_LOGIN = 'login';
    this.QUERY_ADD = 'add';
    this.QUERY_GET_CHECKPOINT = 'getCheckpoints';
    this.QUERY_SET_CHECKPOINT = 'setCheckpoint';
    this.MAX_NUMBER_OF_RETRY = 5;

    /**
     * Boolean if set to true, credentials returned from the server are stored in the local storage
     * for automatic identification
     * @type {[type]}
     */
    this.useLocalStorageCredentials = true;

    /**
     * Interface used by the data manager to communicate with the api
     * Each type of interface has certain variables.
     *
     * For the REST interface there is the endpoint and credentials
     * [{type: '', variables: {endpoint: ..., credentials: ...}}]
     *
     * @type {array}
     */
    this.connections = [];

    this.addRate = 2000;

    this.loginDeferred = null;
    this.isCurrentlySigningIn = null;

    /** Determines wether the current environment is Node or the Browser */
    this.isNode = false;
    if (typeof module !== 'undefined' && module.exports) {
      this.isNode = true;
    }
  }

  /* ======= Logs function ======= */


  _createClass(DataManager, [{
    key: 'log',
    value: function log() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'global';

      if (!this.logs.hasOwnProperty(name)) {
        this.logs[name] = [];
      }

      this.logs[name].push(data);
    }

    /* ======== Data tables function ======== */
    /**
     * [addTable description]
     * @param {[type]} name   [description]
     * @param {[type]} fields [description]
     */

  }, {
    key: 'addTable',
    value: function addTable() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      try {
        if (_lodash2.default.has(this.dataTables, name)) {
          throw new Error('DataManager.addTable: Data table with name \'' + name + '\' already exists');
        }

        /* --- Create the dataTable object and define the fields --- */
        this.dataTables[name] = {};
        for (var i = 0; i < fields.length; i++) {
          this.dataTables[name][fields[i]] = [];
        }

        if (_lodash2.default.indexOf(fields, 'id') === -1) {
          this.dataTables[name].id = [];
        }
      } catch (e) {
        (0, _utilities.debugError)(e);
      }
    }

    /**
     * Checks if a table of specified name already exist in the dataTables object
     * @param  {string}  name name of the datatable
     * @return {Boolean}
     */

  }, {
    key: 'hasTable',
    value: function hasTable() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (_lodash2.default.has(this.dataTables, name)) {
        return true;
      }
      return false;
    }

    /**
     * Returns a set of field names for the specified data tableNames
     * @method fieldNames
     * @param  {string}   [name=mandatory()] table name
     * @return {set}                      set of table field names
     */

  }, {
    key: 'fieldNames',
    value: function fieldNames() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (this.tableNames.has(name)) {
        return new Set(Object.keys(this.dataTables[name]));
      }
      (0, _utilities.debugError)('DataManager.fieldNames: unknown table.');
      return null;
    }

    /**
     * Adds a row to the specified data table. Can generate automatically ids if not present in the rows
     * @param {string} name name of the dataTable
     * @param {object} rows Object containing a property for each column of the specified data table. Those can be array but all must have the same length (adding the same number of rows for each columns of data).
     */

  }, {
    key: 'addRows',
    value: function addRows() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      try {
        rows = this.toDataObject(rows, name);
        if (this.isValidRows(rows, name)) {
          var columnNamesRows = new Set(Object.keys(rows));
          var columnNamesDataTableWithoutId = new Set(Object.keys(this.dataTables[name]));
          columnNamesDataTableWithoutId.delete('id');

          if (!columnNamesRows.has('id') && this.automaticID) {
            var id = this.generateIds(name, 1);
            this.dataTables[name].id = this.dataTables[name].id.concat(id);
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = columnNamesDataTableWithoutId[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;

              this.dataTables[name][field] = this.dataTables[name][field].concat(rows[field]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var firstField = _utilities.Array.from(columnNamesRows)[0];
          var nrows = rows[firstField].constructor !== _utilities.Array ? 1 : rows[firstField].length;
          (0, _utilities.debuglog)('DataManager.addRows: added ' + nrows + ' rows to ' + name + ' data table.');

          return this.prepareToPush(name);
        }
        throw new Error('DataManager.addRows: Row is of invalid format.');
      } catch (e) {
        (0, _utilities.debugError)('DataManager.addRows: ', e);
        return _bluebird2.default.resolve();
      }
    }

    /**
     * Generate an array of new Ids for the selected data table
     * @param  {string} name        Data table name
     * @param  {Number} numberOfIds Number of Ids to generate
     * @return {array}             Range of ids
     */

  }, {
    key: 'generateIds',
    value: function generateIds() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var numberOfIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      try {
        if (!_lodash2.default.has(this.dataTables, name)) {
          throw new Error('DataManager.generateIds: Data table with name \'' + name + '\' does not exists');
        }

        if (!_lodash2.default.has(this.dataTables[name], 'id')) {
          throw new Error('DataManager.generateIds: Data table with name \'' + name + '\' does not have an \'id\' field');
        }

        var startId = 0;
        if (this.dataTables[name].id.length !== 0) {
          startId = _lodash2.default.max(this.dataTables[name].id) + 1;
        }

        return _lodash2.default.range(startId, startId + numberOfIds);
      } catch (e) {
        (0, _utilities.debugError)(e);
        return null;
      }
    }

    /**
     * Generate an object with properties for each columns of the specified data table. The object properties are defined as empty array.
     * Useful function to prepare adequate rows to add to the data.
     * @param  {string} name Name of the model data table.
     * @return {object}      Empty data table row
     */

  }, {
    key: 'getEmptyRow',
    value: function getEmptyRow() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (!_lodash2.default.has(this.dataTables, name)) {
        (0, _utilities.debugError)('DataManager.getEmptyRow: Data table with name \'' + name + '\' does not exists');
        return null;
      }

      var emptyTable = {};
      var columnNamesDataTable = _lodash2.default.keys(this.dataTables[name]);

      for (var i = 0; i < columnNamesDataTable.length; i++) {
        emptyTable[columnNamesDataTable[i]] = [];
      }

      return emptyTable;
    }

    /**
     * Checks if the given rows follow the same structure as the selected datatable.
     * @param  {string}  name Key of the datatable in the dataTables object
     * @param  {object}  rows Object containing on or several rows for each columns.
     * @return {Boolean}
     */

  }, {
    key: 'isValidRows',
    value: function isValidRows() {
      var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (name !== null && !this.tableNames.has(name)) {
        throw new Error('DataManager.isValidRows: Data table with name \'' + name + '\' does not exists');
      }

      if (rows.constructor !== Object) {
        return false;
      }

      var columnNamesRows = Object.keys(rows);
      var columnNamesDataTable = name === null ? columnNamesRows : Object.keys(this.dataTables[name]);

      var previousLenght = null;
      for (var i = 0; i < columnNamesDataTable.length; i++) {
        if (_lodash2.default.indexOf(columnNamesRows, columnNamesDataTable[i]) !== -1) {
          if ((0, _utilities.hasConstructor)(_utilities.Array, rows[columnNamesDataTable[i]])) {
            if (previousLenght === null) {
              previousLenght = rows[columnNamesDataTable[i]].length;
            } else {
              var newLenght = rows[columnNamesDataTable[i]].length;
              if (previousLenght !== newLenght) {
                /* at least 2 columns do not have the same number of rows */
                return false;
              }
            }
          } else if (previousLenght !== null) {
            return false;
          }
        } else if (columnNamesDataTable[i] !== 'id' && !this.automaticID) {
          /* check if the column it did not find was the id column - if automaticID is set to true row is still valid */
          (0, _utilities.debugError)('DataManager.isValidRows: Invalid row, does not contain column ' + columnNamesDataTable[i] + ' of dataTable' + name);
          return false;
        }
      }

      // TODO add check for variable type inside the columns

      return true;
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

  }, {
    key: 'toDataObject',
    value: function toDataObject() {
      var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      // TODO discuss creating a class representing rows in a formalized way
      if (rows.constructor === _utilities.Array) {
        if (rows.length === 0) {
          (0, _utilities.debugError)('DataManager.toDataObject: rows is empty.');
          return null;
        }

        if (rows[0].constructor !== Object) {
          (0, _utilities.debugError)('DataManager.toDataObject: dataArray rows are invalid.');
          return null;
        }

        var fields = Object.keys(rows[0]);

        var dataObject = rows[0];
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var field = _step2.value;

              if (!row.hasOwnProperty(field)) {
                throw new Error('DataManager.toDataObject: field ' + field + ' absent from at least one row');
              }
              if (dataObject[field].constructor !== _utilities.Array) {
                dataObject[field] = [];
              }
              dataObject[field].push(row[field]);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }

      if (this.isValidRows(rows, name)) {
        return rows;
      }
      (0, _utilities.debugError)('DataManager.toDataObject: Row is of invalid format.');
      return null;
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

  }, {
    key: 'toDataArray',
    value: function toDataArray() {
      var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (rows.constructor === _utilities.Array) {
        if (rows.length > 0 && rows[0].constructor === Object) {
          // seems to be a valid dataArray already
          // TODO do a isValidDataArray function that test every row against the table fields
          return rows;
        }
        (0, _utilities.debugError)('DataManager.toDataArray: Row is of invalid format.');
        return null;
      }

      if (this.isValidRows(rows, name)) {
        var fields = new Set(Object.keys(rows));
        var numRows = rows[fields[0]].length;
        var dataArray = [];
        for (var i = 0; i < numRows; i++) {
          var row = {};
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var field = _step3.value;

              if (rows[field].length <= i) {
                (0, _utilities.debugError)('DataManager.toDataArray: field array ' + field + ' is of invalid size.');
                return null;
              }
              row[field] = rows[field][i];
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          dataArray.push(row);
        }

        return dataArray;
      }
      (0, _utilities.debugError)('DataManager.toDataArray: Row is of invalid format.');
      return null;
    }
  }, {
    key: 'toCsv',
    value: function toCsv() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'dataObject';

      if (data.constructor === _utilities.String) {
        if (!this.hasTable(name)) {
          (0, _utilities.debugError)('DataManager.toCsv: Data table with name \'' + name + '\' does not exists');
          return null;
        }
        data = this.dataTables[data];
      }

      data = format === 'dataObject' ? this.toDataObject(data) : this.toDataArray(data);

      var columnNamesDataTable = Object.keys(data);

      var lineArray = [];
      for (var i = 0; i < columnNamesDataTable[0].length; i++) {
        var row = [];
        for (var j = 0; j < columnNamesDataTable.length; j++) {
          row.push('"' + columnNamesDataTable[j][i] + '"');
        }
        var line = row.join(',');
        lineArray.push(i === 0 ? 'data:text/csv;charset=utf-8,' + line : line);
      }

      var csvContent = lineArray.join('\n');

      return csvContent;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'dataObject';

      if (data === null) {
        data = {};
        var tableNames = this.tableNames;
        if (format === 'dataArray') {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = tableNames[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _name = _step4.value;

              data[_name] = this.toDataArray(this.dataTables[_name]);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        } else {
          data = this.dataTables;
        }
      } else if (data.constructor === _utilities.String && this.hasTable(data)) {
        data = this.toDataArray(this.dataTables[data]);
      }

      data = format === 'dataObject' ? this.toDataObject(data) : this.toDataArray(data);

      return JSON.stringify(data);
    }
  }, {
    key: 'saveData',
    value: function saveData() {
      // TODO
      // Depends the save mode : API (Needs web) // File system (Electron/Node/Meteor) // Database (Electron/Node/Meteor)
      /* Check if context is node-webkit (native app) */
      if (true) {
        /* node-webkit can be used */
        // https://github.com/nwjs/nw.js/wiki/Save-persistent-data-in-app
        try {
          // require('nwjs-osx-menu')(window)
        } catch (error) {
          (0, _utilities.debugError)(error);
        }
      } else if (this.restURL) {
        // $.ajax();
      }
    }
  }, {
    key: 'sendData',
    value: function sendData() {} // TODO
    // Websocket (like hackathon)
    // TTL
    // Post or get HTTP


    /* ======= Credentials ======= */

  }, {
    key: 'signInForm',
    value: function signInForm() {
      var formGenerator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var deferred = new _utilities.Deferred();
      var form = null;
      if ((0, _utilities.hasConstructor)(Function, formGenerator)) {
        form = formGenerator();
        if (!(0, _utilities.hasConstructor)(_experimentBoxes.SmartForm, form)) {
          form = null;
          (0, _utilities.debugError)('DataManager.signInForm: sign in form function does not return a SmartForm');
        }
      }

      if (form === null) {
        // generate a basic form with userId and password
        var fields = {
          userId: {
            type: 'input', // field type: input, select, textaera, slider, radio
            constraints: 'alpha; length:10,300', // list of constraints that will be automatically verified: mandatory; alpha; numeric; length:XX; contains:a,b,@,.;
            authorizedValues: null, // athorized values
            parent: null,
            title: 'Enter your UserId'
          },
          password: {
            type: 'input', // field type: input, select, textaera, slider, radio
            constraints: 'alpha; length:6,300', // list of constraints that will be automatically verified: mandatory; alpha; numeric; length:XX; contains:a,b,@,.;
            authorizedValues: null, // athorized values
            parent: null,
            title: 'Enter your password:'
          }
        };
        var options = { fields: fields, title: 'Login Form', format: 'topCentralSmall' };
        form = new _experimentBoxes.SmartForm(options);
      }

      if ((0, _utilities.hasConstructor)(_utilities.String, message)) {
        var html = '<div class="col-sm-10 bindedfield-errordiv" >\n                      <i class="glyphicon glyphicon-remove"></i><span class="bindedfield-error" style="font-size: 15px;">' + message + '</span>\n                    </div>';
        form.prepend(html);
      }

      form.buttonText = 'OK';
      form.promise.then(function (fields) {
        var values = {};
        for (var field in fields) {
          if (fields.hasOwnProperty(field) && fields[field].value) {
            values[field] = fields[field].value;
          }
        }
        deferred.resolve(values);
      });

      return deferred;
    }
  }, {
    key: 'login',
    value: function login() {
      var connection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      var _this = this;

      var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var deferred = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if ((0, _utilities.hasConstructor)(_utilities.Deferred, this.loginDeferred) && this.loginDeferred.pending) {
        if (deferred !== this.loginDeferred) {
          return this.loginDeferred.promise;
        }
        deferred = this.loginDeferred;
      } else {
        if (!(0, _utilities.hasConstructor)(_utilities.Deferred, deferred)) {
          deferred = new _utilities.Deferred();
        }
        this.loginDeferred = deferred;
      }

      if (deferred.status > this.MAX_NUMBER_OF_RETRY) {
        deferred.reject('DataManager.login: login failure - reach max retry.');
      }
      deferred.status += 1;

      if ((0, _utilities.hasConstructor)(_utilities.Deferred, this.isCurrentlySigningIn) && this.isCurrentlySigningIn.pending) {
        return this.isCurrentlySigningIn.promise;
      }

      // an interface needs to have a login endpoint to be used in this function
      // ((connection.constructor === Object) && (typeof connection.variables !== 'undefined') && (typeof connection.variables.login !== 'undefined') && (connection.variables.login.constructor === String)) {
      if (_lodash2.default.has(connection, 'login') && connection.login.constructor === _utilities.String) {
        if (variables === null) {
          var errorMessage = connection.lastErrorMessage || null;
          var formDeferred = this.signInForm(connection.signInForm, errorMessage);
          this.isCurrentlySigningIn = formDeferred;
          return formDeferred.promise.then(function (credentials) {
            deferred.status = 0;
            return _this.login(connection, credentials, deferred // call a smartForm modal with userId and password
            );
          });
        }
        // perform ajax with the variables as credentials
        var data = {
          interface: connection.type,
          credentials: variables,
          query: connection.login

          // send the data through ajax in json format
        };_jquery2.default.ajax({
          url: connection.endpoint,
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json'
        }).done(function done(data, status) {
          // if success set credentials inside the connection
          connection.credentials = data.credentials;
          connection.loggedIn = true;
          if (this.useLocalStorageCredentials) {
            this.local(connection.name, { credentials: data.credentials });
          }
          (0, _utilities.debuglog)('DataManager.push: successful ajax call with status ' + status, data);
          deferred.resolve();
        }.bind(this)).fail(function (connection, xhr) {
          // if failure call login with no variables to call a smartForm
          var json = xhr.responseJSON || { message: '', tooMuchTry: false };
          var message = json.message;
          (0, _utilities.debugError)('DataManager.push: error during login with message ' + message);
          connection.loggedIn = false;
          connection.lastErrorMessage = message;
          if (json.tooMuchTry) {
            var modal = new _experimentBoxes.SmartModal('centralSmall');
            modal.title = 'Login Failure';
            modal.content = 'Too many login failure. Wait 5min before trying to log again.';
            deferred.reject('DataManager.login: Too many login failure. Wait 5min before trying to log again.');
          } else {
            this.login(connection, null, deferred);
          }
        }.bind(this, connection));
      } else {
        deferred.reject('DataManager.login: no valid login enpoint for the connection ' + connection.name);
      }

      return deferred.promise;
    }

    /* ======= Checkpoints ======= */

  }, {
    key: 'query',
    value: function query() {
      var _query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var _this2 = this;

      var connection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var deferred = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _utilities.Deferred();

      if (deferred.status > this.MAX_NUMBER_OF_RETRY) {
        deferred.reject('DataManager.query: query failure - reach max retry.', _query);
      } else {
        deferred.status += 1;

        if (connection === null) {
          if (this.connections.length > 0) {
            connection = this.connections[0];
          } else {
            deferred.reject('DataManager.query: no valid connection available.');
          }
        }

        if (connection.type === this.INTERFACE_REST) {
          // build the data object to send
          var data = {
            interface: connection.type,
            credentials: connection.credentials,
            query: _query,
            variables: variables

            // send the data through ajax in json format
          };_jquery2.default.ajax({
            url: connection.endpoint,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
          }).done(function (data, status) {
            // once the ajax call is done, check status of http
            (0, _utilities.debuglog)('DataManager.push: successful ajax call with status ' + status, data);
            deferred.resolve(data);
          }).fail(function (xhr) {
            var json = xhr.responseJSON || { message: '', shouldLog: false };
            if (json.shouldLog) {
              (0, _utilities.debugError)('DataManager.push: user is not logged in -- will call the log function.');
              _this2.login(connection).then(function () {
                _this2.query(_query, variables, connection, deferred);
              });
            } else {
              (0, _utilities.debugError)('DataManager.push: could not perform query -- will retry', JSON.stringify(_query), json.message);
              _this2.query(_query, variables, connection, deferred);
            }
          });
        } else {
          deferred.reject('DataManager.query: unsupported connection.');
        }
      }

      return deferred.promise;
    }

    /* ======= Push ======= */

    /**
     * Sets or retrieve a variable from local storage in a JSON format
     * @method local
     * @param  {string} [variable=null]        variable name, if not specified returns the whole localStorage object
     * @param  {any} [data=null]               if specified, the variable will be set and not retrieved
     * @return {!any}                          undefined if set, variable value if get
     */

  }, {
    key: 'local',
    value: function local() {
      var variable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (variable === null) {
        return localStorage;
      }

      if (data !== null) {
        localStorage[variable] = JSON.stringify(data);
        return undefined;
      }
      if (!localStorage.hasOwnProperty(variable)) {
        (0, _utilities.debugError)('DataManager.local: localStorage has no variable named ' + variable);
        return undefined;
      }

      try {
        var _data = JSON.parse(localStorage[variable]);
        return _data;
      } catch (e) {
        (0, _utilities.debugError)('DataManager.local: variable is probably not JSON ', e);
      }
      return localStorage[variable];
    }
  }, {
    key: 'prepareToPush',
    value: function prepareToPush() {
      var _this3 = this;

      for (var _len = arguments.length, names = (0, _utilities.Array)(_len), _key = 0; _key < _len; _key++) {
        names[_key] = arguments[_key];
      }

      if (names === []) {
        names = new Set(Object.keys(this.dataTables));
      }

      this.toPush.unite(names);
      if (!this.waitForPush) {
        this.waitForPush = true;
        (0, _utilities.delay)(this.addRate).then(function () {
          _this3.push();
        });
      }
      if (!(0, _utilities.hasConstructor)(_utilities.Deferred, this.pushDeferred) || !this.pushDeferred.pending) {
        this.pushDeferred = new _utilities.Deferred();
      }

      return this.pushDeferred;
    }
  }, {
    key: 'getStagedData',
    value: function getStagedData() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'dataArray';

      // check that the table is valid
      var returned = [[], 0];
      try {
        if (!this.tableNames.has(table)) {
          throw new Error('DataManager.getStagedData: unknown table.');
        }

        // check if we have a last index, if not set it to 0
        if (Object.keys(this.tablesLastIndex).indexOf(table) === -1) {
          this.tablesLastIndex[table] = 0;
        }

        var dataTable = this.dataTables[table];
        var fields = this.fieldNames(table);
        var numRows = dataTable[fields.sample()].length;
        var lastIndex = this.tablesLastIndex[table];

        // create a new array with the unpushed data (without cloning the parent array)
        var data = format === 'dataArray' ? [] : {};
        var j = 0;
        for (var i = lastIndex; i < numRows; i++) {
          if (format === 'dataArray') {
            var row = {};
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = fields[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var field = _step5.value;

                if (field === 'id') continue;

                if (dataTable[field].length <= i) {
                  throw new Error('DataManager.toDataArray: field array ' + field + ' is of invalid size.');
                }
                row[field] = dataTable[field][i];
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            data.push(row);
          } else {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = fields[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _field = _step6.value;

                if (_field === 'id') continue;

                if (!data.hasOwnProperty(_field)) {
                  data[_field] = [];
                }
                if (dataTable[_field].length <= i) {
                  throw new Error('DataManager.getStagedData: field ' + _field + ' of invalid size in the DataManager.');
                }
                data[_field][j].push(dataTable[_field][i]);
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }

            j += 1;
          }
        }
        returned = [data, numRows];
      } catch (e) {
        (0, _utilities.debugError)(e);
      }
      return returned;
    }
  }, {
    key: 'push',
    value: function push() {
      var _this4 = this;

      if ((0, _utilities.hasConstructor)(_utilities.Deferred, this.loginDeferred) && this.loginDeferred.pending) {
        (0, _utilities.delay)(this.addRate).then(function () {
          _this4.push();
        });
      } else {
        this.waitForPush = 0;
        for (var i = 0; i < this.connections.length; i++) {
          var connection = this.connections[i];
          if (connection.type === this.INTERFACE_REST) {
            (function () {
              var toPushSize = _this4.toPush.size;
              var pushed = 0;
              var pushDeferred = _this4.pushDeferred;
              var checkIfPushed = function checkIfPushed() {
                if (pushed >= toPushSize) {
                  pushDeferred.resolve();
                }
              };
              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                for (var _iterator7 = _this4.toPush[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  var table = _step7.value;

                  // get last index pushed to the server
                  // get the new data from that index
                  if (_this4.useLocalStorageCredentials && typeof _this4.local(connection.name) !== 'undefined' && _this4.local(connection.name).hasOwnProperty('credentials')) {
                    connection.credentials = _this4.local(connection.name).credentials;
                  }

                  var _getStagedData = _this4.getStagedData(table),
                      _getStagedData2 = _slicedToArray(_getStagedData, 2),
                      rows = _getStagedData2[0],
                      lastIndex = _getStagedData2[1];

                  var data = {
                    interface: connection.type,
                    credentials: connection.credentials,
                    query: connection.add,
                    variables: {
                      table: table,
                      rows: rows
                    }

                    // send the data through ajax in json format
                  };_jquery2.default.ajax({
                    url: connection.endpoint,
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json'
                  }).done(function (table, lastIndex, data, status) {
                    // once the ajax call is done, check status of http
                    // if 200 this.waitForPush = false and update the last updated index
                    // bind a context with the name of the table
                    pushed += 1;
                    checkIfPushed();
                    this.tablesLastIndex[table] = lastIndex;
                    this.toPush.delete(table);
                    (0, _utilities.debuglog)('DataManager.push: successful ajax call with status ' + status, data);
                  }.bind(_this4, table, lastIndex)).fail(function (connection, table, xhr) {
                    var _this5 = this;

                    var json = xhr.responseJSON || { message: '', shouldLog: false };
                    if (json.shouldLog) {
                      (0, _utilities.debugError)('DataManager.push: user is not logged in -- will call the log function.'
                      // will pop a form to log
                      );this.login(connection).then(function () {
                        _this5.prepareToPush(table);
                      });
                    } else {
                      (0, _utilities.debugError)('DataManager.push: could not push ' + table + ' -- will retry', json.message);
                      this.prepareToPush(table);
                    }
                  }.bind(_this4, connection, table));
                }
              } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                  }
                } finally {
                  if (_didIteratorError7) {
                    throw _iteratorError7;
                  }
                }
              }
            })();
          }

          if (connection.type === this.INTERFACE_GRAPHQL) {
            //
          }
        }
      }
    }
  }, {
    key: 'setConnection',
    value: function setConnection() {
      var _this6 = this;

      var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      var deferred = new _utilities.Deferred();
      if (!variables.hasOwnProperty('type') || variables.type === this.INTERFACE_REST) {
        var defaultVariables = {
          type: this.INTERFACE_REST,
          name: null,
          endpoint: null,
          credentials: null,
          loggedIn: false,
          add: this.QUERY_ADD,
          checkpoint: this.QUERY_CHECKPOINT,
          login: this.QUERY_LOGIN
          // TODO rest of basic api
        };

        var connection = _lodash2.default.extend(defaultVariables, variables);
        if (connection.endpoint !== null) {
          connection.name = connection.name || connection.type;

          if (connection.credentials === null && this.useLocalStorageCredentials && typeof this.local(connection.name) !== 'undefined' && this.local(connection.name).hasOwnProperty('credentials')) {
            connection.credentials = this.local(connection.name).credentials;
          }

          if (connection.credentials !== null) {
            this.login(connection, connection.credentials).then(function () {
              _this6.connections.push(connection);
              deferred.resolve(connection);
            }).catch(function (e) {
              deferred.reject(e);
            });
          } else {
            this.connections.push(connection);
            deferred.resolve(connection);
          }
        } else {
          deferred.reject('DataManager.setInterface: needs at least an endpoint.');
        }
      } else {
        deferred.reject('DataManager.setInterface: unsupported connection type.');
      }
      return deferred.promise;
    }

    /* ======== Getters and setters ======== */

    /**
     * tableNames - readonly - Set of table names.
     *
     * @returns {Set}
     */

  }, {
    key: 'tableNames',
    get: function get() {
      return new Set(Object.keys(this.dataTables));
    },
    set: function set(value) {
      throw new Error('DataManager.tableNames: readonly.');
    }

    /**
     * globalLog - The complete log since the creation of the DataManager
     *
     * @returns {Object}
     */

  }, {
    key: 'globalLog',
    get: function get() {
      return this._globalLog;
    },
    set: function set(value) {
      throw new Error('DataManager.tableNames: readonly.');
    }

    /** Integer value of the next id for the global log */

  }, {
    key: 'nextLogId',
    get: function get() {
      if (this.globalLog.id.length > 0) {
        return _lodash2.default.max(this.globalLog.id) + 1;
      }
      return 0;
    },
    set: function set(value) {
      if (value.constructor === _utilities.String) {
        this._customNextID = value; // TODO to implement
        console.log('DataManager: next event \'id\' will be ' + value);
      } else {
        throw new Error('DataManager: id should be a string.');
      }
    }
  }]);

  return DataManager;
}();

exports.default = DataManager;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /** @module RessourceManager */


var _jquery = __webpack_require__(8);

var _jquery2 = _interopRequireDefault(_jquery);

var _bluebird = __webpack_require__(2);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* JS Class for ressource management */
var RessourceManager = function () {
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
  function RessourceManager() {
    _classCallCheck(this, RessourceManager);

    /* --- Set language --- */
    this.defaultLanguage = 'en';
    this.currentLanguage = this.defaultLanguage;

    /* --- Initialize data --- */
    this.data = {};

    /* --- Custom parameters --- */

    /**
     * overwrite - determines default behavior when adding an already existing
     * variables
     *
     * @type {Boolean}
     */
    this.overwrite = true;

    /**
     * useAjax - If set to false, files will not be loaded and data can only be added in code
     * using addDataFamilly, or by directly modifying this.data object.
     * Useful to make sure local app do not try to use ajax without a server.
     *
     * @type {Boolean}
     */
    this.useAjax = true;

    /* --- Register sprecified file paths --- */

    for (var _len = arguments.length, filepaths = Array(_len), _key = 0; _key < _len; _key++) {
      filepaths[_key] = arguments[_key];
    }

    this.addFiles(filepaths);
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


  _createClass(RessourceManager, [{
    key: 'addFiles',
    value: function addFiles() {
      var _ref;

      if (this.useAjax === false) {
        throw new Error("RessourceManager.addFiles: useAjax set to false - can't add files over the network");
      }

      var concatFilepaths = (_ref = []).concat.apply(_ref, arguments);

      this.files = [];
      var promises = [];
      for (var i = 0; i < concatFilepaths.length; i++) {
        if (this.isOfValidFormat(concatFilepaths[i])) {
          this.files[i] = {};
          this.files[i].type = this.getFormat(concatFilepaths[i]);
          this.files[i].path = concatFilepaths[i];
          this.files[i].loaded = false; // once the raw string is uncovered
          this.files[i].validated = false; // once data is parse from the raw string
          this.files[i].added = false; // once the parsed data is organized in this.data
          this.files[i].raw = false;
          this.files[i].data = null;
          promises.push(this.loadFile(i));
        } else {
          console.warn('RessourceManager.addFiles: invalid type for ' + concatFilepaths[i]);
        }
      }

      return _bluebird2.default.all(promises);
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

  }, {
    key: 'loadFile',
    value: function loadFile() {
      var fileIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      var deffered = new _utilities.Deferred();

      if (typeof this.files[fileIndex] === 'undefined') {
        return deffered.reject('RessourceManager.loadFile: files[fileIndex] is not defined');
      }

      var thisObject = this;
      _jquery2.default.ajax({
        type: 'GET',
        url: this.files[fileIndex].path,
        crossDomain: true
      }).done(function (data, textStatus, jqXHR) {
        thisObject.files[fileIndex].loaded = true;
        thisObject.files[fileIndex].raw = data;

        try {
          thisObject.parseRaw(fileIndex);
        } catch (e) {
          deffered.reject(e);
        } finally {
          deffered.resolve('RessourceManager.loadFile: ' + thisObject.files[fileIndex].path + ' parsed');
        }
      });

      return deffered.promise;
    }
  }, {
    key: 'parseRaw',
    value: function parseRaw() {
      var fileIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (typeof this.files[fileIndex] === 'undefined') {
        throw new Error('RessourceManager.parseRaw: files[fileIndex] is not defined');
      }

      var file = this.files[fileIndex];

      if (file.raw === null) {
        throw new Error('RessourceManager.parseRaw: file.raw is null or not validated');
      } else if (file.raw.constructor === String) {
        var parser = void 0;
        var arg = null;
        switch (file.type) {
          case 'json':
            // read json
            parser = JSON.parse;
            break;
          case 'csv':
            // read csv
            parser = _jquery2.default.csv.toObjects;
            break;
          case 'xml':
            // read xml
            if (window.DOMParser) {
              parser = new DOMParser();
              parser = parser.parseFromString;
              arg = 'text/xml';
            } else {
              // Internet Explorer
              parser = new window.ActiveXObject('Microsoft.XMLDOM');
              parser.async = false;
              parser = parser.loadXML;
            }
            break;
          default:
            throw new Error('RessourceManager.parseRaw: file.type is null or not validated');
        }

        try {
          if (arg) {
            file.data = parser(file.raw, arg);
          } else {
            file.data = parser(file.raw);
          }
        } catch (e) {
          file.validated = false;
          file.data = null;
          throw new Error(e);
        } finally {
          // file has been correctly parsed and stored in object format
          file.validated = true;

          // when a file is parsed, merge the new data
          this.processParsed();
        }
      } else if (file.raw.constructor === Object) {
        file.data = file.raw;
        // file has been correctly parsed and stored in object format
        file.validated = true;

        // when a file is parsed, merge the new data
        this.processParsed();
      } else {
        throw new Error('RessourceManager.parseRaw: invalid file.raw format');
      }
    }
  }, {
    key: 'processParsed',
    value: function processParsed() {
      // first level are data famillies e.g strings, constants, ids, flags etc...
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].validated !== false && this.files[i].data && !this.files[i].added) {
          var data = this.files[i].data;
          var keys = Object.keys(data);
          for (var j = 0; j < keys.length; j++) {
            this.addDataFamilly(keys[j], data[keys[j]]);
          }

          this.files[i].added = true;
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

  }, {
    key: 'addDataFamilly',
    value: function addDataFamilly() {
      var familly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();
      var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var toAdd = data;
      var id = void 0;
      if (data.constructor !== Object) {
        // If the data is not an object: organize by type
        id = familly;
        familly = data.constructor.name.toLowerCase() + 's';
        toAdd = _defineProperty({}, id, data);
      }

      if (typeof this.data[familly] === 'undefined') {
        this.data[familly] = {};
      }

      if (overwrite === null) {
        overwrite = this.overwrite;
      }

      if (overwrite) {
        this.data[familly] = this.extend(this.data[familly], toAdd);
      } else {
        this.data[familly] = this.extend(toAdd, this.data[familly]);
      }
    }

    /**
     * getNextId - Returns the lenght of the specified familly
     *
     * @param {string} familly
     *
     * @returns {number} 0 if the familly does not exist, the total number of keys otherwise.
     */

  }, {
    key: 'getNextId',
    value: function getNextId() {
      var familly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (this.data.hasOwnProperty(familly)) {
        return Object.keys(this.data[familly]).length;
      }
      return 0;
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

  }, {
    key: 'add',
    value: function add() {
      var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (object.constructor !== Object) {
        throw new Error('RessourceManager.add: cannot add data from a non object');
      }
      var oldOverwrite = this.overwrite;
      if (overwrite === null) {
        overwrite = oldOverwrite;
      } else {
        this.overwrite = overwrite;
      }

      var keys = Object.keys(object);
      for (var i = 0; i < keys.length; i++) {
        if (object[keys[i]].constructor === Object) {
          this.addDataFamilly(keys[i], object[keys[i]]);
        } else if (object[keys[i]].constructor === Array) {
          this.addByName(keys[i], object[keys[i]], 'arrays');
        } else {
          this.addByName(keys[i], object[keys[i]]);
        }
      }

      this.overwrite = oldOverwrite;
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

  }, {
    key: 'addByName',
    value: function addByName() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();
      var familly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'strings';
      var overwrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (typeof this.data[familly] === 'undefined') {
        this.data[familly] = {};
      }

      if (overwrite === null) {
        overwrite = this.overwrite;
      }

      if (!this.data[familly].hasOwnProperty(name) || overwrite) {
        console.warn('RessourceManager.addByName: already a ressource named ' + name + ' - Overwriting it.');
        this.data[familly][name] = value;
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

  }, {
    key: 'getFormat',
    value: function getFormat() {
      var filepath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      // fancy way of making sure we substr(index) with
      // index >>> filepath.lenght if no . is found
      // from http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/1203361#1203361
      return filepath.substr((~-filepath.lastIndexOf('.') >>> 0) + 2 // eslint-disable-line
      );
    }
  }, {
    key: 'isOfValidFormat',
    value: function isOfValidFormat() {
      var filepath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      var validFormats = ['json', 'csv', 'xml'];
      if (validFormats.indexOf(this.getFormat(filepath)) !== -1) {
        return true;
      }
      return false;
    }

    /**
     * mergeWith - Merge current data with another RessourceManager. Duplicated
     * keys gets overwritten by those of the other RessourceManager.
     *
     * @param {RessourceManager} ressourceManager Another RessourceManager to merge
     *
     */

  }, {
    key: 'mergeWith',
    value: function mergeWith() {
      var ressourceManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (ressourceManager.constructor !== RessourceManager) {
        throw new Error('RessourceManager.mergeWith: specified ressourceManager is not of class RessourceManager.');
      }

      var currentFamillies = this.famillies;
      var mergingFamillies = ressourceManager.famillies;

      for (var i = 0; i < mergingFamillies.length; i++) {
        if (currentFamillies.indexOf(mergingFamillies[i]) === -1) {
          this.data[mergingFamillies[i]] = ressourceManager.data[mergingFamillies[i]];
        } else {
          this.data[mergingFamillies[i]] = this.extend(this.data[mergingFamillies[i]], ressourceManager.data[mergingFamillies[i]]);
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

  }, {
    key: 'lookFor',
    value: function lookFor() {
      var result = void 0;

      for (var _len2 = arguments.length, variable = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        variable[_key2] = arguments[_key2];
      }

      if (variable.length === 1) {
        if (this.data.hasOwnProperty(variable)) {
          result = this.data[variable];
        } else {
          var famillies = this.famillies;
          for (var i = 0; i < famillies.length; i++) {
            if (this.data[famillies[i]].hasOwnProperty(variable)) {
              result = this.data[famillies[i]][variable];
              break;
            }
          }
        }
      } else if (variable.length > 1) {
        result = {};
        for (var _i = 0; _i < variable.length; _i++) {
          result[variable[_i]] = this.lookFor(variable[_i]);
        }
      }

      return result;
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

  }, {
    key: 'extend',
    value: function extend() {
      // Variables
      var extended = {};
      var deep = false;
      var i = 0;
      var length = arguments.length;

      // Check if a deep merge
      if (Object.prototype.toString.call(arguments.length <= 0 ? undefined : arguments[0]) === '[object Boolean]') {
        deep = arguments.length <= 0 ? undefined : arguments[0];
        i += 1;
      }

      // Merge the object into the extended object
      var merge = function merge(obj) {
        for (var prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            // If deep merge and property is an object, merge properties
            if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
              extended[prop] = this.extend(true, extended[prop], obj[prop]);
            } else {
              extended[prop] = obj[prop];
            }
          }
        }
      };

      // Loop through each object and conduct a merge
      for (; i < length; i++) {
        var obj = arguments.length <= i ? undefined : arguments[i];
        merge(obj);
      }

      return extended;
    }

    /**
     * famillies - Description
     *
     * @returns {type} Description
     */

  }, {
    key: 'famillies',
    get: function get() {
      return Object.keys(this.data);
    }
  }, {
    key: 'has',
    get: function get() {
      return new Proxy(this, {
        get: function get(target, pathString) {
          if (typeof target.get[pathString] === 'undefined') {
            return false;
          }
          return true;
        }
      });
    }
  }, {
    key: 'get',
    get: function get() {
      return new Proxy(this, {
        get: function get(target, pathString) {
          var path = pathString.split('_');
          var famillies = target.famillies;
          var lookForLanguage = target.currentLanguage;
          var lookForFamilly = 'strings';
          var lookForVariable = void 0;
          var couldSwapForVariable = false;
          for (var i = 0; i < path.length; i++) {
            if (famillies.indexOf(path[i]) !== -1) {
              lookForFamilly = path[i];
              couldSwapForVariable = true;
            } else if (path[i].length === 2) {
              lookForLanguage = path[i];
            } else {
              if (typeof lookForVariable !== 'undefined') {
                console.error('RessourceManager.get: at least two possible variable names into path: ' + lookForVariable + ' and ' + path[i]);
                return undefined;
              }
              lookForVariable = path[i];
            }
          }

          if (typeof lookForVariable === 'undefined') {
            if (couldSwapForVariable) {
              lookForVariable = lookForFamilly;
            } else {
              (0, _utilities.debugError)('RessourceManager.get: no variable name found in ' + pathString);
              return undefined;
            }
          }

          var result = void 0;
          if (target.data.hasOwnProperty(lookForFamilly) && target.data[lookForFamilly].hasOwnProperty(lookForVariable)) {
            result = target.data[lookForFamilly][lookForVariable];
          } else {
            result = target.lookFor(lookForVariable);
            if (typeof result === 'undefined') {
              console.error('RessourceManager.get: no ressource for path ' + lookForFamilly + '.' + lookForVariable);
              return undefined;
            }
          }

          if (result.constructor !== Object) {
            return result;
          } else if (result.hasOwnProperty(lookForLanguage)) {
            return result[lookForLanguage];
          } else if (result.hasOwnProperty(target.currentLanguage)) {
            console.warn('RessourceManager.get: no valid language, defaulting to ' + target.currentLanguage);
            return result[target.currentLanguage];
          }
          console.warn('RessourceManager.get: no localization language found, returning the whole object');
          return result;
        }
      });
    }
  }]);

  return RessourceManager;
}();

exports.default = RessourceManager;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/** @module State */


var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = __webpack_require__(2);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _EventData = __webpack_require__(3);

var _EventData2 = _interopRequireDefault(_EventData);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* State object has a specific way to handle input and update objects */
var State = function () {

  /**
   * @constructor
   * @param {object} [stateManager]
   * @param {string} [stateKey]
   */
  function State() {
    var stateManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
    var stateKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

    _classCallCheck(this, State);

    this._stateManager = stateManager;
    this._parent = stateManager._parent;
    this._dataManager = stateManager._dataManager;

    this.stateKey = stateKey;

    /**
     * Object in which properties names are handling function to be called for specific events.
     * The key of those properties are the event flags. Handling functions should return a Promise.
     * @type {Object}
     */
    this._eventFunctions = {};

    /**
     * Object containing array of function to be called once for specific events
     * The key of those properties are the event flags. Handling functions should return a Promise.
     * @type {Object}
     */
    this._nextEventFunctions = {};

    /**
     * Array of handling function to be called when the state awaken, just after state change.
     * This is where redrawing should go. Handling functions should return a Promise.
     * @type {Array}
     * @private
     */
    this._awakeningFunctions = [];

    /**
     * Array of handling functions to be called when the state is dismissed, just before the state change.
     * Handling functions should return a Promise.
     * @type {Array}
     * @private
     */
    this._endingFunctions = [];

    /**
     * Array of functions that are to be called upon each updates.
     * Those functions should return a Promise.
     * @type {Array}
     */
    this._updateFunctions = [];

    /**
     * Array of stored timed event in case of state freezing
     * @type {Array}
     */
    this._frozenEvents = [];

    /**
     * Timestamp of frozen time. Value is null if the state is not frozen.
     * @type {int}
     */
    this._frozenAt = null;

    /**
     * Constant. When unfreezing if the time difference etween happenedAt and the current timeInMs is less than
     * this value, the event is directly added to the event heap. Else it is treated as a tigger event.
     * @type {Number}
     */
    this.FREEZE_DELAY = 50;
  }

  /* ======== Class Methods ======== */

  /* === Lifecycle hook functions === */

  /**
   * Function called at state awakening.
   * All functions of the _awakeningFunctions array will be called, they must return a Promise.
   */


  _createClass(State, [{
    key: 'awake',
    value: function awake() {
      var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (reload) {
        if (this._frozenAt !== null) {
          this._frozenAt = null;
          this._frozenEvents = [];
          this.stateManager.stateWasUnfreezed(this.stateKey);
        }
        // NOTE Might have other things to do here...
      }

      /* --- If state was frozen unfreeze it but do not re-awake --- */
      if (this._frozenAt !== null) {
        this.unfreeze();
      } else {
        if (typeof this._parent.sceneKey !== 'undefined') {
          (0, _utilities.debuglog)(this.stateKey + ' of scene ' + this._parent.sceneKey + ' awaken.');
        }

        var calledFunctions = [];
        for (var i = 0; i < this._awakeningFunctions.length; i++) {
          calledFunctions[i] = _bluebird2.default.method(this._awakeningFunctions[i].bind(this.context))();
        }

        _bluebird2.default.all(calledFunctions).then(function () {
          /* Promise ran as expected, returned data */
          (0, _utilities.debuglog)('State: Awakening functions completed as expected.', calledFunctions);
        }).catch(function (error) {
          /* an error occured */
          (0, _utilities.debugError)(error);
        });
      }
    }

    /**
     * Function called when state ends, just before state change.
     * All functions of the _endingFunctions array will be called, they must return a Promise.
     */

  }, {
    key: 'end',
    value: function end() {
      var _this = this;

      if (this._frozenAt === null) {
        var calledFunctions = [];
        for (var i = 0; i < this._endingFunctions.length; i++) {
          calledFunctions[i] = _bluebird2.default.method(this._endingFunctions[i].bind(this.context))();
        }

        _bluebird2.default.all(calledFunctions).then(function (data) {
          /* Promise ran as expected, returned data */
          (0, _utilities.debuglog)('State: Ending functions completed as expected.', calledFunctions);
          (0, _utilities.debuglog)(_this.stateKey + ' ended.');
          return data;
        }).catch(function (error) {
          /* an error occured */
          (0, _utilities.debugError)(error);
          return null;
        });
      }
    }
  }, {
    key: 'update',
    value: function update() {
      if (this._frozenAt === null && this._stateManager._eventHeap.length) {
        var nextEvent = void 0;
        var events = this._stateManager.spliceEventsForState(this.stateKey);
        for (var i = 0; i < events.length; i++) {
          nextEvent = events[i];
          (0, _utilities.debuglog)('State: first event is ' + nextEvent.flag);

          this.handleEvent(nextEvent);
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

  }, {
    key: 'handleEvent',
    value: function handleEvent(event) {
      // for each input flag have a specific function ready - that can be customizable
      // rename input with Event ?
      // make a promise and chain it with .then(stateHasFinishedHandlingEvent())
      var handled = false;
      if (this.hasEventFunction(event.flag)) {
        /* Promise allow for assynchronous handling of events */
        var eventFunctions = this._eventFunctions[event.flag];
        if (eventFunctions.constructor === Array) {
          for (var i = 0; i < eventFunctions.length; i++) {
            _bluebird2.default.method(eventFunctions[i].bind(this.context))(event).then(function (functionName, data) {
              /* Promise ran as expected, returned data */
              (0, _utilities.debuglog)(data);
              var eventClone = _lodash2.default.cloneDeep(event);
              eventClone.data.handlingFunction = functionName;
              this._stateManager.stateHasFinishedHandlingEvent(eventClone);
            }.bind(this, eventFunctions[i].name)).catch(function (error) {
              /* an error occured */
              (0, _utilities.debugError)(error);
            });
          }
        } else {
          _bluebird2.default.method(eventFunctions.bind(this.context))().then(function (functionName, data) {
            /* Promise ran as expected, returned data */
            (0, _utilities.debuglog)(data);
            var eventClone = _lodash2.default.cloneDeep(event);
            eventClone.data.handlingFunction = functionName;
            this._stateManager.stateHasFinishedHandlingEvent(eventClone);
          }.bind(this, eventFunctions.name)).catch(function (error) {
            /* an error occured */
            (0, _utilities.debugError)(error);
          });
        }
        handled = true;
      }
      if (this._nextEventFunctions.hasOwnProperty(event.flag)) {
        var _eventFunctions = this._nextEventFunctions[event.flag];
        if (_eventFunctions !== null) {
          if (_eventFunctions.constructor === Function) {
            _eventFunctions = [_eventFunctions];
          }
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _eventFunctions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var eventFunction = _step.value;

              _bluebird2.default.method(eventFunction)(event).then(function (functionName, data) {
                /* Promise ran as expected, returned data */
                (0, _utilities.debuglog)(data);
                var eventClone = _lodash2.default.cloneDeep(event);
                eventClone.data.handlingFunction = functionName;
                this._stateManager.stateHasFinishedHandlingEvent(eventClone);
              }.bind(this, eventFunction.name)).catch(function (error) {
                /* an error occured */
                (0, _utilities.debugError)(error);
              });
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          this._nextEventFunctions[event.flag].length = 0;
          handled = true;
        }
      }

      if (!handled) {
        this._stateManager.stateHasFinishedHandlingEvent(event);
        (0, _utilities.debuglog)('State: Event \'' + event.flag + '\' not handled by state \'' + this.stateKey + '\'');
      }
    }
  }, {
    key: 'onNext',
    value: function onNext(eventFlag) {
      try {
        for (var _len = arguments.length, handlingFunctions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          handlingFunctions[_key - 1] = arguments[_key];
        }

        _utilities.mustBeDefined.apply(undefined, [eventFlag].concat(handlingFunctions));
        _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

        // checks if functions should be stacked in an array for this flag
        if (this._nextEventFunctions.hasOwnProperty(eventFlag)) {
          if (this._nextEventFunctions[eventFlag].constructor === Array) {
            // push the handlingFunction to the array of _eventFunctions[eventFlag]
            this._nextEventFunctions[eventFlag] = this._nextEventFunctions[eventFlag].concat(handlingFunctions);
            (0, _utilities.debuglog)('State ' + this.stateKey + '.onNext: several handling functions - handling function pushed to the array of event functions on event \'' + eventFlag + '\'');
          } else {
            // creates array of event function
            this._nextEventFunctions[eventFlag] = [this._nextEventFunctions[eventFlag]].concat(handlingFunctions);
            (0, _utilities.debuglog)('State ' + this.stateKey + '.onNext: several handling functions - array created for handling functions for state on event \'' + eventFlag + '\'');
          }
        } else {
          this._nextEventFunctions[eventFlag] = handlingFunctions;
          (0, _utilities.debuglog)('State ' + this.stateKey + '.onNext: handling function added to state \'' + this.stateKey + '\' for event \'' + eventFlag + '\'');
        }
      } catch (e) {
        (0, _utilities.debugError)(e);
      }
    }
  }, {
    key: 'resolveOnKey',
    value: function resolveOnKey() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { key: null, except: [32], eventFlag: 'key_down' };

      var baseOptions = { key: null, except: [32], eventFlag: 'key_down' };

      if (options.constructor !== Object) {
        if (options.constructor === Number) {
          baseOptions.key = options;
          options = {};
        } else {
          (0, _utilities.debugError)('State.resolveOnKey: invalid options');
          return null;
        }
      }

      var _$extend = _lodash2.default.extend(baseOptions, options //eslint-disable-line
      ),
          key = _$extend.key,
          except = _$extend.except,
          eventFlag = _$extend.eventFlag;

      if (key !== null && key.constructor !== Array) {
        if (key.constructor === Number) {
          key = [key];
        } else {
          (0, _utilities.debugError)('State.resolveOnKey: key must be numeric');
          return null;
        }
      }

      if (typeof except === 'undefined' || except === null) {
        except = [];
      }

      if (except.constructor !== Array) {
        if (except.constructor === Number) {
          except = [except];
        } else {
          (0, _utilities.debugError)('State.resolveOnKey: except must be numeric');
          return null;
        }
      }

      var deferred = new _utilities.Deferred();
      var f = function f(e) {
        if (key === null && except.indexOf(e.data.keyCode) === -1 || key !== null && key.indexOf(e.data.keyCode) !== -1) {
          deferred.resolve(e);
          return 'State ' + _this2.stateKey + '.resolveOnKey: tested on \'' + key + '\' and resolved because key \'' + e.data.keyCode + '\' pressed';
        } else if (!deferred.resolved) {
          (0, _utilities.delay)(5).then(function () {
            _this2.onNext(eventFlag, f);
          });
          return 'State ' + _this2.stateKey + '.resolveOnKey: tested on \'' + key + '\' and did not resolved because wrong key \'' + e.data.keyCode + '\' pressed';
        }
        return 'State ' + _this2.stateKey + '.resolveOnKey: should not stay in the function stack';
      };
      this.onNext(eventFlag, f);

      return deferred.promise;
    }
  }, {
    key: 'resolveOnClick',
    value: function resolveOnClick() {
      var _this3 = this;

      var eventFlag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'mouse_click';

      var deferred = new _utilities.Deferred();
      var f = function f(e) {
        deferred.resolve(e);
        return 'State ' + _this3.stateKey + '.resolveOnClick: resolved';
      };
      this.onNext(eventFlag, f);

      return deferred.promise;
    }
  }, {
    key: 'freeze',
    value: function freeze() {
      var stateManager = this._stateManager;

      this._frozenAt = stateManager.timeInMs;
      this._frozenEvents = stateManager.getAllEvents();
      (0, _utilities.debugWarn)(this._frozenEvents);
      stateManager.stateWasFrozen(this.stateKey // TODO: make sure only one state can be frozen ? or add multiple frozen thingy
      );
    }
  }, {
    key: 'unfreeze',
    value: function unfreeze() {
      if (this._frozenAt === null) {
        (0, _utilities.debugWarn)('State.unfreeze: state was not frozen');
        return;
      }

      var stateManager = this._stateManager;
      var frozenEvents = this._frozenEvents;

      for (var i = 0; i < frozenEvents.length; i++) {
        if (frozenEvents[i].constructor === _EventData2.default) {
          frozenEvents[i].happenedAt += stateManager.timeInMs - this._frozenAt;
          if (frozenEvents[i].happenedAt - stateManager.timeInMs > this.FREEZE_DELAY) {
            stateManager.addTimeTriggerEvent(frozenEvents[i]);
            console.log('timetrigger');
            (0, _utilities.debugWarn)(frozenEvents[i]);
          } else {
            stateManager.addEvent(frozenEvents[i]);
            console.log('added event');
            (0, _utilities.debugWarn)(frozenEvents[i]);
          }
        }
      }

      this._frozenAt = null;
      this._frozenEvents = [];
      stateManager.stateWasUnfreezed(this.stateKey // TODO: make sure only one state can be frozen ? or add multiple frozen thingy
      );
    }

    /* = Main functions = */
    // TODO Use Promise.method
    // TODO Change all _eventFunctions to arrays

  }, {
    key: 'registerEventFunctions',
    value: function registerEventFunctions(eventFlag, overwrite) {
      for (var _len2 = arguments.length, handlingFunctions = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        handlingFunctions[_key2 - 2] = arguments[_key2];
      }

      _utilities.mustBeDefined.apply(undefined, [eventFlag, overwrite].concat(handlingFunctions));
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      // checks if functions should be stacked in an array for this flag
      if (this.hasEventFunction(eventFlag)) {
        if (this._eventFunctions[eventFlag].constructor === Array) {
          // push the handlingFunction to the array of _eventFunctions[eventFlag]
          this._eventFunctions[eventFlag] = this._eventFunctions[eventFlag].concat(handlingFunctions);
          (0, _utilities.debuglog)('State ' + this.stateKey + ': several handling functions - handling function pushed to the array of event functions on event \'' + eventFlag + '\'');
        } else {
          // creates array of event function
          this._eventFunctions[eventFlag] = [this._eventFunctions[eventFlag]].concat(handlingFunctions);
          (0, _utilities.debuglog)('State ' + this.stateKey + ': several handling functions - array created for handling functions for state on event \'' + eventFlag + '\'');
        }
      } else {
        this._eventFunctions[eventFlag] = handlingFunctions;
        (0, _utilities.debuglog)('State ' + this.stateKey + ': handling function added to state \'' + this.stateKey + '\' for event \'' + eventFlag + '\'');
      }
    }
  }, {
    key: 'registerCycleFunctions',
    value: function registerCycleFunctions(cycle, overwrite) {
      for (var _len3 = arguments.length, handlingFunctions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        handlingFunctions[_key3 - 2] = arguments[_key3];
      }

      _utilities.mustBeDefined.apply(undefined, [cycle, overwrite].concat(handlingFunctions));
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      var arrayName = void 0;
      switch (cycle) {
        case 'awakening':
          arrayName = '_awakeningFunctions';
          break;
        case 'ending':
          arrayName = '_endingFunctions';
          break;
        case 'update':
          arrayName = '_updateFunctions';
          break;
        default:
          throw new Error('State.registerCycleFunctions: Invalid cycle parameter.');
      }

      if (overwrite) {
        this[arrayName] = handlingFunctions;
        (0, _utilities.debuglog)('State ' + this.stateKey + ': handling function overwrited ' + arrayName);
      } else {
        this[arrayName] = this[arrayName].concat(handlingFunctions);
        (0, _utilities.debuglog)('State ' + this.stateKey + ': handling function added to ' + arrayName + ' array for state \'' + this.stateKey + '\'');
      }
    }

    /* = Short handle = */

    /**
     * Short hand function that adds several events using the handlingFunctions name as handle.
     * @param [...function] handlingFunctions
     */

  }, {
    key: 'addHandledEvents',
    value: function addHandledEvents() {
      for (var _len4 = arguments.length, handlingFunctions = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        handlingFunctions[_key4] = arguments[_key4];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      for (var i = 0; i < handlingFunctions.length; i++) {
        this.registerEventFunctions(handlingFunctions[i].name, true, handlingFunctions[i]);
      }
    }
  }, {
    key: 'addEventFunctions',
    value: function addEventFunctions(eventFlag) {
      for (var _len5 = arguments.length, handlingFunctions = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        handlingFunctions[_key5 - 1] = arguments[_key5];
      }

      _utilities.mustBeDefined.apply(undefined, [eventFlag].concat(handlingFunctions));
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));
      this.registerEventFunctions.apply(this, [eventFlag, false].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteEventFunctions',
    value: function overwriteEventFunctions(eventFlag) {
      for (var _len6 = arguments.length, handlingFunctions = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        handlingFunctions[_key6 - 1] = arguments[_key6];
      }

      _utilities.mustBeDefined.apply(undefined, [eventFlag].concat(handlingFunctions));
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));
      this.registerEventFunctions.apply(this, [eventFlag, true].concat(handlingFunctions));
    }
  }, {
    key: 'addAwakeningFunctions',
    value: function addAwakeningFunctions() {
      for (var _len7 = arguments.length, handlingFunctions = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        handlingFunctions[_key7] = arguments[_key7];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['awakening', false].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteAwakeningFunctions',
    value: function overwriteAwakeningFunctions() {
      for (var _len8 = arguments.length, handlingFunctions = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        handlingFunctions[_key8] = arguments[_key8];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['awakening', true].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteEndingFunction',
    value: function overwriteEndingFunction() {
      for (var _len9 = arguments.length, handlingFunctions = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        handlingFunctions[_key9] = arguments[_key9];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['ending', true].concat(handlingFunctions));
    }
  }, {
    key: 'addEndingFunctions',
    value: function addEndingFunctions() {
      for (var _len10 = arguments.length, handlingFunctions = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        handlingFunctions[_key10] = arguments[_key10];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['ending', false].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteUpdateFunctions',
    value: function overwriteUpdateFunctions() {
      for (var _len11 = arguments.length, handlingFunctions = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        handlingFunctions[_key11] = arguments[_key11];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['udpate', false].concat(handlingFunctions));
    }
  }, {
    key: 'addUpdateFunctions',
    value: function addUpdateFunctions() {
      for (var _len12 = arguments.length, handlingFunctions = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        handlingFunctions[_key12] = arguments[_key12];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['udpate', false].concat(handlingFunctions));
    }
  }, {
    key: 'hasEventFunction',
    value: function hasEventFunction() {
      var eventFlag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      return _lodash2.default.has(this._eventFunctions, eventFlag);
    }

    /* ======= Getters / Setters ======= */
    /* === Globals getter / setter === */

  }, {
    key: 'getGlobal',
    value: function getGlobal() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      return this._stateManager.getGlobal(name);
    }
  }, {
    key: 'setGlobal',
    value: function setGlobal() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      return this._stateManager.setGlobal(name, value);
    }
  }, {
    key: 'context',
    get: function get() {
      if (this._stateManager._taskObject) {
        return this._stateManager._taskObject.getContext(this);
      }
      return {
        taskObject: null,
        dataManager: this._stateManager._dataManager,
        scene: this._parent, // TODO Force the ._parent to be the .scene ?
        stateManager: this._stateManager,
        state: this,
        R: this._stateManager.R
      };
    }
  }]);

  return State;
}();

exports.default = State;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/** @module StateManager */


var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentBabylonJs = __webpack_require__(7);

var _experimentBabylonJs2 = _interopRequireDefault(_experimentBabylonJs);

var _bluebird = __webpack_require__(2);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _RessourceManager = __webpack_require__(5);

var _RessourceManager2 = _interopRequireDefault(_RessourceManager);

var _State = __webpack_require__(6);

var _State2 = _interopRequireDefault(_State);

var _DataManager = __webpack_require__(4);

var _DataManager2 = _interopRequireDefault(_DataManager);

var _EventData = __webpack_require__(3);

var _EventData2 = _interopRequireDefault(_EventData);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Manage lifecycle and variables through State objects.
 * Can dispatch information to the DataManager.
 * TODO check documentation style for es6 modules
 */
var StateManager = function () {

  /**
   * @constructor
   * @param  {object} parent       Parent  object
   * @param  {DataManager} dataManager The task dataManager
   */
  function StateManager() {
    var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('parent');
    var dataManager = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, StateManager);

    this._parent = parent;
    this.dataManager = dataManager;

    /* --- Look for taskObject and setup RessourceManager accordingly --- */
    if (typeof parent.parentTaskObject !== 'undefined') {
      this._taskObject = parent.parentTaskObject;
      this.R = this._taskObject.R;
    } else {
      this.R = new _RessourceManager2.default();
    }

    var R = this.R;

    /**
     * Array of Data
     * @type {Array}
     */
    this._eventHeap = [];

    /**
     * Stores temporary time triggered event. The update() function checks at each frame if the event should be triggered.
     * @type {Array}
     */
    this._timeTriggerEvents = [];

    //
    // Notes :
    // 1- should we handle events assynchronously... what is the best way to implement it ?
    // 2- event related to the awakening or ending of states should not go in the event heap, probably due to redraawing that might lag.
    //

    this.errorLog = [];

    this.R.add({
      states: {
        idle: 'idle',
        pause: 'pause',
        active: 'active'
      },
      values: {
        timestampThreshold: 10e7
      },
      events: {
        unfrozen: 'eventUnfrozen'
      }
    }, false

    /*  Hash table of state objects */
    );this.states = {
      idle: new _State2.default(this, R.get.states_idle),
      active: new _State2.default(this, R.get.states_active),
      pause: new _State2.default(this, R.get.states_pause)
    };

    this._currentStateKey = R.get.states_idle;

    /**
     * Statekey of the current frozenState. If null, no state were frozen.
     * @type {string}
     */
    this.frozenState = null;

    /**
     * Holds variables that needs to be passed from one state to the next.
     * @type {Object}
     */
    this.globals = {};

    this.globalFunctions = {};
  }

  /* ======== Class methods ======== */


  _createClass(StateManager, [{
    key: 'update',
    value: function update() {
      var _timeTriggerEvents;

      /* --- Checks if some _timeTriggerEvents should be added to the heap --- */
      var toSplice = [];
      for (var i = 0; i < this._timeTriggerEvents.length; i++) {
        if (this.timeInMs >= this._timeTriggerEvents[i].happenedAt) {
          this._timeTriggerEvents[i].happenedAt = this.timeInMs; // correct for fps delay
          this.addEvent(this._timeTriggerEvents[i]);
          toSplice.push(i);
        }
      }
      (_timeTriggerEvents = this._timeTriggerEvents).multisplice.apply(_timeTriggerEvents, toSplice);

      /* --- Update the state --- */
      this.currentState.update();
    }
  }, {
    key: 'storeEvent',
    value: function storeEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      try {
        if (this.dataManager.constructor !== _DataManager2.default) {
          throw new Error('StateManager.storeEvent: dataManager is not set, cannot store event.');
        }

        if (!event.handled) {
          (0, _utilities.debuglog)(event);
          throw new Error('StateManager.storeEvent:cannot store an event that was not handled.');
        }

        if (event.stored) {
          (0, _utilities.debuglog)(event);
          throw new Error('StateManager.storeEvent: Event already stored');
        }

        event.storedInErrorLog = false;
        var belongsTo = event.data.belongsTo;
        if (belongsTo.constructor !== Array) {
          belongsTo = [belongsTo];
        }

        for (var i = 0; i < belongsTo.length; i++) {
          try {
            event.data.storedAt = this.timeInMs;
            event.stored = true;

            (0, _utilities.debuglog)('StateManager.storeEvent: storing event.'
            // this.dataManager.log(belongsTo[i], event)
            );this.dataManager.addRows(belongsTo[i], event.formatted);
            (0, _utilities.debuglog)('StateManager.storeEvent: event stored.', event);
          } catch (error) {
            (0, _utilities.debugError)('StateManager.storeEvent: Could not store data in ' + belongsTo[i] + ' dataTable. Data was stored in the errorLog. DataManager error was: ' + error);
            this.storeInErrorLog(event);
          }
        }
      } catch (e) {
        (0, _utilities.debugError)(e);
      }
    }
  }, {
    key: 'storeData',
    value: function storeData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      try {
        if (this.dataManager.constructor !== _DataManager2.default) {
          throw new Error('StateManager.storeData: dataManager is not set, cannot store event.');
        }

        if (!_lodash2.default.has(data, 'belongsTo')) {
          (0, _utilities.debuglog)(data);
          throw new Error('StateManager: data needs a belongsTo property in order to store it in the dataManager.');
        }

        if ((0, _utilities.hasConstructor)(String, data.belongsTo)) {
          data.belongsTo = [data.belongsTo];
        }

        data.storedInErrorLog = false;
        for (var i = 0; i < data.belongsTo.length; i++) {
          try {
            this.dataManager.addRows(data.belongsTo[i], data);
          } catch (error) {
            console.error('StateManager: Could not store data in ' + data.belongsTo[i] + ' dataTable. Data was stored in the errorLog. DataManager error was: ' + error);
            this.storeInErrorLog(data);
          }
        }
      } catch (e) {
        (0, _utilities.debugError)(e);
      }
    }
  }, {
    key: 'storeInErrorLog',
    value: function storeInErrorLog() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (data.storedInErrorLog === false) {
        data.storedInErrorLog = true;
        this.errorLog = this.errorLog.concat(data
        // TODO check datamanager has error log, if yes store it, if not create it and store it
        );(0, _utilities.debuglog)('StateManager: data stored in the errorLog.');
      } else {
        (0, _utilities.debugWarn)('StateManager: data already stored in errorLog. Did not store it again.');
      }
    }

    /* === State management === */

    /**
     * Adds a new state with specified stateKey.
     * If a list of several states is specified, the function returns an array.
     *
     * @param {...string} stateKeys list of additional state
     */

  }, {
    key: 'addState',
    value: function addState() {
      try {
        var returnedStates = [];
        var stateKey = void 0;

        for (var _len = arguments.length, stateKeys = Array(_len), _key = 0; _key < _len; _key++) {
          stateKeys[_key] = arguments[_key];
        }

        for (var i = 0; i < stateKeys.length; i++) {
          stateKey = stateKeys[i];

          if (stateKey.constructor !== String) {
            throw new Error('StateManager: stateKey must be a string.');
          }

          if (_lodash2.default.has(this.states, stateKey)) {
            throw new Error('StateManager: a state with a similar stateKey \'' + stateKey + '\' already exists.');
          }

          this.states[stateKey] = new _State2.default(this, stateKey);

          (0, _utilities.debuglog)('StateManager: added state \'' + stateKey + '\'.');

          returnedStates.push(this.states[stateKey]);
        }

        return returnedStates.length === 1 ? returnedStates[0] : returnedStates;
      } catch (e) {
        (0, _utilities.debugError)(e);
        return null;
      }
    }

    /* === State change === */

  }, {
    key: 'goToState',
    value: function goToState() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_lodash2.default.has(this.states, key)) {
        this.currentState.end();

        this._currentStateKey = key;
        this.states[key].awake(reload);
      } else {
        (0, _utilities.debugError)('StateManager: Invalid state key.');
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

  }, {
    key: 'addGuiCanvas',
    value: function addGuiCanvas() {
      try {
        var scene = this._parent;
        (0, _utilities.mustHaveConstructor)(_experimentBabylonJs2.default.Scene, scene);

        var canvasOptions = {
          id: 'GUI',
          backgroundFill: _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(new _experimentBabylonJs2.default.Color4(0, 0, 0, 0)),
          backgroundRoundRadius: 0,
          x: 0,
          y: 0,
          zOrder: 1
        };

        var GUI = new _experimentBabylonJs2.default.ScreenSpaceCanvas2D(scene, canvasOptions);

        GUI.levelVisible = false;
        this.set('GUI', GUI);

        return GUI;
      } catch (e) {
        (0, _utilities.debugError)(e);
        return null;
      }
    }

    // TODO tooltip on the GUI to highlight specific positions

  }, {
    key: 'tooltip',
    value: function tooltip(_ref) {
      var _this = this;

      var _ref$replace = _ref.replace,
          replace = _ref$replace === undefined ? false : _ref$replace,
          _ref$position = _ref.position,
          position = _ref$position === undefined ? null : _ref$position,
          _ref$size = _ref.size,
          size = _ref$size === undefined ? null : _ref$size,
          _ref$spaced = _ref.spaced,
          spaced = _ref$spaced === undefined ? null : _ref$spaced,
          _ref$text = _ref.text,
          text = _ref$text === undefined ? '' : _ref$text,
          _ref$fontName = _ref.fontName,
          fontName = _ref$fontName === undefined ? '14pt Verdana' : _ref$fontName,
          _ref$duration = _ref.duration,
          duration = _ref$duration === undefined ? null : _ref$duration,
          _ref$event = _ref.event,
          event = _ref$event === undefined ? new _EventData2.default(this.R.get.events_tooltipDismissed) : _ref$event,
          _ref$background = _ref.background,
          background = _ref$background === undefined ? null : _ref$background,
          _ref$fontColor = _ref.fontColor,
          fontColor = _ref$fontColor === undefined ? null : _ref$fontColor;

      // Set the default
      spaced = (0, _utilities.spreadToObject)(spaced, new _experimentBabylonJs2.default.Vector2(0, 0));
      if (duration === null || duration.constructor !== _bluebird2.default) {
        if (duration !== null && duration.constructor === Number) {
          duration = (0, _utilities.delay)(duration);
        } else {
          duration = new _utilities.Deferred().promise;
        }
      }

      var guiCanvas = this.get('GUI');
      guiCanvas.levelVisible = true;

      var brownColor = [112 / 255, 102 / 255, 98 / 255, 0.95];

      var tooltips = this.get('tooltips', []);
      if (tooltips.constructor === Object) {
        tooltips = [tooltips];
      }
      var id = tooltips.length + 1;

      var tooltip = null;
      if (replace && tooltips.length) {
        tooltip = tooltips[tooltips.length - 1];
      } else if (tooltips.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = tooltips[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var temptool = _step.value;

            if (typeof temptool.box !== 'undefined') {
              temptool.box.zOrder = (id - temptool.id) * 0.01;
              temptool.text.zOrder = (id - temptool.id) * 0.01 - 0.001;
            }
            if (typeof temptool.disposed !== 'undefined' && temptool.disposed) {
              temptool.box.zOrder = 0.001;
              temptool.text.zOrder = 0;
              tooltip = temptool;
              background = (0, _utilities.spreadToObject)(background, new (Function.prototype.bind.apply(_experimentBabylonJs2.default.Color4, [null].concat(brownColor)))());
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (tooltip !== null) {
        tooltip.text.levelVisible = true;
        tooltip.box.levelVisible = true;

        tooltip.text.text = text;

        var tempPosition = tooltip.box.position.add((0, _utilities.sizeToVec)(tooltip.box.size).scale(0.5));
        if (size === null) {
          tooltip.box.width = tooltip.text.size.width + 24;
          tooltip.box.height = tooltip.text.size.height + 24;
        } else {
          tooltip.box.width = size.width;
          tooltip.box.height = size.height;
        }

        if (background !== null) {
          background = (0, _utilities.spreadToObject)(background, new (Function.prototype.bind.apply(_experimentBabylonJs2.default.Color4, [null].concat(brownColor)))());
          var brush = _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(background);
          tooltip.box.fill = brush;
        }

        fontColor = (0, _utilities.spreadToObject)(fontColor, new _experimentBabylonJs2.default.Color4(1, 1, 1, 1));

        tooltip.text.defaultFontColor = fontColor;

        position = (0, _utilities.spreadToObject)(position, tempPosition);
        var nextPos = position.subtract((0, _utilities.sizeToVec)(tooltip.box.size).scale(0.5).add(spaced)
        // TODO make a bounding function to make sure the tooltip is visible depending on the rendersize the position and size of the tooltip
        );tooltip.box.position = nextPos;
        tooltip.promise = duration;
        tooltip.event = event;
        tooltip.disposed = false;
      } else {
        position = (0, _utilities.spreadToObject)(position, new _experimentBabylonJs2.default.Vector2(0, 0));

        var sizeDefault = (0, _utilities.spreadToObject)(size, new _experimentBabylonJs2.default.Size(300, 300)

        // const normalColor = [202 / 255, 64 / 255, 0, 0.95]

        // let fontSuperSample = true
        // let fontSignedDistanceField = false
        // if (background === null) {
        //   fontSuperSample = false
        //   fontSignedDistanceField = true
        // }

        );var fontSuperSample = false;
        var fontSignedDistanceField = true;
        background = (0, _utilities.spreadToObject)(background, new (Function.prototype.bind.apply(_experimentBabylonJs2.default.Color4, [null].concat(brownColor)))());
        fontColor = (0, _utilities.spreadToObject)(fontColor, new _experimentBabylonJs2.default.Color4(1, 1, 1, 1));

        var _brush = _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(background);

        var tooltipBox = new _experimentBabylonJs2.default.Rectangle2D({
          parent: guiCanvas,
          id: 'tooltipBox' + tooltips.length,
          // position: position.subtract(size.scale(0.5).add(spaced)),
          width: sizeDefault.width,
          height: sizeDefault.height,
          // border: brush,
          // borderThickness: 2,
          fill: _brush
        });

        var tooltipText = new _experimentBabylonJs2.default.Text2D(text, {
          parent: tooltipBox,
          id: 'tooltipText' + tooltips.length,
          marginAlignment: 'h: center, v:center',
          defaultFontColor: fontColor,
          fontSuperSample: fontSuperSample,
          fontSignedDistanceField: fontSignedDistanceField,
          fontName: fontName
        });

        if (size === null) {
          tooltipBox.width = tooltipText.size.width + 24;
          tooltipBox.height = tooltipText.size.height + 24;
        }

        tooltipBox.position = position.subtract((0, _utilities.sizeToVec)(tooltipBox.size).scale(0.5).add(spaced));

        tooltip = { box: tooltipBox, text: tooltipText, promise: duration, id: id, disposed: false, event: event };

        this.set('tooltips', tooltips.concat(tooltip));
      }

      duration.then(function () {
        if (tooltip.promise === duration) {
          _this.hideTooltip(tooltip);
        }
        if (event.constructor === _EventData2.default) {
          event.happenedAt = _this.timeInMs;
          _this.addEvent(event);
        }
      });

      return tooltip;
    }
  }, {
    key: 'hideTooltip',
    value: function hideTooltip() {
      for (var _len2 = arguments.length, tooltips = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        tooltips[_key2] = arguments[_key2];
      }

      var allTooltips = this.get('tooltips', []);
      if (tooltips.length === 0) {
        tooltips = allTooltips;
      }

      // const newTooltips = []
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = allTooltips[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var tooltip = _step2.value;

          if (tooltips.indexOf(tooltip) !== -1) {
            if (typeof tooltip.box !== 'undefined') {
              tooltip.box.levelVisible = false;
              tooltip.disposed = true; // since dispose() is too slow, imitate the behavior by replacing old tooltip if necessary
            }
          }
          // else {
          //   newTooltips.push(tooltip)
          // }
        }
        // allTooltips.length = 0

        // this.set('tooltips', newTooltips)
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /* === Pause State === */

    /**
     * Funtion to set the PAUSE mode for all states. Default uses spacebar keydown event from this._parent.
     * @param {Number} key  keyCode of the the pause button, default to 32 (spacebar)
     * @param {string} flag event flag, defaults to this._parent.FLAG_EVENTS_INPUT_KEYDOWN
     */

  }, {
    key: 'setPauseKeyStroke',
    value: function setPauseKeyStroke() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
      var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var addDefaultDesign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var pauseState = function pauseState() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var state = this.state;
        var stateManager = this.stateManager;
        var R = this.R;

        if (options.data.keyCode === key) {
          state.freeze // key function
          ();stateManager.goToState(R.get.states_pause);
        }

        return 'state.pauseState: resolved';
      };

      var forcePause = function forcePause() {
        this.state.freeze // key function
        ();this.stateManager.goToState(this.R.get.states_pause);
        return 'state.forcePause: resolved';
      };

      var unPause = function unPause() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (options.data.keyCode === key) {
          if (this.stateManager.frozenState !== null) {
            this.stateManager.goToState(this.stateManager.frozenState);
          } else {
            (0, _utilities.debugError)('state.unPause: no frozen state !');
          }
        }

        return 'state.unPause: resolved';
      };

      flag = flag !== null ? flag : this.R.get.events.keydown;

      var stateKeys = this.stateKeys;
      for (var i = 0; i < stateKeys.length; i++) {
        if (stateKeys[i] !== this.R.get.states_pause) {
          // by default only one pause handling function per state
          this.registerEventFunction(stateKeys[i], flag, pauseState);
          this.registerEventFunction(stateKeys[i], this.R.get.events_pause, forcePause);
        } else {
          this.registerEventFunction(stateKeys[i], flag, unPause);
          this.registerEventFunction(stateKeys[i], this.R.get.events_pause, unPause);
        }
      }

      if (addDefaultDesign) {
        this.addDefaultPauseDesign();
      }
    }

    /**
     * Function that adds a basic pause design with background overlay and a large "PAUSE" text top center.
     * Uses babylon Rectangle2D and text2d
     */

  }, {
    key: 'addDefaultPauseDesign',
    value: function addDefaultPauseDesign() {
      if (_experimentBabylonJs2.default === null) {
        return false;
      }

      var awakePause = function awakePause() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        try {
          if (typeof this.taskObject === 'undefined') {
            throw new Error('state.awakePause: taskObject is undefined');
          }
          var stateManager = this.stateManager;

          var pauseBackground2D = stateManager.get('pauseBackground2D');
          var canvas = this.scene.screenCanvas;

          if (pauseBackground2D !== null) {
            pauseBackground2D.size = canvas.size;
            pauseBackground2D.levelVisible = true;
          } else {
            if (typeof canvas === 'undefined') {
              return 'awakePause: initialCanvas is undefined.';
            }
            // draw a rect2d of canvas size with background opacity 0.5
            // draw a large text2d "PAUSE" inside
            var baseOptions = {
              id: 'pauseBackground2D',
              text: 'Pause',
              x: 0,
              y: 0,
              width: canvas.width,
              height: canvas.height,
              fill: _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(new _experimentBabylonJs2.default.Color4(0.3, 0.3, 0.3, 0.5)),
              fontName: '40pt Verdana',
              backgroundRoundRadius: 0
            };

            options = _lodash2.default.extend(baseOptions, options);

            var customSized = canvas.size;
            if (options.width !== canvas.width || options.height !== canvas.height) {
              customSized = new _experimentBabylonJs2.default.Size(options.width, options.height);
            }

            var canvasOptions = {
              id: options.id,
              roundRadius: options.backgroundRoundRadius,
              fill: options.fill,
              parent: this.scene.screenCanvas,
              marginAlignment: 'h:center, v: center',
              size: customSized,
              zOrder: 0,
              children: [new _experimentBabylonJs2.default.Text2D(options.text, {
                fontName: options.fontName,
                marginAlignment: 'h: center, v:top',
                fontSignedDistanceField: true,
                zOrder: 0
              })]
            };

            var _pauseBackground2D = new _experimentBabylonJs2.default.Rectangle2D(canvasOptions);

            stateManager.set('pauseBackground2D', _pauseBackground2D // TODO Make those string part of R.
            );
          }
          return 'state.awakePause: resolved';
        } catch (e) {
          (0, _utilities.debugError)(e);
          return e;
        }
      };

      var endPause = function endPause() {
        try {
          if (typeof this.state === 'undefined') {
            throw new Error('state.endPause: state is undefined');
          }
          var stateManager = this.stateManager;
          var pauseBackground2D = stateManager.get('pauseBackground2D');

          if (pauseBackground2D !== null) {
            // pauseBackground2D.dispose()
            // stateManager.set('pauseBackground2D', null)
            pauseBackground2D.levelVisible = false;
          }

          return 'state.endPause: resolved';
        } catch (e) {
          (0, _utilities.debugError)(e);
          return e;
        }
      };

      this.registerAwakeningFunction(this.R.get.states_pause, awakePause);
      this.registerEndingFunction(this.R.get.states_pause, endPause);

      return true;
    }
  }, {
    key: 'stateWasFrozen',
    value: function stateWasFrozen() {
      var stateKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      this.frozenState = stateKey;

      // when frezing a state - events are not processed by the next state
      this.emptyEventHeap();
      this.emptyTimeTriggerEvents();
    }
  }, {
    key: 'stateWasUnfreezed',
    value: function stateWasUnfreezed() {
      var stateKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (this.frozenState !== stateKey) {
        (0, _utilities.debugError)('StateManager.stateWasUnfreezed: stateKey does not correspond to the frozenState');
      } else {
        this.newEvent(this.R.get.events_unfrozen);
        this.frozenState = null;
      }
    }

    /* === Time event === */

  }, {
    key: 'addTimeTriggerEvent',
    value: function addTimeTriggerEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('event');

      if (event.constructor === _EventData2.default) {
        if (event.happenedAt > this.timeInMs + 40) {
          this._timeTriggerEvents.push(event);
          (0, _utilities.debuglog)('StateManager: Trigger event added to the time triggers.');
        } else {
          this.addEvent(event);
          (0, _utilities.debugError)('StateManager.addTimeTriggerEvent: trigger event is to close to current time (<40ms). Added directly to the heap.');
        }
      } else {
        (0, _utilities.debugError)('StateManager: Event is not of class EventData.');
      }
    }

    /* === Event heap methods === */

  }, {
    key: 'addEvent',
    value: function addEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('event');

      if (event.constructor === _EventData2.default) {
        this._eventHeap.push(event);
        (0, _utilities.debuglog)('StateManager: Event added to the heap.');
      } else {
        (0, _utilities.debugError)('StateManager: Event is not of class EventData.');
      }
    }
  }, {
    key: 'newEvent',
    value: function newEvent() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var belongsTo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ['globalLog'];

      // check that the user did not use newEvent as addEvent
      if (flag.constructor === _EventData2.default) {
        (0, _utilities.debuglog)('StateManager.newEvent: flag is an EventData object. Using addEvent().');
        this.addEvent(flag);
        return flag;
      }

      // checks if the user gave a non array to belongsTo
      if (belongsTo.constructor !== Array) {
        if (belongsTo.constructor === String) {
          belongsTo = [belongsTo];
        } else {
          (0, _utilities.debugError)('stateManager.newEvent: belongs to need to be either a string or an array');
          return null;
        }
      } else if (belongsTo.indexOf('globalLog') === -1) {
        // add the missing globalLog to belongsTo
        belongsTo.push('globalLog');
      }

      var eventOptions = {
        belongsTo: belongsTo,
        handledAt: null,
        storedAt: null
      };
      if (data !== null) {
        eventOptions.data = data; // TODO ++++ SHOULD BE _.extend()
      } else if (time !== null && time.constructor === Object && data === null) {
        // treats time as the data and time as unknown
        eventOptions.data = time;
        time = null;
      }

      /* --- Not a time triggered event --- */
      if (time === null) {
        (0, _utilities.debuglog)('stateManager.newEvent: time is null, using addEvent() with this.timeInMs.');
        var _event = new _EventData2.default(flag, this.timeInMs, eventOptions);
        this.addEvent(_event);
        return _event;
      }

      /* --- Time triggered event --- */
      // check if time is a duration or a timestamp - TODO set max duration somewhere
      if (time < this.R.get.values_timestampThreshold) {
        // time is a duration
        time += this.timeInMs;
      }

      var event = new _EventData2.default(flag, time, eventOptions);
      this.addTimeTriggerEvent(event);
      return event;
    }
  }, {
    key: 'removeFirstEvent',
    value: function removeFirstEvent() {
      this._eventHeap.splice(0, 1);
    }
  }, {
    key: 'removeEvent',
    value: function removeEvent(event) {
      this._eventHeap = _lodash2.default.without(this._eventHeap, event);
    }
  }, {
    key: 'getFirstEventAndRemoveFromHeap',
    value: function getFirstEventAndRemoveFromHeap() {
      var byState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentStateKey;

      for (var i = 0; i < this._eventHeap.length; i++) {
        var event = this._eventHeap[i];
        if (event.forState === 'any' || event.forState === byState) {
          return this._eventHeap.splice(i);
        }
      }

      return undefined;
    }
  }, {
    key: 'spliceEventsForState',
    value: function spliceEventsForState() {
      var _eventHeap;

      var byState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentStateKey;

      var toSplice = [];
      for (var i = 0; i < this._eventHeap.length; i++) {
        var event = this._eventHeap[i];
        if (event.forState === 'any' || event.forState === byState) {
          toSplice.push(i);
        }
      }

      return (_eventHeap = this._eventHeap).multisplice.apply(_eventHeap, toSplice); // TODO use only one loop. And put events in a freezer if too long on the heap.
    }
  }, {
    key: 'emptyEventHeap',
    value: function emptyEventHeap() {
      this._eventHeap = [];
    }
  }, {
    key: 'emptyTimeTriggerEvents',
    value: function emptyTimeTriggerEvents() {
      this._timeTriggerEvents = [];
    }
  }, {
    key: 'getAllEvents',
    value: function getAllEvents() {
      return this._eventHeap.concat(this._timeTriggerEvents);
    }

    /**
     * Called by the state once it has finished handling an event. This function calls the storeEvent function.
     * @param  {event} event Handled event
     */

  }, {
    key: 'stateHasFinishedHandlingEvent',
    value: function stateHasFinishedHandlingEvent(event) {
      event.data.handledAt = this.timeInMs;
      event.handled = true;

      (0, _utilities.debuglog)('StateManager.stateHasFinishedHandlingEvent: event was handled.');

      if (this.dataManager.constructor === _DataManager2.default && event.toStore) {
        this.storeEvent(event);
      } else {
        (0, _utilities.debugWarn)('StateManager.stateHasFinishedHandlingEvent: dataManager is not set, not storing event.');
      }
    }
  }, {
    key: 'freezeEventHeap',
    value: function freezeEventHeap() {
      this.eventHeapIsFrozen = true;
      this.frozenEventHeap = this._eventHeap;
      // freeze the heap for certain event that need to be processed afterwards in series
      // TODO elements should not be deleted... maybe have firstNonFrozenEvent(); and a property of events if they are frozen or not
    }
  }, {
    key: 'unfreezeEventHeap',
    value: function unfreezeEventHeap() {
      var storeFrozenEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.eventHeapIsFrozen = false;

      if (storeFrozenEvents) {
        /* Reset event heap and store all frozen events in the globalLog */
        // const tempEvents = this._eventHeap TODO what was that for again ?
        this.emptyEventHeap();
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

  }, {
    key: 'registerEventFunction',
    value: function registerEventFunction(stateKey, eventFlag) {
      try {
        for (var _len3 = arguments.length, handlingFunctions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          handlingFunctions[_key3 - 2] = arguments[_key3];
        }

        _utilities.mustBeDefined.apply(undefined, [stateKey, eventFlag].concat(handlingFunctions));
        _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

        if (_lodash2.default.has(this.states, stateKey)) {
          var _states$stateKey;

          (_states$stateKey = this.states[stateKey]).registerEventFunctions.apply(_states$stateKey, [eventFlag, true].concat(handlingFunctions)); // TODO Handle overwrite better ?
        } else {
          throw new Error('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding event handling functions.');
        }
      } catch (e) {
        (0, _utilities.debugError)(e);
      }
    }
  }, {
    key: 'onNext',
    value: function onNext(eventFlag) {
      var _currentState;

      for (var _len4 = arguments.length, handlingFunctions = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        handlingFunctions[_key4 - 1] = arguments[_key4];
      }

      return (_currentState = this.currentState).onNext.apply(_currentState, [eventFlag].concat(handlingFunctions));
    }
  }, {
    key: 'resolveOnKey',
    value: function resolveOnKey() {
      var _currentState2;

      return (_currentState2 = this.currentState).resolveOnKey.apply(_currentState2, arguments);
    }
  }, {
    key: 'resolveOnClick',
    value: function resolveOnClick() {
      var _currentState3;

      return (_currentState3 = this.currentState).resolveOnClick.apply(_currentState3, arguments);
    }

    /**
     * Adds a function to the awakening function array in the state object. Those function must return a promise.
     * @param  {[type]} stateKey         [description]
     * @param  {[type]} handlingFunction [description]
     * @return {[type]}                  [description]
     */

  }, {
    key: 'registerAwakeningFunction',
    value: function registerAwakeningFunction() {
      var stateKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var handlingFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();
      var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (_lodash2.default.has(this.states, stateKey)) {
        this.states[stateKey].registerCycleFunctions('awakening', overwrite, handlingFunction);
      } else {
        (0, _utilities.debugError)('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding awakening handling functions.');
      }
    }
  }, {
    key: 'registerEndingFunction',
    value: function registerEndingFunction() {
      var stateKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var handlingFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();
      var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (_lodash2.default.has(this.states, stateKey)) {
        this.states[stateKey].registerCycleFunctions('ending', overwrite, handlingFunction);
      } else {
        (0, _utilities.debugError)('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding awakening handling functions.');
      }
    }
  }, {
    key: 'registerUpdateFunction',
    value: function registerUpdateFunction() {
      var stateKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var handlingFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();
      var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (_lodash2.default.has(this.states, stateKey)) {
        this.states[stateKey].registerCycleFunctions('udpate', overwrite, handlingFunction);
        (0, _utilities.debuglog)('StateManager: handling function added to awakeningFunctions array for state \'' + stateKey + '\'');
      } else {
        (0, _utilities.debugError)('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding awakening handling functions.');
      }
    }

    /* === Globals === */
    /**
     * Stores a function into the globalFunctions array of the stateManager. Those function must return a promise.
     * Storing function in the stateManager should be reserved to functions that are to be reused across states, and in general access global variables.
     * @param  {string} name            function's name
     * @param  {function} promiseFunction function should return a promise
     */

  }, {
    key: 'registerGlobalFunction',
    value: function registerGlobalFunction() {
      var func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (func.constructor !== Function) {
        (0, _utilities.debugError)('StateManager.registerGlobalFunction: func is not a function');
      } else {
        // TODO checks that it works
        // var promiseFunction = looksLikeAPromise(func) ? func : Promise.method(func); Do no promisify here - give user the choice
        if (name === null) {
          name = func.name;
        }

        this.globalFunctions[name] = func;
      }
    }

    /**
     * Shorthand for registerGlobalFunction
     * @param  {string} name            function's name
     * @param  {function} promiseFunction
     */

  }, {
    key: 'register',
    value: function register() {
      for (var _len5 = arguments.length, functions = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        functions[_key5] = arguments[_key5];
      }

      for (var i = 0; i < functions.length; i++) {
        this.registerGlobalFunction(functions[i]);
      }
    }

    // TODO get rid of this function use only call

  }, {
    key: 'callGlobalFunction',
    value: function callGlobalFunction(name) {
      for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      this.call.apply(this, [name].concat(args));
    }

    /**
     * Shorthand for callGlobalFunction
     * @param  {string} name    Function's name
     * @param  {...object} args Optional arguments iterable
     * @return {promise}
     */

  }, {
    key: 'call',
    value: function call(name) {
      if (typeof name === 'undefined') {
        (0, _utilities.debugError)('StateManager.call: name of the function needs to be defined.');
      } else if (_lodash2.default.has(this.globalFunctions, name)) {
        for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
          args[_key7 - 1] = arguments[_key7];
        }

        return this.globalFunctions[name].bind(this.context).apply(undefined, args);
      } else {
        (0, _utilities.debugWarn)('StateManager.call: globals do not contain function \'' + name + '\'');
      }
      return undefined;
    }
  }, {
    key: 'promise',
    value: function promise(name) {
      if (typeof name === 'undefined') {
        (0, _utilities.debugError)('StateManager.promiseGlobalFunction: name is undefined.');
      } else if (_lodash2.default.has(this.globalFunctions, name)) {
        for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
          args[_key8 - 1] = arguments[_key8];
        }

        return _bluebird2.default.method(this.globalFunctions[name]).bind(this.context).apply(undefined, args);
      } else {
        (0, _utilities.debugWarn)('StateManager.promiseGlobalFunction: globals do not contain function \'' + name + '\'');
      }

      return undefined;
    }

    /**
     * Recurse on a given registered function, returns a promise resolving to the concatenated results.
     * @param  {string} name    Name of the function already registered in the stateManager
     * @param  {numeric} amount The amount of time we should recurse
     * @param  {Object} options Optional, object to specify as options of the registered function
     * @param  {Array}  results Optional, where to store the results.
     * @return {Promise}        Promise resolving to the filed results array.
     */

  }, {
    key: 'recurseOnGlobalFunction',
    value: function recurseOnGlobalFunction() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      var _this2 = this;

      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var results = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      if (!_lodash2.default.has(this.globalFunctions, name)) {
        (0, _utilities.debugError)('StateManager.recurseOnGlobalFunction: globals do not contain function \'' + name + '\'');
        return null;
      }
      // Base case - just return the promisified result
      if (amount === 0) {
        return new _bluebird2.default(function (resolve) {
          resolve(results);
        });
      }

      var next = this.promise.apply(this, [name].concat(_toConsumableArray(args))).then(function (r) {
        results = results.concat(r);
        return _this2.recurseOnGlobalFunction(name, amount - 1, args, results);
      });

      return next;
    }

    /**
     * Shorthand for recurseOnGlobalFunction.
     * @param  {string} name    Name of the function already registered in the stateManager
     * @param  {numeric} amount The amount of time we should recurse
     * @param  {args} args Optional, array of arguments to pass to the promise
     * @param  {Array}  results Optional, where to store the results.
     * @return {Promise}        Promise resolving to the filed results array.
     */

  }, {
    key: 'recurse',
    value: function recurse() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var results = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      this.recurseOnGlobalFunction(name, amount, args, results);
    }

    /**
     * Return a stored global or null if it does not exist.
     * @param  {string} name String name of the variable
     * @return {?*}
     */

  }, {
    key: 'getGlobal',
    value: function getGlobal() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var setDefault = arguments[1];

      if (this.globals.hasOwnProperty(name)) {
        return this.globals[name];
      } else if (typeof setDefault !== 'undefined') {
        this.globals[name] = setDefault;
        return this.globals[name];
      }
      (0, _utilities.debugWarn)('StateManager: globals do not contain variable \'' + name + '\' - and no default is given');
      return null;
    }
  }, {
    key: 'get',
    value: function get() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var setDefault = arguments[1];

      return this.getGlobal(name, setDefault);
    }

    /**
     * Stores a global variable. Beware if storing objects (stored by reference, any modification outside of the statemanager will affect the stored variable).
     * Maybe a _.cloneDeep would be better... lets think about it for a while.
     * @param {string} name  Name of the variable
     * @param {*} value Variable
     */

  }, {
    key: 'setGlobal',
    value: function setGlobal() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      this.globals[name] = value;
      (0, _utilities.debuglog)('StateManager: global \'' + name + '\' set to \'' + value + '\'');
    }
  }, {
    key: 'set',
    value: function set() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      this.setGlobal(name, value);
    }
  }, {
    key: 'getStateObject',
    value: function getStateObject(key) {
      if (_lodash2.default.has(this.states, key)) {
        return this.states[key];
      }
      (0, _utilities.debugError)('StateManager: Invalid state key.');
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

  }, {
    key: 'context',
    get: function get() {
      if (this._taskObject) {
        return this._taskObject.getContext(this);
      }
      return {
        taskObject: null,
        dataManager: this.dataManager,
        scene: this._parent, // TODO Force the ._parent to be the .scene ?
        stateManager: this,
        state: this.currentState,
        R: this.R
      };
    }
  }, {
    key: 'stateKeys',
    get: function get() {
      return Object.keys(this.states);
    }
  }, {
    key: 'currentStateKey',
    get: function get() {
      return this._currentStateKey;
    },
    set: function set(key) {
      if (_lodash2.default.has(this.states, key)) {
        this.goToState(key);
      } else {
        (0, _utilities.debugError)('StateManager: Invalid state key.');
      }
    }
  }, {
    key: 'currentState',
    get: function get() {
      return this.states[this.currentStateKey];
    },
    set: function set(state) {
      if (typeof state.key !== 'undefined') {
        this.currentStateKey = state.key;
      } else {
        (0, _utilities.debugError)('StateManager: Invalid state, it has no state key defined.');
      }
    }
  }, {
    key: 'eventHeap',
    get: function get() {
      return this._eventHeap;
    },
    set: function set(value) {
      // eslint-disable-line
      (0, _utilities.debugError)('StateManager: eventHeap is readonly. Add events through the class methods.');
    }
  }, {
    key: 'firstEvent',
    get: function get() {
      if (this._eventHeap.length) {
        return this._eventHeap[0];
      }
      return undefined;
    },
    set: function set(value) {
      // TODO not implemented -- maybe somekind of bruteforce to have an important input be treated first
      (0, _utilities.debugError)('StateManager: firstEvent is readonly.');
    }

    /* === Time functions === */

  }, {
    key: 'time',
    get: function get() {
      return this.timeInMs;
    }
  }, {
    key: 'timeInSec',
    get: function get() {
      return new Date().getTime() / 1000;
    }
  }, {
    key: 'timeInMs',
    get: function get() {
      return new Date().getTime();
    }
  }]);

  return StateManager;
}();

exports.default = StateManager;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Boiler Plate For Cognitive Tasks JS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * author: Albert Buchard 2016
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * REQUIRE ECMA2016 / JQUERY / MATHJS / BABYLON
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

/* =============== Set-up =============== */


var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentBabylonJs = __webpack_require__(7);

var _experimentBabylonJs2 = _interopRequireDefault(_experimentBabylonJs);

var _experimentBoxes = __webpack_require__(12);

var _bluebird = __webpack_require__(2);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _experimentMathjs = __webpack_require__(13);

var _experimentMathjs2 = _interopRequireDefault(_experimentMathjs);

var _DataManager = __webpack_require__(4);

var _DataManager2 = _interopRequireDefault(_DataManager);

var _RessourceManager = __webpack_require__(5);

var _RessourceManager2 = _interopRequireDefault(_RessourceManager);

var _EventData = __webpack_require__(3);

var _EventData2 = _interopRequireDefault(_EventData);

var _StateManager = __webpack_require__(9);

var _StateManager2 = _interopRequireDefault(_StateManager);

var _State = __webpack_require__(6);

var _State2 = _interopRequireDefault(_State);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof window !== 'undefined') {
  /* === Get the absolute path of the library === */
  var scripts = document.getElementsByTagName('script');
  if (scripts.length) {
    var assetsFolderFullpath = scripts[scripts.length - 1].src;
    var delimiterIndices = assetsFolderFullpath.indicesOf('/');
    window.assetsFolderFullpath = assetsFolderFullpath.substr(0, delimiterIndices[delimiterIndices.length - 2]);
  } else {
    window.assetsFolderFullpath = './';
  }
}

/** Class handling graphic engine interface and lifecycle of the task */

var TaskObject = function () {
  /**
   * class constructor : initialize the task
   * @param  {Object} target element where the task will be contained
   * @return {TaskObject}
   */
  function TaskObject() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
    var assetsFolder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var engine = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'babylon';

    _classCallCheck(this, TaskObject);

    if (typeof window === 'undefined') {
      // TODO should it fail more gracefully ?
      return { error: 'Wrong environment. ExperimentJS only works in the browser.' };
    }
    /* --- Constants --- */
    // this.constants = {};

    /* --- Store canvas information --- */
    this._target = typeof target.length !== 'undefined' ? target[0] : target;
    this.canvas = this._target;

    /* --- Setup engine --- */
    if (engine === 'babylon') {
      // Start BabylonJS engine
      this.engine = new _experimentBabylonJs2.default.Engine(this.canvas, false, null, false); // TODO check hardware for retina
    } else {
      throw new Error('TaskObject.constructor: engine not supported.');
    }

    /* --- Size values --- */
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.babylonCanvasHeight = this.canvas.height;
    this.babylonCanvasWidth = this.canvas.width;

    /**
     * Task DataManager
     * @type {DataManager}
     */
    this.dataManager = new _DataManager2.default(this);

    /**
     * The main connection object in the dataManager used by the TaskObject.
     * It is set when using this.setConnection() which is a wrapper for the dataManager function
     * @type {Object}
     */
    this.connection = null;

    /* --- Add global mouse and keyboard event tables --- */
    var globalLogFields = this.dataManager.GLOBAL_LOG_FIELDS;

    // globalLogs is the default data table of the dataManager,
    // adding specific data table for mouse and key events
    this.dataManager.addTable('keyEvents', globalLogFields);
    this.dataManager.addTable('mouseEvents', globalLogFields

    /* --- Add task status table --- */
    );var taskStatusFields = ['level', 'happenedAt'];
    this.dataManager.addTable('taskStatus', taskStatusFields

    /* --- Add raised flags --- */
    );var statusFlagsFields = ['flag', 'happenedAt'];
    this.dataManager.addTable('statusFlags', statusFlagsFields

    /* --- Add the checkpoint table --- */
    );var checkpointFields = ['code', 'happenedAt', 'message'];
    this.dataManager.addTable('checkpoints', checkpointFields

    /* --- Assets --- */
    /**
     * Path to assets folder
     * @type {String}
     */
    );if (assetsFolder) {
      this.ASSETS_FOLDER = assetsFolder;
    } else {
      this.ASSETS_FOLDER = window.assetsFolderFullpath;
    }

    this.ASSETS_FLARE_PATH = this.ASSETS_FOLDER + '/textures/flare/flare.png';

    /**
     * Object to store global task assets after loading or creation
     * @type {Object}
     */
    this.assetsToLoad = {};

    this.R = new _RessourceManager2.default();
    this.R.add({
      states: {
        active: 'active',
        idle: 'idle',
        pause: 'pause'
      },
      folders: {
        assetsFolder: assetsFolder || window.assetsFolderFullpath
      }
    }

    /* --- Set-up events --- */
    );this.flags = {};
    this.keyState = []; // holds state of keys being stroked indexed by event.keyCode
    this.shouldShowDebug = typeof window.DEBUG_MODE_ONE !== 'undefined' ? window.DEBUG_MODE_ONE : false;
    this.setupGlobalEvents

    /* --- Modals --- */
    ();this.currentModal = null;

    /* --- Task parameters --- */
    this.parameters = {};

    /* --- Task level variables --- */
    this.variables = {};
    this.variables.shouldSeeInformation = true;

    /* --- Scenes --- */
    this.scenes = {};
    this.sceneGenerators = {};
    this.sceneGenerators.functions = {};
    this.sceneGenerators.functionsOptions = {};

    /* --- Set a default loading scene --- */
    this.sceneGenerators.loading = TaskObject.default2dSceneGenerator;
    this.sceneGenerators.loadingOptions = { sceneKey: 'loading', shouldLoadAssets: true };

    this._currentSceneKey = '';

    /* --- ParamBox setup --- */
    this._paramBox = null;

    /* if ParamBox library is loaded - create one */
    if (typeof _experimentBoxes.ParamBox === 'function') {
      this._paramBox = new _experimentBoxes.ParamBox();
    }
  }

  /* ======== Scene generators ======== */
  /*
  newScene(key = mandatory()) {
    // TODO create a child object holding scene keys, scene generators and babylon scenes
  }
   registerSceneGenerators(...sceneGeneratorObjects) {
    // TODO
  }
  */

  _createClass(TaskObject, [{
    key: 'registerSceneGenerator',
    value: function registerSceneGenerator() {
      var sceneGenerator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('sceneGenerator');
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var loading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var promise = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var key = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      // option base
      options = _lodash2.default.clone(options);

      if (key === null && sceneGenerator.name !== '') {
        key = sceneGenerator.name;
      } else {
        key = 'scene' + Object.keys(this.sceneGenerators.functions).length;
      }

      if (loading) {
        this.sceneGenerators.loading = sceneGenerator;
        this.sceneGenerators.loadingOptions = options;
      } else {
        this.sceneGenerators.functions[key] = sceneGenerator;
        this.sceneGenerators.functionsOptions[key] = options;
      }
    }
  }, {
    key: 'registerLoadingFunction',
    value: function registerLoadingFunction() {
      var loadingSceneGenerator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('loadingSceneGenerator');
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var promise = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      /* --- Force sceneKey to be loading --- */
      options.sceneKey = 'loading';

      this.registerSceneGenerator(loadingSceneGenerator, options, true, promise);
    }
  }, {
    key: 'callSceneGenerator',
    value: function callSceneGenerator() {
      var _this = this;

      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      var sceneOptions = this.sceneGenerators.functionsOptions[key];
      var generator = this.sceneGenerators.functions[key];

      var promise = _bluebird2.default.method(generator.bind(this.context))(sceneOptions).then(function (scene) {
        if (typeof scene.sceneKey === 'undefined') {
          scene.sceneKey = key;
        }

        _this.scenes[scene.sceneKey] = scene;
      });

      return promise;
    }
  }, {
    key: 'generateScenes',
    value: function generateScenes() {
      var functionKeys = Object.keys(this.sceneGenerators.functions);
      var promises = [];
      for (var i = 0; i < functionKeys.length; i++) {
        promises.push(this.callSceneGenerator(functionKeys[i]));
      }

      return _bluebird2.default.all(promises);
    }
  }, {
    key: 'cloneAssetsIntoScene',
    value: function cloneAssetsIntoScene() {
      var assets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var scene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      if (assets.constructor !== _utilities.Array) {
        assets = [assets];
      }

      var assetsArray = [];
      for (var i = 0; i < assets.length; i++) {
        var clone = assets[i].clone();
        clone._scene = scene;

        if (assets[i].constructor === _experimentBabylonJs2.default.Mesh) {
          if (clone.material) {
            clone.material = clone.material.clone();
            clone.material._scene = scene;
            if (clone.material.subMaterials) {
              for (var j = 0; j < clone.material.subMaterials.length; j++) {
                clone.material.subMaterials[j] = clone.material.subMaterials[j].clone();
                clone.material.subMaterials[j]._scene = scene;
              }
            }
          }
          scene.addMesh(clone);
        }

        assetsArray.push(clone);
      }

      return assetsArray;
    }
  }, {
    key: 'loadAssets',
    value: function loadAssets() {
      var assetObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var scene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();
      var assetFolder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      if (assetObject.constructor !== Object) {
        throw new Error('TaskObject.loadAssets: assetObject is not an Object');
      }

      if (assetFolder === '' && typeof this.ASSETS_FOLDER !== 'undefined') {
        assetFolder = this.ASSETS_FOLDER;
      }

      var textureFormats = ['png', 'bmp', 'jpg', 'tiff', 'svg'];
      var soundFormats = ['wav', 'mp3', 'flac', 'aac', 'mp4', 'ogg'];

      var assetManager = new _experimentBabylonJs2.default.AssetsManager(scene);
      var R = this.R;

      var binaryPromises = [];

      var names = Object.keys(assetObject);
      var field = void 0;
      var type = void 0;
      var path = void 0;
      for (var i = 0; i < names.length; i++) {
        field = assetObject[names[i]];

        if (field.constructor === _utilities.String) {
          path = this.ASSETS_FOLDER + field;

          if (textureFormats.indexOf(R.getFormat(path)) !== -1) {
            type = 'texture';
          } else if (soundFormats.indexOf(R.getFormat(path)) !== -1) {
            type = 'sound';
          } else {
            console.warn('TaskObject.loadAssets: asset invalid or not implemented with shorthand string definition (use full object with path and type)');
            type = 'invalid';
          }
        } else if (field.constructor === Object && Object.keys(field).includes(['path', 'type'])) {
          path = this.ASSETS_FOLDER + field.path;
          type = field.type;
        } else {
          console.warn('TaskObject.loadAssets: asset invalid');
          type = 'invalid';
        }

        if (type === 'texture') {
          var assetManagerTask = assetManager.addTextureTask(names[i] + 'Task', path);
          assetManagerTask.onSuccess = function (task) {
            R.add({
              textures: _defineProperty({}, this.textureName, task.texture)
            });
          }.bind({
            textureName: names[i]
          });
        } else if (type === 'sound') {
          var _assetManagerTask = assetManager.addBinaryFileTask(names[i] + 'Task', path);
          _assetManagerTask.onSuccess = function (task) {
            var isReady = new _utilities.Deferred();
            binaryPromises.push(isReady.promise);
            R.add({
              sounds: _defineProperty({}, this.soundName, new _experimentBabylonJs2.default.Sound(this.soundName, task.data, scene, isReady.resolve))
            });
          }.bind({
            soundName: names[i]
          });
        }
        // TODO all the rest such as Meshes.. what else ?
      }

      /* --- Create a Deferred promise that will resolve after loading is complete --- */
      var loadDeferred = new _utilities.Deferred();

      assetManager.load();
      assetManager.onFinish = function onFinish(tasks) {
        (0, _utilities.debuglog)('TaskObject.loadAssets: tasks completed', tasks);
        _bluebird2.default.all(binaryPromises).then(function () {
          return loadDeferred.resolve(tasks);
        });
      };

      return loadDeferred.promise;
    }
  }, {
    key: 'cloneAssetIntoScene',
    value: function cloneAssetIntoScene() {
      var asset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var scene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      // TODO: Merge with cloneAssetsIntoScene
      if (asset.constructor === _utilities.Array) {
        return this.cloneAssetsIntoScene(asset, scene);
      }

      var clone = asset.clone();
      clone._scene = scene;

      if (asset.constructor === _experimentBabylonJs2.default.Mesh) {
        if (clone.material) {
          clone.material = clone.material.clone();
          clone.material._scene = scene;
          if (clone.material.subMaterials) {
            for (var i = 0; i < clone.material.subMaterials.length; i++) {
              clone.material.subMaterials[i] = clone.material.subMaterials[i].clone();
              clone.material.subMaterials[i]._scene = scene;
            }
          }
        }
        scene.addMesh(clone);
      }

      return clone;
    }

    /* ======== Class Methods ======== */
    /* ======== Lifecycle Methods ======== */
    /**
     * Creates the game engine object and loads the scenes.
     */

  }, {
    key: 'startTask',
    value: function startTask() {
      var _this2 = this;

      if (typeof window === 'undefined') {
        return _bluebird2.default.resolve();
      }

      window.addEventListener('resize', function () {
        _this2.engine.resize();
      });

      var deferred = new _utilities.Deferred();
      /* --- Create a loading scene in order to load assets --- */
      var loadingOptions = this.sceneGenerators.loadingOptions;
      var loadingScene = this.sceneGenerators.loading.bind(this.context)(loadingOptions);
      loadingScene.loadingPromise.then(function () {
        /* --- Store the scene in the TaskObject --- */
        _this2.scenes.loading = loadingScene;

        /* --- Set the currentScene to the loading scene that has finished loading --- */
        _this2.currentScene = loadingScene.sceneKey;

        if (typeof loadingScene.loadingPromise !== 'undefined' && loadingScene.loadingPromise.constructor === _bluebird2.default) {
          return loadingScene.loadingPromise;
        }
        return _bluebird2.default.resolve();
      }).then(function () {
        /* --- Set the loaded flag --- */
        _this2.dataManager.addRows('statusFlags', {
          flag: _this2.R.get.flags_hasLoaded,
          happenedAt: _this2.timeInMs
        }

        /* --- Start the render loop --- */
        );_this2.engine.runRenderLoop(function () {
          _this2.scenes[_this2.currentScene].render();
        }

        /* --- Now that assets are loaded we generate the task scenes --- */
        );return _this2.generateScenes();
      }).then(function (message) {
        (0, _utilities.debuglog)(message);
        deferred.resolve('TaskObject.startTask: loaded and scene generated.');
      });

      return deferred.promise;
    }

    /* ======== Babylon Setup ======== */
    /* === Global events === */

  }, {
    key: 'setupGlobalEvents',
    value: function setupGlobalEvents() {
      var _this3 = this;

      // TODO: Put every flag in the ressourceManager
      /* --- Lifecycle flags --- */
      var R = this.R;
      R.add({
        flags: { // TODO think about how to order those strings so not mess everything up and keep it understandable
          hasLoaded: 'hasLoaded',
          sceneStarts: 'scene_starts',
          sceneEnds: 'scene_ends'
        },
        events: {
          mouseMove: 'mouse_move',
          click: 'mouse_click',
          pick: 'mouse_pick',
          keydown: 'key_down',
          keyup: 'key_up',
          resize: 'resize',
          windowFocus: 'windowFocus',
          windowBlur: 'windowBlur',
          pause: 'pause',
          wasHandled: 'was_handled',
          beingHandled: 'being_handled',
          modalDismissed: 'modalDismissed',
          tooltipDismissed: 'tooltipDismissed'
        }
      }

      /* Add keyboard listener */
      );window.addEventListener('keydown', function (evt) {
        (0, _utilities.debuglog)('TaskObject: Keydown event.');
        (0, _utilities.debuglog)(evt

        // call taskObject keyfunction handler
        );_this3.keyfunction(evt

        // store keydown event
        );var eventData = new _EventData2.default(R.get.events_keydown, _this3.timeInMs, {
          belongsTo: ['globalLog', 'keyEvents'],
          handledAt: null,
          storedAt: null,
          keyCode: evt.keyCode,
          key: evt.key
        });

        // TODO add event to current scene should be a method
        if (typeof _this3.currentSceneObject !== 'undefined') {
          if (typeof _this3.currentSceneObject.stateManager !== 'undefined') {
            _this3.currentSceneObject.stateManager.addEvent(eventData);
          }
        }
      }

      // update the keystates when keyup but do not store event
      // TODO think if usefull to store keyup
      );window.addEventListener('keyup', function (evt) {
        _this3.keyfunction(evt);
      }

      /* window.addEventListener("mousemove", function(evt) {
        debuglog("TaskObject: mousemove event.");
        debuglog(evt);
         var eventData = new EventData(thisObject.FLAG_EVENTS_INPUT_MOUSEMOVE, thisObject.timeInMs, {
          belongsTo: ["globalLog", "mouseEvents"],
          handledAt: null,
          storedAt: null,
          clientX: evt.clientX,
          clientY: evt.clientY
        }); //make an static EventData from dom event?
         if (typeof thisObject.currentSceneObject !== "undefined") {
          if (typeof thisObject.currentSceneObject.stateManager !== "undefined") {
            thisObject.currentSceneObject.stateManager.addEvent(eventData);
          }
        }
       });*/
      );window.addEventListener('mousedown', function (evt) {
        (0, _utilities.debuglog)('TaskObject: mousedown event.');
        (0, _utilities.debuglog)(evt);

        var eventData = new _EventData2.default(R.get.events_click, new Date().getTime(), {
          belongsTo: ['globalLog', 'mouseEvents'],
          handledAt: null,
          storedAt: null,
          clientX: evt.clientX,
          clientY: evt.clientY,
          engineX: evt.clientX * (_this3.renderSize.width / window.innerWidth),
          engineY: (window.innerHeight - evt.clientY) * (_this3.renderSize.height / window.innerHeight)
        });

        // make an static EventData from dom event?
        if (typeof _this3.currentSceneObject !== 'undefined') {
          if (typeof _this3.currentSceneObject.stateManager !== 'undefined') {
            _this3.currentSceneObject.stateManager.addEvent(eventData);
          }
        }
      });

      window.addEventListener('resize', function (evt) {
        (0, _utilities.debuglog)('TaskObject: resize event.');
        (0, _utilities.debuglog)(evt);

        var eventData = new _EventData2.default(R.get.events_resize, _this3.timeInMs, {
          belongsTo: ['globalLog'],
          handledAt: null,
          storedAt: null,
          outerHeight: evt.target.outerHeight,
          outerWidth: evt.target.outerWidth
        });

        // if a current scene exists pass it down the stateManager
        // and look for a resize handler updateContentFrame
        if (typeof _this3.currentSceneObject !== 'undefined') {
          try {
            _this3.addEventToCurrentScene(eventData);
          } catch (e) {
            console.error(e);
          } finally {
            if (typeof _this3.currentSceneObject.updateContentFrame !== 'undefined') {
              _this3.currentSceneObject.updateContentFrame();
            }
          }
        }
      }

      /* --- Focus event --- */
      );var checkFocus = function () {
        var event = R.get.events_windowBlur;
        if (document.hasFocus()) {
          event = R.get.events_windowFocus;
        }

        this.addEventToCurrentScene(new _EventData2.default(event, this.timeInMs));
      }.bind(this);

      var visibilityChange = void 0;
      if (typeof document.hidden !== 'undefined') {
        visibilityChange = 'visibilitychange';
      } else if (typeof document.mozHidden !== 'undefined') {
        visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        visibilityChange = 'webkitvisibilitychange';
      }

      document.addEventListener(visibilityChange, checkFocus);
      window.addEventListener('focus', checkFocus);
      window.addEventListener('blur', checkFocus);
    }
  }, {
    key: 'keyfunction',
    value: function keyfunction(e) {
      var dCode = 68;
      var shiftCode = 16;
      var altCode = 18; // TODO check if it is the same on all platforms

      // check if shift + P hotkeys were stroke and toggle visibility if so
      this.keyState[e.keyCode] = e.type === 'keydown';

      // hide and show debug layer
      if (this.keyState[shiftCode] && this.keyState[altCode] && this.keyState[dCode]) {
        // 16 == Shift - 68 == D -- 18 Alt
        // make sure to reset D value in case keyup event is ignored (keep shift true for rapid toggle)
        this.keyState[dCode] = false;
        this.keyState[altCode] = false;

        // toggle debug visibility
        this.toggleDebugLayer

        // prevent default action if any
        ();e.preventDefault();
      }
    }
  }, {
    key: 'addStateManager',
    value: function addStateManager() {
      var scene = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('scene');

      scene.stateManager = new _StateManager2.default(scene, this.dataManager);
    }

    // TODO create a familly of hooks that call functions forthe curent scene, like this one

  }, {
    key: 'addEventToCurrentScene',
    value: function addEventToCurrentScene() {
      var eventData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      try {
        // checks that there is a current scene
        if (typeof this.currentSceneObject !== 'undefined') {
          // checks that the scene has a stateManager
          if (typeof this.currentSceneObject.stateManager !== 'undefined') {
            // adds the event
            this.currentSceneObject.stateManager.addEvent(eventData);
          } else {
            throw new Error('TaskObject.addEventToCurrentScene: No stateManager in currentSceneObject');
          }
        } else {
          // else return an error message
          throw new Error('TaskObject.addEventToCurrentScene: No current scene object');
        }
      } catch (e) {
        (0, _utilities.debugError)(e);
      }
    }

    /**
     * create2DScene - 2D Scene generator with an initialCanvas of the specifified size
     * Babylon Scene objects are enriched in experiment-js with:
     *  - sceneKey
     *  - parentTaskObject
     *  - stateManager
     *  - dataManager
     *  - initialCanvas
     *  - initialCamera
     *  - updateContentFrame
     * Importantly - The registerBeforeRender() lifecycle function calls the update function of the stateManager
     *
     * @param {object} [options] Object with key-value options for the 2D scene, defaults are :
     *  - sceneKey: `scene${Math.random() * 100000}`,
     *  - canvasBackground: new BABYLON.Color4(0, 0, 0, 1),
     *  - backgroundRoundRadius: 50,
     *  - clearColor: new BABYLON.Color4(0, 0, 0, 1),
     *  - canvasPercentWidth: 0.8,
     *  - canvasPercentHeight: 1,
     *
     *
     * @returns {BABYLON.Scene}
     */

  }, {
    key: 'create2DScene',
    value: function create2DScene() {
      var _this4 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      var optionsBase = {
        sceneKey: 'scene' + Math.random() * 100000,
        canvasBackground: new _experimentBabylonJs2.default.Color4(0, 0, 0, 1),
        backgroundRoundRadius: 0,
        clearColor: new _experimentBabylonJs2.default.Color4(0, 0, 0, 1),
        width: null,
        height: null,
        canvasPercentWidth: 1,
        canvasPercentHeight: 1,
        minWidth: Number.NEGATIVE_INFINITY,
        minHeight: Number.NEGATIVE_INFINITY,
        maxWidth: Number.POSITIVE_INFINITY,
        maxHeight: Number.POSITIVE_INFINITY
      };

      options = _lodash2.default.extend(optionsBase, options);

      var getCanvasDimensions = function getCanvasDimensions() {
        var noNull = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var size = null;
        var width = null;
        var height = null;

        var pWidth = (_this4.renderSize.width * options.canvasPercentWidth).boundTo(options.minWidth, options.maxWidth);
        var pHeight = (_this4.renderSize.height * options.canvasPercentHeight).boundTo(options.minWidth, options.maxHeight);

        var x = null;
        var y = null;

        if (options.width) {
          width = options.width;
        } else if (options.canvasPercentWidth !== 1) {
          width = pWidth;
        }
        if (options.height) {
          height = options.height;
        } else if (options.canvasPercentHeight !== 1) {
          height = pHeight;
        }

        if (height !== null || width !== null || noNull) {
          size = new _experimentBabylonJs2.default.Size(width !== null ? width : pWidth, height !== null ? height : pHeight);
          x = _this4.renderSize.width / 2 - _this4.renderSize.width * options.canvasPercentWidth / 2;
          y = _this4.renderSize.height / 2 - _this4.renderSize.height * options.canvasPercentHeight / 2;
        }

        return { size: size, x: x, y: y };
      };

      var _getCanvasDimensions = getCanvasDimensions(),
          customSized = _getCanvasDimensions.size;

      var scene = new _experimentBabylonJs2.default.Scene(this.engine);

      /**
       * Holds the scenekey inside the scene object.
       * @type {string}
       */
      scene.sceneKey = options.sceneKey;

      /**
       * Reference to the parent taskObject
       * @type {TaskObject}
       */
      scene.parentTaskObject = this;

      /* --- Add a stateManager --- */
      this.addStateManager(scene

      /* --- Set background --- */
      );scene.clearColor = options.clearColor;

      var camera = new _experimentBabylonJs2.default.ArcRotateCamera('Camera', 0, Math.PI / 2, 12, _experimentBabylonJs2.default.Vector3.Zero(), scene);
      var canvasOptions = {
        id: 'ScreenCanvas',
        backgroundFill: _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(options.clearColor),
        fill: _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(options.clearColor),
        zOrder: 1
      };

      var canvas = new _experimentBabylonJs2.default.ScreenSpaceCanvas2D(scene, canvasOptions);

      canvasOptions = {
        id: 'initialCanvas',
        parent: canvas,
        roundRadius: options.backgroundRoundRadius,
        borderThickness: 0,
        fill: _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(options.canvasBackground),
        marginAlignment: 'h: center, v: center',
        size: customSized,
        zOrder: 1
      };

      var initialCanvas = new _experimentBabylonJs2.default.Rectangle2D(canvasOptions);

      /* Set the added canvas and camera to known fields in the scene*/
      scene.screenCanvas = canvas;
      scene.initialCanvas = initialCanvas;
      scene.initialCamera = camera;

      scene.initialCanvas.lastResize = this.timeInMs;

      /* Create a GUI canvas */
      scene.initialGui = scene.stateManager.addGuiCanvas

      /* ======= Debug mode ======= */
      ();if (typeof window.DEBUG_MODE_ONE !== 'undefined' && window.DEBUG_MODE_ONE === true) {}
      // canvas.createCanvasProfileInfoCanvas()


      /* ======== Scene Lifecycle ======== */

      /* --- Resize handler --- */
      var updateContentFrame = function updateContentFrame() {
        var _this5 = this;

        // this refers to the scene here
        if (customSized) {
          this.initialCanvas.resizeAt = this.parentTaskObject.timeInMs + 1000;
          (0, _utilities.delay)(1000).then(function () {
            if (_this5.parentTaskObject.timeInMs - _this5.initialCanvas.lastResize > 100 && _this5.initialCanvas.resizeAt < _this5.parentTaskObject.timeInMs) {
              // ((this.parentTaskObject.renderSize.width / 2) - (this.initialCanvas.size.width / 2), (this.parentTaskObject.renderSize.height / 2) - (this.initialCanvas.size.height / 2))
              _this5.initialCanvas.lastResize = _this5.parentTaskObject.timeInMs;

              var _getCanvasDimensions2 = getCanvasDimensions(),
                  _customSized = _getCanvasDimensions2.size;

              (0, _utilities.debugWarn)('scene.updateContentFrame: window has been resized ', _customSized);
              _this5.initialCanvas.size = _customSized;

              // check if the user has defined custom resize functions
              if (typeof _this5.onResize !== 'undefined' && _this5.onResize !== null) {
                if (_this5.onResize.constructor === Function) {
                  _this5.onResize = [_this5.onResize];
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = _this5.onResize[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var f = _step.value;

                    if (f.constructor !== Function) continue;
                    f.bind(_this5.parentTaskObject.context)();
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              }
            }
          });
        }
      };

      scene.updateContentFrame = updateContentFrame;

      /**
       * Custom resize functions called by updateContentFrame. Can be set by the user
       * to perform scene updates on resize. Can be an array of function or a single function.
       * @type {!function|array}
       */
      scene.onResize = null;

      /* Scene update */
      scene.registerBeforeRender(function () {
        scene.stateManager.update();
      });

      return scene;
    }

    /* ======= dataManager ======= */

  }, {
    key: 'setConnection',
    value: function setConnection() {
      var _this6 = this;

      var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (!this.dataManager) {
        throw new Error('StateManager.setCheckpoint: no dataManager');
      }

      return this.dataManager.setConnection(variables).then(function (connection) {
        _this6.connection = connection;
        return connection;
      }).catch(function (error) {
        (0, _utilities.debugError)(error);
      });
    }
  }, {
    key: 'setCheckpoint',
    value: function setCheckpoint() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      // store the whole object in the db ? ... probably not or.. ? it might be a great idea
      // we need to save the current state name, the non object globals,
      // and the events in store, we also have to store the state globals
      // to restore we load the past state.. .hm might be too complicated

      if (!this.dataManager) {
        throw new Error('StateManager.setCheckpoint: no dataManager');
      }

      return this.dataManager.addRows('checkpoints', { code: code, happenedAt: this.timeInMs, message: message });
    }
  }, {
    key: 'getCheckpoint',
    value: function getCheckpoint() {
      if (!this.dataManager) {
        throw new Error('StateManager.getCheckpoint: no dataManager');
      }

      return this.dataManager.query('getCheckpoint', {}, this.connection);
    }

    /* ======= Context ======= */

  }, {
    key: 'getContext',
    value: function getContext(object) {
      var scene = typeof this.currentSceneObject !== 'undefined' ? this.currentSceneObject : null;
      var stateManager = scene !== null && typeof scene.stateManager !== 'undefined' ? scene.stateManager : null;
      var state = stateManager !== null && typeof stateManager.currentState !== 'undefined' ? this.currentSceneObject.stateManager.currentState : null;

      var baseContext = {
        taskObject: this,
        dataManager: typeof this.dataManager !== 'undefined' ? this.dataManager : null,
        scene: scene,
        stateManager: stateManager,
        state: state,
        connection: this.connection,
        R: this.R
      };

      if (typeof object === 'undefined') {
        return baseContext;
      }
      var extendWith = {};
      switch (object.constructor) {
        case _experimentBabylonJs2.default.Scene:
          extendWith = {
            scene: object,
            stateManager: object.stateManager,
            state: object.stateManager.currentState
          };
          break;
        case _StateManager2.default:
          extendWith = {
            scene: object._parent,
            stateManager: object,
            state: object.currentState
          };
          break;
        case _State2.default:
          extendWith = {
            scene: object._parent,
            stateManager: object._stateManager,
            state: object
          };
          break;
        default:
          (0, _utilities.debugWarn)('TaskObject.getContext: object is not of valid class. Returning taskObject context.');
          return baseContext;
      }

      return _lodash2.default.extend(baseContext, extendWith);
    }
  }, {
    key: 'toggleDebugLayer',
    value: function toggleDebugLayer() {
      var scene = this.currentSceneObject;
      this.shouldShowDebug = !this.shouldShowDebug;

      if (typeof scene !== 'undefined') {
        if (this.shouldShowDebug) {
          this.scenes[this._currentSceneKey].debugLayer.show();

          if (typeof this.scenes[this._currentSceneKey].initialCanvas !== 'undefined') {
            this.scenes[this._currentSceneKey].initialCanvas.createCanvasProfileInfoCanvas();
          }
        } else {
          this.scenes[this._currentSceneKey].debugLayer.hide();

          if (typeof this.scenes[this._currentSceneKey].initialCanvas !== 'undefined' && this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas !== null) {
            this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas.dispose();
            this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas = null;
          }
        }
      } else {
        console.error('taskObject.toggleDebugLayer: currentSceneObject is undefined');
      }
    }
  }, {
    key: 'modal',


    /* =============== Utility Functions =============== */

    /**
     * modal - Creates a new information modal with specified data.
     *
     * @param {!object} options
     *
     * @returns {type} Description
     */
    value: function modal(_ref) {
      var _ref$type = _ref.type,
          type = _ref$type === undefined ? 'centralLarge' : _ref$type,
          _ref$title = _ref.title,
          title = _ref$title === undefined ? '' : _ref$title,
          _ref$content = _ref.content,
          content = _ref$content === undefined ? '' : _ref$content,
          _ref$event = _ref.event,
          event = _ref$event === undefined ? new _EventData2.default(this.R.get.events_modalDismissed) : _ref$event;

      this.dismissModal();
      this.currentModal = { data: { type: type, title: title, content: content, event: event } };
      var deferred = new _utilities.Deferred();

      this.currentModal.deferred = deferred;

      var modalBox = new _experimentBoxes.SmartModal(type, function dismissed() {
        if (event.constructor === _EventData2.default && this.stateManager !== null) {
          event.happenedAt = this.stateManager.timeInMs;
          this.stateManager.addEvent(event);
        }

        this.taskObject.currentModal.deferred.resolve('Modal closed.');
        this.taskObject.currentModal = null;
      }.bind(this.context));

      modalBox.title = title;
      modalBox.content = content;

      this.currentModal.modalBox = modalBox;
      return deferred.promise;
    }
  }, {
    key: 'dismissModal',
    value: function dismissModal() {
      if (this.currentModal !== null && (0, _utilities.hasConstructor)(_experimentBoxes.SmartModal, this.currentModal.modalBox)) {
        this.currentModal.modalBox.callThenDestroy();
        this.currentModal = null;
      }
    }

    /* === Animation helpers === */

  }, {
    key: 'animateFloat',
    value: function animateFloat(object, property, from, to) {
      var keys = [{
        frame: 0,
        value: from
      }, {
        frame: 100,
        value: to
      }];

      var animation = new _experimentBabylonJs2.default.Animation('animation', property, 100, _experimentBabylonJs2.default.Animation.ANIMATIONTYPE_FLOAT, _experimentBabylonJs2.default.Animation.ANIMATIONLOOPMODE_CONSTANT);
      animation.setKeys(keys);

      this.currentSceneObject.stopAnimation(object);
      object.animations.push(animation);
      object._scene.beginAnimation(object, 0, 100, false, 1, function () {});
    }
  }, {
    key: 'animateVector3',
    value: function animateVector3(object, property, from, to) {
      var frameTotal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 24;

      var keys = [{
        frame: 0,
        value: from
      }, {
        frame: frameTotal,
        value: to
      }];

      var animation = new _experimentBabylonJs2.default.Animation('animation', property, 24, _experimentBabylonJs2.default.Animation.ANIMATIONTYPE_VECTOR3, _experimentBabylonJs2.default.Animation.ANIMATIONLOOPMODE_CONSTANT);
      animation.setKeys(keys);

      this.currentSceneObject.stopAnimation(object);

      object.animations.push(animation);
    }
  }, {
    key: 'animateColor3',
    value: function animateColor3(object, property, from, to) {
      var keys = [{
        frame: 0,
        value: from
      }, {
        frame: 24,
        value: to
      }];

      var animation = new _experimentBabylonJs2.default.Animation('animation', property, 12, _experimentBabylonJs2.default.Animation.ANIMATIONTYPE_COLOR3, _experimentBabylonJs2.default.Animation.ANIMATIONLOOPMODE_CONSTANT);
      animation.setKeys(keys);

      object._scene.stopAnimation(object);

      object.animations.push(animation);
    }
  }, {
    key: 'animateMainCameraRotation',
    value: function animateMainCameraRotation(toAlpha, toBeta, scene) {
      // Alpha is the rotation angle around Y axis = azimuth
      // Beta is the rotation angle around X axis = inclinaison
      scene = this.scenes[this.currentScene];
      var animCamAlpha = new _experimentBabylonJs2.default.Animation('animCam', 'alpha', 60, _experimentBabylonJs2.default.Animation.ANIMATIONTYPE_FLOAT, _experimentBabylonJs2.default.Animation.ANIMATIONLOOPMODE_CONSTANT);
      var camera = scene.activeCamera;
      var keysAlpha = [];

      if (TaskObject.overPI(camera.alpha, toAlpha)) {
        keysAlpha.push({
          frame: 0,
          value: camera.alpha
        });

        console.log(camera.alpha);
        console.log(toAlpha);

        var firstStop = -Math.PI;
        var secondStop = Math.PI;

        if (camera.alpha > 0) {
          firstStop = Math.PI;
          secondStop = -Math.PI;
        }

        keysAlpha.push({
          frame: 50,
          value: firstStop
        });
        keysAlpha.push({
          frame: 51,
          value: secondStop
        });
        keysAlpha.push({
          frame: 100,
          value: toAlpha
        });
      } else {
        keysAlpha.push({
          frame: 0,
          value: camera.alpha
        });
        keysAlpha.push({
          frame: 100,
          value: toAlpha
        });
      }

      var animCamBeta = new _experimentBabylonJs2.default.Animation('animCam', 'beta', 60, _experimentBabylonJs2.default.Animation.ANIMATIONTYPE_FLOAT, _experimentBabylonJs2.default.Animation.ANIMATIONLOOPMODE_CONSTANT);

      var keysBeta = [];
      keysBeta.push({
        frame: 0,
        value: camera.beta
      });
      keysBeta.push({
        frame: 100,
        value: toBeta
      });

      animCamAlpha.setKeys(keysAlpha);
      animCamBeta.setKeys(keysBeta);

      camera.animations.push(animCamAlpha);
      camera.animations.push(animCamBeta);

      scene.beginAnimation(camera, 0, 100, false, 1, function () {});
    }

    /* === Particule system === */
    /**
     * Add a custom particule system to the specified mesh.
     * @param {BABYLON.Mesh} mesh    Mesh on which to add the particule system
     * @param {Object} options Option object, default properties are as follows :
     *                         name: "particle" + mesh.name,
     *                         capacity: 2000,
     *                         texture: this.ASSETS_FLARE_PATH,
     *                         minEmitBox: null,
     *                         maxEmitBox: null,
     *                         color1: new BABYLON.Color4(0.7, 0.8, 1.0, 1.0),
     *                         color2: new BABYLON.Color4(0.2, 0.5, 1.0, 1.0),
     *                         colorDead: new BABYLON.Color4(0, 0, 0.2, 0.0),
     *                         minSize: 0.1,
     *                         maxSize: 0.5,
     *                         minLifeTime: 0.3,
     *                         maxLifeTime: 0.8,
     *                         emitRate: 150,
     *                         blendMode: BABYLON.ParticleSystem.BLENDMODE_ONEONE,
     *                         gravity: new BABYLON.Vector3(0, 9.81, 0), //upwards
     *                         direction1: new BABYLON.Vector3(-5, -1, 3),
     *                         direction2: new BABYLON.Vector3(5, 1, -3),
     *                         minAngularSpeed: 0,
     *                         maxAngularSpeed: 2 * Math.PI,
     *                         minEmitPower: 0.1,
     *                         maxEmitPower: 0.1,
     *                         updateSpeed: 0.01,
     *                         startIt: false
     */

  }, {
    key: 'addParticuleSystemTo',
    value: function addParticuleSystemTo() {
      var mesh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof mesh._scene === 'undefined') {
        throw new Error('addParticuleSystemTo: mesh _scene is undefined.');
      }

      var scene = mesh._scene;

      // option base
      var optionsBase = {
        name: 'particle' + mesh.name,
        capacity: 2000,
        texture: this.ASSETS_FLARE_PATH,
        minEmitBox: null,
        maxEmitBox: null,
        color1: new _experimentBabylonJs2.default.Color4(0.7, 0.8, 1, 1),
        color2: new _experimentBabylonJs2.default.Color4(0.2, 0.5, 1, 1),
        colorDead: new _experimentBabylonJs2.default.Color4(0, 0, 0.2, 0),
        minSize: 0.1,
        maxSize: 0.5,
        minLifeTime: 0.3,
        maxLifeTime: 0.8,
        emitRate: 150,
        blendMode: _experimentBabylonJs2.default.ParticleSystem.BLENDMODE_ONEONE,
        gravity: new _experimentBabylonJs2.default.Vector3(0, 9.81, 0),
        // upwards
        direction1: new _experimentBabylonJs2.default.Vector3(-5, -1, 3),
        direction2: new _experimentBabylonJs2.default.Vector3(5, 1, -3),
        minAngularSpeed: 0,
        maxAngularSpeed: 2 * Math.PI,
        minEmitPower: 0.1,
        maxEmitPower: 0.1,
        updateSpeed: 0.01,
        startIt: false

        // extend base options with specified options
      };options = _lodash2.default.extend(optionsBase, options

      // Create a particle system
      );var particleSystem = new _experimentBabylonJs2.default.ParticleSystem('particles', options.capacity, scene);

      // Texture of each particle
      particleSystem.particleTexture = new _experimentBabylonJs2.default.Texture(options.texture, scene);

      // Where the particles come from
      particleSystem.emitter = mesh;
      // the starting object, the emitter
      if (options.minEmitBox !== null) {
        particleSystem.minEmitBox = options.minEmitBox; // Starting all from
      }

      if (options.maxEmitBox !== null) {
        particleSystem.maxEmitBox = options.maxEmitBox; // To...
      }

      // Colors of all particles
      particleSystem.color1 = options.color1;
      particleSystem.color2 = options.color2;
      particleSystem.colorDead = options.colorDead;

      // Size of each particle (random between...
      particleSystem.minSize = options.minSize;
      particleSystem.maxSize = options.maxSize;

      // Life time of each particle (random between...
      particleSystem.minLifeTime = options.minLifeTime;
      particleSystem.maxLifeTime = options.maxLifeTime;

      // Emission rate
      particleSystem.emitRate = options.emitRate;

      // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
      particleSystem.blendMode = options.blendMode;

      // Set the gravity of all particles
      particleSystem.gravity = options.gravity;

      // Direction of each particle after it has been emitted
      particleSystem.direction1 = options.direction1;
      particleSystem.direction2 = options.direction2;

      // Angular speed, in radians
      particleSystem.minAngularSpeed = options.minAngularSpeed;
      particleSystem.maxAngularSpeed = options.maxAngularSpeed;

      // Speed
      particleSystem.minEmitPower = options.minEmitPower;
      particleSystem.maxEmitPower = options.maxEmitPower;
      particleSystem.updateSpeed = options.updateSpeed;

      // Start the particle system
      if (options.startIt) {
        particleSystem.start();
      }

      return particleSystem;
    }

    /* ======== Static functions ======== */
    /* === Angle functions === */

  }, {
    key: 'context',
    get: function get() {
      return this.getContext();
    }

    /* =============== Getters and Setters =============== */
    /* ======== Property definitions for JSDOC ======== */
    /**
     * Key string of the current scene - should not be null but an empty string on startup
     * @return {string} sceneKey in the scenes object
     */

  }, {
    key: 'currentScene',


    /* ======== Getter/Setter definitions ======== */
    get: function get() {
      return this._currentSceneKey;
    },
    set: function set(sceneKey) {
      if (Object.keys(this.scenes).indexOf(sceneKey) !== -1) {
        if (this._currentSceneKey) {
          this.scenes[this._currentSceneKey].stateManager.goToState(this.R.get.states_idle

          /* ======= Debug mode ======= */
          );if (typeof window.DEBUG_MODE_ONE !== 'undefined' && window.DEBUG_MODE_ONE === true) {
            this.scenes[this._currentSceneKey].debugLayer.hide();

            if (typeof this.scenes[this._currentSceneKey].initialCanvas !== 'undefined' && this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas !== null) {
              // this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas.dispose()
              // this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas = null
            }
          }
        }

        this._currentSceneKey = sceneKey;

        this.scenes[sceneKey].stateManager.goToState(this.R.get.states_active

        /* ======= Debug mode ======= */
        );if (typeof window.DEBUG_MODE_ONE !== 'undefined' && window.DEBUG_MODE_ONE === true && this.shouldShowDebug) {
          this.scenes[sceneKey].debugLayer.show();

          if (typeof this.scenes[sceneKey].initialCanvas !== 'undefined') {
            // this.scenes[sceneKey].initialCanvas.createCanvasProfileInfoCanvas()
          }
        }

        (0, _utilities.debuglog)('TaskObject.currentScene: changed to ' + sceneKey);
      } else if (sceneKey === null || sceneKey === '') {
        this._currentSceneKey = '';
      } else {
        console.error('TaskObject.currentScene: Invalid sceneKey.');
      }
    }
  }, {
    key: 'currentSceneObject',
    get: function get() {
      return this.scenes[this._currentSceneKey];
    },
    set: function set(sceneObject) {
      if (_lodash2.default.has(sceneObject, 'sceneKey')) {
        this.currentScene = sceneObject.sceneKey;
      } else {
        throw new Error('Specified scene has no sceneKey');
      }
    }
  }, {
    key: 'time',
    get: function get() {
      return this.timeInMs;
    }
  }, {
    key: 'timeInSec',
    get: function get() {
      return new Date().getTime() / 1000;
    }
  }, {
    key: 'timeInMs',
    get: function get() {
      return new Date().getTime();
    }
  }, {
    key: 'paramBox',
    get: function get() {
      return this._paramBox;
    },
    set: function set(paramBox) {
      if (this._paramBox) {
        this._paramBox.delete();
      }
      this._paramBox = paramBox;
    }
  }, {
    key: 'renderSize',
    get: function get() {
      return new _experimentBabylonJs2.default.Size(this.engine.getRenderWidth(), this.engine.getRenderHeight());
    },
    set: function set() {
      var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      switch (size.constructor) {
        case _utilities.String:
          this.canvas.width = size;
          this.canvas.height = size;
          break;
        case _experimentBabylonJs2.default.Size:
          this.canvas.width = size.width + 'px';
          this.canvas.height = size.height + 'px';
          break;
        case _utilities.Array:
          if (size.length === 2) {
            this.canvas.width = size[0];
            this.canvas.height = size[1];
          } else {
            throw new Error('TaskObject.renderSize: set with invalid size array, array lenght has to be === 2.');
          }
          break;
        default:
          throw new Error('TaskObject.renderSize: set with invalid size array, array lenght has to be === 2.');
      }
    }
  }], [{
    key: 'default2dSceneGenerator',
    value: function default2dSceneGenerator(options) {
      /* --- Get the taskObject instance from binded context --- */
      var taskObject = this.taskObject;

      var optionsBase = {
        canvasBackground: new _experimentBabylonJs2.default.Color4(1, 1, 1, 1),
        backgroundRoundRadius: 0,
        clearColor: new _experimentBabylonJs2.default.Color4(1, 1, 1, 1),
        canvasPercentWidth: 1,
        canvasPercentHeight: 1,
        mode: 'central',
        level: null,
        shouldLoadAssets: false
      };

      options = _lodash2.default.extend(optionsBase, options

      /* --- Create a basic 2D scene using a Canvas2D as background --- */
      );var scene = taskObject.create2DScene(options

      /* --- Load assets --- */
      );var assetObject = {
        logo: {
          path: '/assets/experiment-js.svg',
          type: 'texture'
        }

        // Will load all the assets contained in the task assetsToLoad variable
      };if (options.shouldLoadAssets) {
        assetObject = _lodash2.default.extend(assetObject, taskObject.assetsToLoad);
      }

      // add content loaded text
      scene.loadingPromise = taskObject.loadAssets(assetObject, scene).then(function () {
        var canvas = scene.initialCanvas;

        var texture = taskObject.R.get.textures_logo;
        texture.hasAlpha = true;

        var height = _experimentMathjs2.default.max(taskObject.renderSize.height * 0.05, 45);
        new _experimentBabylonJs2.default.Sprite2D(texture, { // eslint-disable-line
          parent: canvas,
          id: 'logo',
          marginAlignment: 'h: center, v:center',
          size: new _experimentBabylonJs2.default.Size(height * 3000 / 730, height),
          origin: _experimentBabylonJs2.default.Vector2.Zero()
        });
      });

      return scene;
    }
  }, {
    key: 'borderPI',
    value: function borderPI(radians) {
      var offset = Math.PI;
      radians += offset;
      var sign = Math.sign(radians);
      return radians - sign * Math.floor(Math.abs(radians) / (2 * Math.PI)) * (2 * Math.PI) - offset;
    }
  }, {
    key: 'checkForCloserSignedAngle',
    value: function checkForCloserSignedAngle(baseAngle, checkedAngle) {
      checkedAngle = TaskObject.borderPI(checkedAngle);
      console.log(checkedAngle);
      console.log('baseAngle:' + baseAngle);
      var sign = Math.sign(checkedAngle);

      if (checkedAngle === 0) {
        sign = Math.sign(baseAngle);
      }
      var signedAngle = checkedAngle - sign * (2 * Math.PI);
      console.log('signedAngle:' + signedAngle);
      var currentAngleArc = Math.abs(baseAngle - checkedAngle);
      var signedAngleArc = Math.abs(baseAngle - signedAngle);

      return currentAngleArc <= signedAngleArc ? checkedAngle : signedAngle;
    }
  }, {
    key: 'overPI',
    value: function overPI(angleA, angleB) {
      return Math.abs(angleA - angleB) > Math.PI;
    }

    /* === Sound function === */
    /**
     * fadeOut - Performs a fadeOut of a BABYLON.Sound recursively. When the decrement
     * become smaller than step/10, decrement is fixed at step/10.
     *
     * @param {BABYLON.Sound}      sound                        a sound to fade out and stop
     * @param {object}    options                      second argument holds options
     * @param {?Number}   [options.currentVolume=null] start volume for the fadeout
     * @param {number}    [options.step=0.02]          decrement step such as volume -= step * volume
     * @param {number}    [options.threshold=0.02]     threshold at which the sound is stopped
     * @param {number}    [options.delayInMs=50]       duration of each recursion
     * @param {boolean}   [options.pause=false]        if setto true the sound is pauses, if false, it is stopped
     *
     * @returns {undefined}
     */

  }, {
    key: 'fadeOut',
    value: function fadeOut(sound) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$currentVolume = _ref2.currentVolume,
          currentVolume = _ref2$currentVolume === undefined ? null : _ref2$currentVolume,
          _ref2$step = _ref2.step,
          step = _ref2$step === undefined ? 0.02 : _ref2$step,
          _ref2$threshold = _ref2.threshold,
          threshold = _ref2$threshold === undefined ? 0.02 : _ref2$threshold,
          _ref2$delayInMs = _ref2.delayInMs,
          delayInMs = _ref2$delayInMs === undefined ? 50 : _ref2$delayInMs,
          _ref2$pause = _ref2.pause,
          pause = _ref2$pause === undefined ? false : _ref2$pause;

      (0, _utilities.mustHaveConstructor)(_experimentBabylonJs2.default.Sound, sound);

      if (currentVolume === null) {
        currentVolume = sound.getVolume();
      }
      (0, _utilities.mustHaveConstructor)(Number, currentVolume, step, threshold);

      currentVolume = currentVolume.boundTo(0, 1);
      step = step.boundTo(0, 1);

      var decrement = step * currentVolume;
      if (decrement < step / 10) {
        decrement = step / 10;
      }
      currentVolume -= decrement;
      if (currentVolume > threshold) {
        (0, _utilities.debuglog)('fadeOut.currentVolume:' + currentVolume);
        sound.setVolume(currentVolume);
        (0, _utilities.delay)(delayInMs).then(function () {
          return TaskObject.fadeOut(sound, { currentVolume: currentVolume, step: step, threshold: threshold, delayInMs: delayInMs, pause: pause });
        });
      } else if (pause) {
        (0, _utilities.debuglog)('fadeOut:  pause');
        sound.pause();
      } else {
        (0, _utilities.debuglog)('fadeOut:  stop');
        sound.stop();
      }
    }

    /**
     * Returns an array filled with len elements of value
     * @param  {object} value any value
     * @param  {number} len   number of element repeated
     * @return {array}
     */

  }, {
    key: 'fillArray',
    value: function fillArray(value, len) {
      var a = [];
      for (var i = 1; i <= len; i++) {
        a.push(value);
      }
      return a;
    }

    /**
     * Transform spherical coordinate to euclidian coordinate taking y as the height axis and z the depth axis.
     * Inclination is calculated from the y axis and azimuth from the z axis. Supposing both system have the same origin.
     * https://en.wikipedia.org/wiki/Spherical_coordinate_system
     * @param  {number} r           radius
     * @param  {number} inclination inclination from y in radian
     * @param  {number} azimuth     Azimuthal angle
     * @return {BABYLON.Vector3}    Euclidian coordinate
     */

  }, {
    key: 'sphericalToEuclidian',
    value: function sphericalToEuclidian(r, inclination, azimuth) {
      var z = r * Math.sin(inclination) * Math.cos(azimuth);
      var x = r * Math.sin(inclination) * Math.sin(azimuth);
      var y = r * Math.cos(inclination);

      return new _experimentBabylonJs2.default.Vector3(x, y, z);
    }

    /**
     * Get random number between min and max.
     * @param  {Number} min
     * @param  {Number} max
     * @return {Number}
     */

  }, {
    key: 'getRandomArbitrary',
    value: function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
  }, {
    key: 'getRandomElement',
    value: function getRandomElement() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (array.constructor === _utilities.Array) {
        return array[Math.round(TaskObject.getRandomArbitrary(0, array.length - 1))];
      }
      throw new Error('TaskObject: argument is not of type array.');
    }
  }, {
    key: 'currentScene',
    get: function get() {} /**/

    /**
     * The current babylon scene object
     * @return {BABYLON.Scene}
     */

  }, {
    key: 'currentSceneObject',
    get: function get() {} /**/

    /**
     * ParamBox object linked to the task object.
     * @return {ParamBox}
     */

  }, {
    key: 'paramBox',
    get: function get() {/**/}
  }, {
    key: 'renderSize',
    get: function get() {} /**/
  }]);

  return TaskObject;
}();

exports.default = TaskObject;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentBabylonJs = __webpack_require__(7);

var _experimentBabylonJs2 = _interopRequireDefault(_experimentBabylonJs);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loader = function (_BABYLON$Rectangle2D) {
  _inherits(Loader, _BABYLON$Rectangle2D);

  function Loader(options) {
    _classCallCheck(this, Loader);

    var baseOptions = {
      id: 'loader',
      parent: null,
      roundRadius: 0,
      size: new _experimentBabylonJs2.default.Size(20, 20),
      borderThickness: 1,
      border: _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(new _experimentBabylonJs2.default.Color4(1, 1, 1, 1)),
      fill: null,
      marginAlignment: 'h: center, v: center',
      zOrder: 0.01,
      value: 0
    };

    options = _lodash2.default.extend(baseOptions, options);

    // let borderThickness = options.borderThickness
    // if (options.marginAlignment === null) {
    var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this, options));

    var borderThickness = options.borderThickness + 2;
    // }

    // create masks
    var fill = _experimentBabylonJs2.default.Canvas2D.GetSolidColorBrush(new _experimentBabylonJs2.default.Color4(0, 0, 0, 1));
    var masks = {};
    masks.bottom = new _experimentBabylonJs2.default.Rectangle2D({
      parent: _this,
      id: 'loaderMaskBottom',
      marginAlignment: 'h: center, v: center',
      size: new _experimentBabylonJs2.default.Size(options.size.width, borderThickness),
      fill: fill,
      zOrder: 0.001
    });
    masks.right = new _experimentBabylonJs2.default.Rectangle2D({
      parent: _this,
      id: 'loaderMaskRight',
      marginAlignment: 'h: center, v: center',
      size: new _experimentBabylonJs2.default.Size(borderThickness, options.size.height),
      fill: fill,
      zOrder: 0.002
    });
    masks.top = new _experimentBabylonJs2.default.Rectangle2D({
      parent: _this,
      id: 'loaderMaskTop',
      marginAlignment: 'h: center, v: center',
      size: new _experimentBabylonJs2.default.Size(options.size.width, borderThickness),
      fill: fill,
      zOrder: 0.003
    });
    masks.left = new _experimentBabylonJs2.default.Rectangle2D({
      parent: _this,
      id: 'loaderMaskLeft',
      marginAlignment: 'h: center, v: center',
      size: new _experimentBabylonJs2.default.Size(borderThickness, options.size.height),
      fill: fill,
      zOrder: 0.004
    });

    _this.masks = masks;

    _this._value = options.value;
    _this.updateMasks();
    return _this;
  }

  _createClass(Loader, [{
    key: 'updateMasks',
    value: function updateMasks() {
      var value = this.value;
      if (value < 25) {
        this.masks.bottom.width = (25 - value) * (this.size.width / 25);

        var offset = this.size.width - this.masks.bottom.width; // (12.5 - value) * (this.size.width / (2 * 12.5))
        this.masks.bottom.margin.rightPixels = 0;
        this.masks.bottom.margin.leftPixels = offset / 2;
        this.masks.bottom.margin.topPixels = this.size.height / 2 - this.borderThickness / 2;
        this.masks.bottom.margin.bottomPixels = 0;
        this.masks.bottom.levelVisible = true;
      } else {
        this.masks.bottom.levelVisible = false;
      }

      if (value < 50) {
        var height = value >= 25 ? (50 - value) * (this.size.height / 25) : this.size.height;
        this.masks.right.height = height;
        var _offset = this.size.height - height;

        this.masks.right.margin.rightPixels = 0;
        this.masks.right.margin.leftPixels = this.size.width / 2 - this.borderThickness / 2;
        this.masks.right.margin.topPixels = 0;
        this.masks.right.margin.bottomPixels = _offset / 2;

        this.masks.right.levelVisible = true;
      } else {
        this.masks.right.levelVisible = false;
      }

      if (value < 75) {
        var width = value >= 50 ? (75 - value) * (this.size.width / 25) : this.size.width;

        this.masks.top.width = width;
        var _offset2 = this.size.width - width + this.borderThickness;

        this.masks.top.margin.rightPixels = _offset2 / 2;
        this.masks.top.margin.leftPixels = 0;
        this.masks.top.margin.topPixels = 0;
        this.masks.top.margin.bottomPixels = this.size.height / 2 - this.borderThickness / 2;

        this.masks.top.levelVisible = true;
      } else {
        this.masks.top.levelVisible = false;
      }

      if (value < 100) {
        var _height = value >= 75 ? (100 - value) * (this.size.height / 25) : this.size.height;

        this.masks.left.height = _height;
        var _offset3 = this.size.height - _height + this.borderThickness;

        this.masks.left.margin.rightPixels = this.size.width / 2 - this.borderThickness / 2;
        this.masks.left.margin.leftPixels = 0;
        this.masks.left.margin.topPixels = _offset3 / 2;
        this.masks.left.margin.bottomPixels = 0;

        this.masks.left.levelVisible = true;
      } else {
        this.masks.left.levelVisible = false;
      }
    }
  }, {
    key: 'value',
    set: function set() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if ((0, _utilities.hasConstructor)(_utilities.Number, val)) {
        val = val.boundTo(0, 100);
        this._value = val;
        this.updateMasks();
      } else {
        (0, _utilities.debugError)('Loader.value: invalid value');
      }
    },
    get: function get() {
      return this._value;
    }
  }]);

  return Loader;
}(_experimentBabylonJs2.default.Rectangle2D);

exports.default = Loader;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loader = exports.preloadImages = exports.hasConstructor = exports.scaleSize = exports.sizeToVec = exports.spreadToObject = exports.noop = exports.debugError = exports.debugWarn = exports.debuglog = exports.mandatory = exports.mustBeDefined = exports.mustHaveConstructor = exports.looksLikeAPromise = exports.delay = exports.jitter = exports.recurse = exports.Deferred = exports.rep = exports.samplePermutation = exports.matrix = exports.getRow = exports.rowSum = exports.diag = exports.Set = exports.Number = exports.String = exports.Array = exports.RessourceManager = exports.DataManager = exports.EventData = exports.State = exports.StateManager = exports.TaskObject = undefined;

var _TaskObject = __webpack_require__(14);

var _TaskObject2 = _interopRequireDefault(_TaskObject);

var _StateManager = __webpack_require__(9);

var _StateManager2 = _interopRequireDefault(_StateManager);

var _State = __webpack_require__(6);

var _State2 = _interopRequireDefault(_State);

var _EventData = __webpack_require__(3);

var _EventData2 = _interopRequireDefault(_EventData);

var _DataManager = __webpack_require__(4);

var _DataManager2 = _interopRequireDefault(_DataManager);

var _RessourceManager = __webpack_require__(5);

var _RessourceManager2 = _interopRequireDefault(_RessourceManager);

var _Loader = __webpack_require__(15);

var _Loader2 = _interopRequireDefault(_Loader);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* add it to the global space in case user want to import in a script tag */
/**
 * Experiment.js
 * Created. 2016
 *
 * Experiment.js toolbox.
 *
 * Authors. Albert Buchard
 *
 * Requires: lodash, BABYLON.js, mathjs, jQuery
 *
 * LICENSE Apache-2
 */

/* --- Import the framwork --- */
if (typeof window !== 'undefined') {
  window.TaskObject = _TaskObject2.default;
  window.StateManager = _StateManager2.default;
  window.State = _State2.default;
  window.EventData = _EventData2.default;
  window.DataManager = _DataManager2.default;
  window.RessourceManager = _RessourceManager2.default;
  window.jitter = _utilities.jitter;
  window.delay = _utilities.delay;
  window.Deferred = _utilities.Deferred;
}

exports.TaskObject = _TaskObject2.default;
exports.StateManager = _StateManager2.default;
exports.State = _State2.default;
exports.EventData = _EventData2.default;
exports.DataManager = _DataManager2.default;
exports.RessourceManager = _RessourceManager2.default;
exports.Array = _utilities.Array;
exports.String = _utilities.String;
exports.Number = _utilities.Number;
exports.Set = _utilities.Set;
exports.diag = _utilities.diag;
exports.rowSum = _utilities.rowSum;
exports.getRow = _utilities.getRow;
exports.matrix = _utilities.matrix;
exports.samplePermutation = _utilities.samplePermutation;
exports.rep = _utilities.rep;
exports.Deferred = _utilities.Deferred;
exports.recurse = _utilities.recurse;
exports.jitter = _utilities.jitter;
exports.delay = _utilities.delay;
exports.looksLikeAPromise = _utilities.looksLikeAPromise;
exports.mustHaveConstructor = _utilities.mustHaveConstructor;
exports.mustBeDefined = _utilities.mustBeDefined;
exports.mandatory = _utilities.mandatory;
exports.debuglog = _utilities.debuglog;
exports.debugWarn = _utilities.debugWarn;
exports.debugError = _utilities.debugError;
exports.noop = _utilities.noop;
exports.spreadToObject = _utilities.spreadToObject;
exports.sizeToVec = _utilities.sizeToVec;
exports.scaleSize = _utilities.scaleSize;
exports.hasConstructor = _utilities.hasConstructor;
exports.preloadImages = _utilities.preloadImages;
exports.Loader = _Loader2.default;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEBUG_MODE_ON = true;

exports.DEBUG_MODE_ON = DEBUG_MODE_ON;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(10)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(18);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ })
/******/ ]);
});
//# sourceMappingURL=experiment.max.js.map