(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("experiment-babylon-js"), require("experiment-boxes"), require("experiment-mathjs"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define("experiment", ["lodash", "experiment-babylon-js", "experiment-boxes", "experiment-mathjs", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["experiment"] = factory(require("lodash"), require("experiment-babylon-js"), require("experiment-boxes"), require("experiment-mathjs"), require("jquery"));
	else
		root["experiment"] = factory(root["lodash"], root["experiment-babylon-js"], root["experiment-boxes"], root["experiment-mathjs"], root["jquery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = exports.debugError = exports.debugWarn = exports.debuglog = exports.mandatory = exports.mustBeDefined = exports.mustHaveConstructor = exports.looksLikeAPromise = exports.delay = exports.jitter = exports.recurse = exports.Deferred = exports.rep = exports.samplePermutation = exports.matrix = exports.getRow = exports.rowSum = exports.diag = exports.String = exports.Array = undefined;

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentMathjs = __webpack_require__(12);

var _experimentMathjs2 = _interopRequireDefault(_experimentMathjs);

var _config = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * noop - just your friendly empty function
 *
 * @returns {undefined}
 */
function noop() {}

/**
 * Debug functions
 */
/**
 * This file should contain utility functions that are independant of the task.
 *
 *
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
      throw new Error('Argument ' + i + ' is undefined.');
    }
  }

  return true;
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
  return new Promise(function (resolve) {
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

  return new Promise(function (resolve) {
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
    return new Promise(function (resolve) {
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
  this.resolve = null;

  /* A method to reject the assocaited Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param {anything} reason: The reason for the rejection of the Promise.
   * Generally its an Error object. If however a Promise is passed, then the Promise
   * itself will be the reason for rejection no matter the state of the Promise.
   */
  this.reject = null;

  /* A newly created Pomise object.
   * Initially in pending state.
   */
  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
  Object.freeze(this);
  // }
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
    if (this[i].constructor !== constructorObject) {
      return false;
    }
  }
  return true;
};

Array.prototype.includes = function includes(array) {
  // returns a bool wether all value of specified array are in current array
  for (var i = 0; i < array.length; i++) {
    if (this.indexOf(array[i]) === -1) {
      return false;
    }
  }
  return true;
};

exports.Array = Array;
exports.String = String;
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /** @module EventData */


/** Class storing all types of event to be handled by a StateManager*/
var EventData =
/**
 * Maybe make a class out of this...
 * @param {string} flag      flag describing the input type
 * @param {number} timeStamp real time of input
 */
function EventData() {
  var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)('flag');
  var timeStamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)('timeStamp');
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  _classCallCheck(this, EventData);

  this.flag = flag;
  this.happenedAt = timeStamp;

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

  var baseData = {
    belongsTo: 'globalLog', // could be an array of strings
    handledAt: null,
    storedAt: null
  };

  this.data = _lodash2.default.extend(baseData, data);
};

exports.default = EventData;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

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

    /* --- Data tables --- */
    /**
     * Object containing all the data tables
     * @type {Object}
     */
    this.dataTables = {};

    /**
     * dataTables.globalLog is the default data table that stores all events of the task with this format:
     * * id : string
     * * flag : string
     * * happenedAt : timeStamp
     * * data : object
     * @private
     */
    var globalLogFields = ['id', 'flag', 'happenedAt', 'data']; // in data object add "handledAt", "storedAt",
    this.addTable('globalLog', globalLogFields);

    /* --- REST API --- */
    /**
     * URL of the page to which data is sent to be stored.
     * Note: Login credentials can't be managed with frontend javascript and security should be integrated with the backend.
     * @type {string}
     */
    this.restURL = null;

    /** Determines wether the current environment is Node or the Browser */
    this.isNode = false;
    if (typeof module !== 'undefined' && module.exports) {
      this.isNode = true;
    }
  }

  /* ======== Data tables function ======== */
  /**
   * [addTable description]
   * @param {[type]} name   [description]
   * @param {[type]} fields [description]
   */


  _createClass(DataManager, [{
    key: 'addTable',
    value: function addTable() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      if (_lodash2.default.has(this.dataTables, name)) {
        throw new Error('DataManager: Data table with name \'' + name + '\' already exists');
      }

      /* --- Create the dataTable object and define the fields --- */
      this.dataTables[name] = {};
      for (var i = 0; i < fields.length; i++) {
        this.dataTables[name][fields[i]] = [];
      }

      if (_lodash2.default.indexOf(fields, 'id') === -1) {
        this.dataTables[name].id = [];
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
     * Adds a row to the specified data table. Can generate automatically ids if not present in the rows
     * @param {string} name name of the dataTable
     * @param {object} rows Object containing a property for each column of the specified data table. Those can be array but all must have the same length (adding the same number of rows for each columns of data).
     */

  }, {
    key: 'addRows',
    value: function addRows() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      if (this.isValidRows(name, rows)) {
        var columnNamesRows = _lodash2.default.keys(rows);
        var columnNamesDataTableWithoutId = _lodash2.default.without(_lodash2.default.keys(this.dataTables[name]), 'id');

        if (_lodash2.default.indexOf(columnNamesRows, 'id') === -1 && this.automaticID) {
          this.dataTables[name].id = this.dataTables[name].id.concat(this.generateIds(name, rows[columnNamesRows[0].length]));
        }

        for (var i = 0; i < columnNamesDataTableWithoutId.length; i++) {
          this.dataTables[name][columnNamesDataTableWithoutId[i]] = this.dataTables[name][columnNamesDataTableWithoutId[i]].concat(rows[columnNamesDataTableWithoutId[i]]);
        }

        var nrows = typeof rows.length === 'undefined' ? 1 : rows.length;
        (0, _utilities.debuglog)('DataManager: added ' + nrows + ' rows to ' + name + ' data table.');
      } else {
        throw new Error('DataManager: Row is of invalid format.');
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

      if (!_lodash2.default.has(this.dataTables, name)) {
        throw new Error('DataManager: Data table with name \'' + name + '\' does not exists');
      }

      if (!_lodash2.default.has(this.dataTables[name], 'id')) {
        throw new Error('DataManager: Data table with name \'' + name + '\' does not have an \'id\' field');
      }

      var startId = 0;
      if (this.dataTables[name].id.length !== 0) {
        startId = _lodash2.default.max(this.dataTables[name].id) + 1;
      }

      return _lodash2.default.range(startId, startId + numberOfIds);
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
        throw new Error('DataManager: Data table with name \'' + name + '\' does not exists');
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
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();
      var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utilities.mandatory)();

      if (!_lodash2.default.has(this.dataTables, name)) {
        throw new Error('DataManager: Data table with name \'' + name + '\' does not exists');
      }

      if ((typeof rows === 'undefined' ? 'undefined' : _typeof(rows)) !== 'object') {
        return false;
      }

      var columnNamesDataTable = _lodash2.default.keys(this.dataTables[name]);
      var columnNamesRows = _lodash2.default.keys(rows);
      var previousLenght = null;
      for (var i = 0; i < columnNamesDataTable.length; i++) {
        if (_lodash2.default.indexOf(columnNamesRows, columnNamesDataTable[i]) !== -1) {
          if (rows[columnNamesDataTable[i]].constructor === _utilities.Array) {
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
          (0, _utilities.debugError)('DataManager: Invalid row, does not contain column ' + columnNamesDataTable[i] + ' of dataTable' + name);
          return false;
        }
      }

      // add check for variable tpe inside the columns

      return true;
    }

    /* ======== Export formats ======== */

  }, {
    key: 'toCsv',
    value: function toCsv() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (!_lodash2.default.has(this.dataTables, name)) {
        throw new Error('DataManager: Data table with name \'' + name + '\' does not exists');
      }

      var columnNamesDataTable = _lodash2.default.keys(this.dataTables[name]);

      var lineArray = [];
      for (var i = 0; i < columnNamesDataTable[0].length; i++) {
        var row = [];
        for (var j = 0; j < columnNamesDataTable.length; j++) {
          row.push(columnNamesDataTable[j][i]);
        }
        var line = row.join(',');
        lineArray.push(i === 0 ? 'data:text/csv;charset=utf-8,' + line : line);
      }

      var csvContent = lineArray.join('\n');

      return csvContent;
    }
  }, {
    key: 'toDataArray',
    value: function toDataArray() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (!_lodash2.default.has(this.dataTables, name)) {
        throw new Error('DataManager: Data table with name \'' + name + '\' does not exists');
      }

      var columnNamesDataTable = _lodash2.default.keys(this.dataTables[name]);

      var dataArray = [];
      for (var i = 0; i < columnNamesDataTable.length; i++) {
        dataArray.push(columnNamesDataTable[i]);
      }

      return dataArray;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (name) {
        if (!_lodash2.default.has(this.dataTables, name)) {
          throw new Error('DataManager: Data table with name \'' + name + '\' does not exists');
        }

        JSON.stringify(this.dataTables[name]);
      } else {
        JSON.stringify(this.dataTables);
      }
    }
  }, {
    key: 'saveData',
    value: function saveData() {
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

    /* ======== Getters and setters ======== */

    /** The complete log since the creation of the DataManager  */

  }, {
    key: 'globalLog',
    get: function get() {
      return this._globalLog;
    },
    set: function set(value) {} // eslint-disable-line
    // readonly


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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /** @module RessourceManager */


var _jquery = __webpack_require__(13);

var _jquery2 = _interopRequireDefault(_jquery);

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
   *
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

      return Promise.all(promises);
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
        url: this.files[fileIndex].path
      }).then(function (response) {
        thisObject.files[fileIndex].loaded = true;
        thisObject.files[fileIndex].raw = response;

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
      }
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
      return filepath.substr((~-filepath.lastIndexOf('.') >>> 0) + 2); // eslint-disable-line
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/** @module State */


var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _EventData = __webpack_require__(2);

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
      /* --- If state was frozen unfreeze it but do not re-awake --- */
      if (this._frozenAt !== null) {
        this.unfreeze();
      } else {
        if (typeof this._parent.sceneKey !== 'undefined') {
          (0, _utilities.debuglog)(this.stateKey + ' of scene ' + this._parent.sceneKey + ' awaken.');
        }

        var calledFunctions = [];
        for (var i = 0; i < this._awakeningFunctions.length; i++) {
          calledFunctions[i] = Promise.method(this._awakeningFunctions[i].bind(this.context));
        }

        Promise.all(calledFunctions).then(function () {
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

      var calledFunctions = [];
      for (var i = 0; i < this._endingFunctions.length; i++) {
        calledFunctions[i] = Promise.method(this._endingFunctions[i].bind(this.context));
      }

      Promise.all(calledFunctions).then(function (data) {
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
  }, {
    key: 'update',
    value: function update() {
      if (this._frozenAt === null) {
        var nextEvent = void 0;
        while (this._stateManager.eventHeap.length) {
          nextEvent = this._stateManager.getFirstEventAndRemoveFromHeap();
          (0, _utilities.debuglog)('State: first event is ' + nextEvent.flag);

          this.handleEvent(nextEvent);
        }

        // if (typeof this._updateFunctions !== 'undefined') {
        //
        // }
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
      if (this.hasEventFunction(event.flag)) {
        /* Promise allow for assynchronous handling of events */
        var eventFunctions = this._eventFunctions[event.flag];
        if (eventFunctions.constructor === Array) {
          for (var i = 0; i < eventFunctions.length; i++) {
            Promise.method(eventFunctions[i].bind(this.context))(event).then(function (functionName, data) {
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
          Promise.method(eventFunctions.bind(this.context)).then(function (functionName, data) {
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
      } else {
        this._stateManager.stateHasFinishedHandlingEvent(event);
        (0, _utilities.debuglog)('State: Event \'' + event.flag + '\' not handled by state \'' + this.stateKey + '\'');
      }
    }
  }, {
    key: 'freeze',
    value: function freeze() {
      var stateManager = this._stateManager;

      this._frozenAt = stateManager.timeInMs;
      this._frozenEvents = stateManager.getAllEvents();
      (0, _utilities.debugWarn)(this._frozenEvents);
      stateManager.stateWasFrozen(this.stateKey); // TODO: make sure only one state can be frozen ? or add multiple frozen thingy
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
      stateManager.stateWasUnfreezed(this.stateKey); // TODO: make sure only one state can be frozen ? or add multiple frozen thingy
    }

    /* = Main functions = */
    // TODO Use Promise.method
    // TODO Change all _eventFunctions to arrays

  }, {
    key: 'registerEventFunctions',
    value: function registerEventFunctions(eventFlag, overwrite) {
      for (var _len = arguments.length, handlingFunctions = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        handlingFunctions[_key - 2] = arguments[_key];
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
      for (var _len2 = arguments.length, handlingFunctions = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        handlingFunctions[_key2 - 2] = arguments[_key2];
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
      for (var _len3 = arguments.length, handlingFunctions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        handlingFunctions[_key3] = arguments[_key3];
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
      for (var _len4 = arguments.length, handlingFunctions = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        handlingFunctions[_key4 - 1] = arguments[_key4];
      }

      _utilities.mustBeDefined.apply(undefined, [eventFlag].concat(handlingFunctions));
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));
      this.registerEventFunctions.apply(this, [eventFlag, false].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteEventFunctions',
    value: function overwriteEventFunctions(eventFlag) {
      for (var _len5 = arguments.length, handlingFunctions = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        handlingFunctions[_key5 - 1] = arguments[_key5];
      }

      _utilities.mustBeDefined.apply(undefined, [eventFlag].concat(handlingFunctions));
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));
      this.registerEventFunctions.apply(this, [eventFlag, true].concat(handlingFunctions));
    }
  }, {
    key: 'addAwakeningFunctions',
    value: function addAwakeningFunctions() {
      for (var _len6 = arguments.length, handlingFunctions = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        handlingFunctions[_key6] = arguments[_key6];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['awakening', false].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteAwakeningFunctions',
    value: function overwriteAwakeningFunctions() {
      for (var _len7 = arguments.length, handlingFunctions = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        handlingFunctions[_key7] = arguments[_key7];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['awakening', true].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteEndingFunction',
    value: function overwriteEndingFunction() {
      for (var _len8 = arguments.length, handlingFunctions = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        handlingFunctions[_key8] = arguments[_key8];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['ending', true].concat(handlingFunctions));
    }
  }, {
    key: 'addEndingFunctions',
    value: function addEndingFunctions() {
      for (var _len9 = arguments.length, handlingFunctions = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        handlingFunctions[_key9] = arguments[_key9];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['ending', false].concat(handlingFunctions));
    }
  }, {
    key: 'overwriteUpdateFunctions',
    value: function overwriteUpdateFunctions() {
      for (var _len10 = arguments.length, handlingFunctions = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        handlingFunctions[_key10] = arguments[_key10];
      }

      _utilities.mustBeDefined.apply(undefined, handlingFunctions);
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      this.registerCycleFunctions.apply(this, ['udpate', false].concat(handlingFunctions));
    }
  }, {
    key: 'addUpdateFunctions',
    value: function addUpdateFunctions() {
      for (var _len11 = arguments.length, handlingFunctions = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        handlingFunctions[_key11] = arguments[_key11];
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/** @module StateManager */


var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentBabylonJs = __webpack_require__(8);

var _RessourceManager = __webpack_require__(4);

var _RessourceManager2 = _interopRequireDefault(_RessourceManager);

var _State = __webpack_require__(5);

var _State2 = _interopRequireDefault(_State);

var _DataManager = __webpack_require__(3);

var _DataManager2 = _interopRequireDefault(_DataManager);

var _EventData = __webpack_require__(2);

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
    this._dataManager = dataManager;

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
      }
    }, false);

    /*  Hash table of state objects */
    this.states = {
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
      /* --- Checks if some _timeTriggerEvents should be added to the heap --- */
      for (var i = 0; i < this._timeTriggerEvents.length; i++) {
        if (this.timeInMs >= this._timeTriggerEvents[i].happenedAt) {
          this._timeTriggerEvents[i].happenedAt = this.timeInMs; // correct for fps delay
          this.addEvent(this._timeTriggerEvents[i]);
          this._timeTriggerEvents.splice(i);
        }
      }

      /* --- Update the state --- */
      this.currentState.update();
    }
  }, {
    key: 'storeEvent',
    value: function storeEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (this._dataManager.constructor !== _DataManager2.default) {
        throw new Error('storeEvent: dataManager is not set, cannot store event.');
      }

      if (!event.handled) {
        (0, _utilities.debuglog)(event);
        throw new Error('StateManager: cannot store an event that was not handled.');
      }

      if (event.stored) {
        (0, _utilities.debuglog)(event);
        throw new Error('StateManager: Event already stored');
      }

      event.storedInErrorLog = false;
      for (var i = 0; i < event.data.belongsTo.length; i++) {
        try {
          event.data.storedAt = this.timeInMs;
          event.stored = true;

          this._dataManager.addRows(event.data.belongsTo[i], event);

          (0, _utilities.debuglog)('StateManager: storing event.');
          (0, _utilities.debuglog)(event);
        } catch (error) {
          console.log('StateManager: Could not store data in ' + event.data.belongsTo[i] + ' dataTable. Data was stored in the errorLog. DataManager error was: ' + error);
          this.storeInErrorLog(event);
        }
      }
    }
  }, {
    key: 'storeData',
    value: function storeData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (this._dataManager.constructor !== _DataManager2.default) {
        throw new Error('StateManager.storeData: dataManager is not set, cannot store event.');
      }

      if (!_lodash2.default.has(data, 'belongsTo')) {
        (0, _utilities.debuglog)(data);
        throw new Error('StateManager: data needs a belongsTo property in order to store it in the dataManager.');
      }

      data.storedInErrorLog = false;
      for (var i = 0; i < data.belongsTo.length; i++) {
        try {
          this._dataManager.addRows(data.belongsTo[i], data);
        } catch (error) {
          console.error('StateManager: Could not store data in ' + data.belongsTo[i] + ' dataTable. Data was stored in the errorLog. DataManager error was: ' + error);
          this.storeInErrorLog(data);
        }
      }
    }
  }, {
    key: 'storeInErrorLog',
    value: function storeInErrorLog() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (data.storedInErrorLog === false) {
        data.storedInErrorLog = true;
        this.errorLog = this.errorLog.concat(data);
        (0, _utilities.debuglog)('StateManager: data stored in the errorLog.');
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
    }

    /* === State change === */

  }, {
    key: 'goToState',
    value: function goToState() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      if (_lodash2.default.has(this.states, key)) {
        this.currentState.end();

        this._currentStateKey = key;
        this.states[key].awake();
      } else {
        throw new Error('StateManager: Invalid state key.');
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

        if (typeof this.state === 'undefined') {
          throw new Error('state.pauseState: state is undefined');
        }
        var state = this.state;
        var stateManager = this.stateManager;
        var R = this.R;

        if (options.data.keyCode === key) {
          state.freeze(); // key function
          stateManager.goToState(R.get.states_pause);
        }

        return 'state.pauseState: resolved';
      };

      var unPause = function unPause() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (typeof this.stateManager === 'undefined') {
          // TODO Discuss wether it is a good idea to check the context
          throw new Error('state.unPause: state is undefined');
        }

        if (options.data.keyCode === key) {
          if (this.stateManager.frozenState !== null) {
            this.stateManager.goToState(this.stateManager.frozenState);
          } else {
            throw new Error('state.unPause: no frozen state !');
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
        } else {
          this.registerEventFunction(stateKeys[i], flag, unPause);
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
      if (_experimentBabylonJs.BABYLON === null) {
        return false;
      }

      var awakePause = function awakePause() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (typeof this.taskObject === 'undefined') {
          throw new Error('state.awakePause: taskObject is undefined');
        }
        var stateManager = this.stateManager;

        var pauseBackground2D = stateManager.get('pauseBackground2D');
        var elements2D = stateManager.get('elements2D');
        var canvas = elements2D.canvas;

        if (pauseBackground2D !== null) {
          pauseBackground2D.opacity = 1;
        } else {
          // draw a rect2d of canvas size with background opacity 0.5
          // draw a large text2d "PAUSE" inside
          var baseOptions = {
            id: 'pauseBackground2D',
            text: 'Pause',
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            fill: _experimentBabylonJs.BABYLON.Canvas2D.GetSolidColorBrush(new _experimentBabylonJs.BABYLON.Color4(0.3, 0.3, 0.3, 0.5)),
            fontName: '60pt Verdana'
          };

          options = _lodash2.default.extend(baseOptions, options);

          // var canvas = elements2D.canvas;

          // create button and add to canvas
          pauseBackground2D = new _experimentBabylonJs.BABYLON.Rectangle2D({
            parent: canvas,
            id: options.id,
            x: options.x,
            y: options.y,
            width: options.width,
            height: options.height,
            fill: options.fill,
            roundRadius: 0,
            children: [new _experimentBabylonJs.BABYLON.Text2D(options.text, {
              fontName: options.fontName,
              marginVAlignment: 'v: top',
              marginHAlignment: 3
            })]
          });

          stateManager.set('pauseBackground2D', pauseBackground2D); // TODO Make those string part of R.
        }

        return 'state.awakePause: resolved';
      };

      var endPause = function endPause() {
        if (typeof this.state === 'undefined') {
          throw new Error('state.endPause: state is undefined');
        }
        var stateManager = this.stateManager;
        var pauseBackground2D = stateManager.get('pauseBackground2D');

        if (pauseBackground2D !== null) {
          pauseBackground2D.dispose();
          stateManager.set('pauseBackground2D', null);
        }

        return 'state.endPause: resolved';
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
        throw new Error('StateManager.stateWasUnfreezed: stateKey does not correspond to the frozenState');
      }

      this.frozenState = null;
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
          throw new Error('stateManager.newEvent: belongs to need to be either a string or an array');
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
        eventOptions.data = data;
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
      var event = this.firstEvent;
      this.removeFirstEvent();

      return event;
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
      (0, _utilities.debuglog)(event);

      if (this._dataManager.constructor === _DataManager2.default) {
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
      for (var _len2 = arguments.length, handlingFunctions = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        handlingFunctions[_key2 - 2] = arguments[_key2];
      }

      _utilities.mustBeDefined.apply(undefined, [stateKey, eventFlag].concat(handlingFunctions));
      _utilities.mustHaveConstructor.apply(undefined, [Function].concat(handlingFunctions));

      if (_lodash2.default.has(this.states, stateKey)) {
        var _states$stateKey;

        (_states$stateKey = this.states[stateKey]).registerEventFunctions.apply(_states$stateKey, [eventFlag, true].concat(handlingFunctions)); // TODO Handle overwrite better ?
      } else {
        throw new Error('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding event handling functions.');
      }
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
        throw new Error('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding awakening handling functions.');
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
        throw new Error('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding awakening handling functions.');
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
        throw new Error('StateManager: Invalid state key \'' + stateKey + '\'. Create the state before adding awakening handling functions.');
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
        throw new Error('StateManager.registerGlobalFunction: func is not a function');
      }
      // TODO checks that it works
      // var promiseFunction = looksLikeAPromise(func) ? func : Promise.method(func); Do no promisify here - give user the choice
      if (name === null) {
        name = func.name;
      }

      this.globalFunctions[name] = func;
    }

    /**
     * Shorthand for registerGlobalFunction
     * @param  {string} name            function's name
     * @param  {function} promiseFunction
     */

  }, {
    key: 'register',
    value: function register() {
      for (var _len3 = arguments.length, functions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        functions[_key3] = arguments[_key3];
      }

      for (var i = 0; i < functions.length; i++) {
        this.registerGlobalFunction(functions[i]);
      }
    }

    // TODO get rid of this function use only call

  }, {
    key: 'callGlobalFunction',
    value: function callGlobalFunction(name) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
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
      (0, _utilities.mustBeDefined)(name);

      if (typeof name === 'undefined') {
        throw new Error('StateManager.call: name of the function needs to be defined.');
      }
      if (_lodash2.default.has(this.globalFunctions, name)) {
        for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }

        return this.globalFunctions[name].bind(this.context).apply(undefined, args);
      }
      (0, _utilities.debugWarn)('StateManager.call: globals do not contain function \'' + name + '\'');
      return undefined;
    }
  }, {
    key: 'promise',
    value: function promise(name) {
      (0, _utilities.mustBeDefined)(name);

      if (typeof name === 'undefined') {
        throw new Error('StateManager.promiseGlobalFunction: name is undefined.');
      }

      if (_lodash2.default.has(this.globalFunctions, name)) {
        for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }

        return Promise.method(this.globalFunctions[name]).bind(this.context).apply(undefined, args);
      }

      (0, _utilities.debugWarn)('StateManager.promiseGlobalFunction: globals do not contain function \'' + name + '\'');
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

      var _this = this;

      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var results = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      if (!_lodash2.default.has(this.globalFunctions, name)) {
        throw new Error('StateManager.recurseOnGlobalFunction: globals do not contain function \'' + name + '\'');
      }

      // Base case - just return the promisified result
      if (amount === 0) {
        return new Promise(function (resolve) {
          resolve(results);
        });
      }

      var next = this.promise.apply(this, [name].concat(_toConsumableArray(args))).then(function (r) {
        results = results.concat(r);
        return _this.recurseOnGlobalFunction(name, amount - 1, args, results);
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

      if (_lodash2.default.has(this.globals, name)) {
        return this.globals[name];
      }
      (0, _utilities.debugWarn)('StateManager: globals do not contain variable \'' + name + '\'');
      return null;
    }
  }, {
    key: 'get',
    value: function get() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      return this.getGlobal(name);
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
      throw new Error('StateManager: Invalid state key.');
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
        dataManager: this._dataManager,
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
        throw new Error('StateManager: Invalid state key.');
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
        throw new Error('StateManager: Invalid state, it has no state key defined.');
      }
    }
  }, {
    key: 'eventHeap',
    get: function get() {
      return this._eventHeap;
    },
    set: function set(value) {
      // eslint-disable-line
      throw new Error('StateManager: eventHeap is readonly. Add events through the class methods.');
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
      throw new Error('StateManager: firstEvent is readonly.');
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEBUG_MODE_ON = true;

exports.DEBUG_MODE_ON = DEBUG_MODE_ON;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

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

var _experimentBabylonJs = __webpack_require__(8);

var _experimentBoxes = __webpack_require__(11);

var _DataManager = __webpack_require__(3);

var _DataManager2 = _interopRequireDefault(_DataManager);

var _RessourceManager = __webpack_require__(4);

var _RessourceManager2 = _interopRequireDefault(_RessourceManager);

var _EventData = __webpack_require__(2);

var _EventData2 = _interopRequireDefault(_EventData);

var _StateManager = __webpack_require__(6);

var _StateManager2 = _interopRequireDefault(_StateManager);

var _State = __webpack_require__(5);

var _State2 = _interopRequireDefault(_State);

var _utilities = __webpack_require__(0);

var _config = __webpack_require__(7);

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
    var loadingSceneGenerator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var engine = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'babylon';

    _classCallCheck(this, TaskObject);

    if (typeof window !== 'undefined') {
      // TODO should it fail more gracefully ?
      return { error: 'Wrong environment. ExperimentJS only works in the browser.' };
    }
    /* --- Constants --- */
    // this.constants = {};

    /* --- Store canvas information --- */
    this._target = target;
    this.canvas = target.get(0);

    /* --- Setup engine --- */
    if (engine === 'babylon') {
      // Start BabylonJS engine
      this.engine = new _experimentBabylonJs.BABYLON.Engine(this.canvas, false, null, false);
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

    /* --- Add global mouse and keyboard event tables --- */
    var globalLogFields = ['id', 'flag', 'happenedAt', 'data'];

    // globalLogs is the default data table of the dataManager,
    // adding specific data table for mouse and key events
    this.dataManager.addTable('keyEvents', globalLogFields);
    this.dataManager.addTable('mouseEvents', globalLogFields);

    /* --- Add task status table --- */
    var taskStatusFields = ['level', 'happenedAt'];
    this.dataManager.addTable('taskStatus', taskStatusFields);

    /* --- Add raised flags --- */
    var statusFlagsFields = ['flag', 'happenedAt'];
    this.dataManager.addTable('statusFlags', statusFlagsFields);

    /* --- Assets --- */
    /**
     * Path to assets folder
     * @type {String}
     */
    if (assetsFolder) {
      this.ASSETS_FOLDER = assetsFolder;
    } else {
      this.ASSETS_FOLDER = window.assetsFolderFullpath;
    }

    this.ASSETS_FLARE_PATH = this.ASSETS_FOLDER + '/textures/flare/flare.png';

    /**
     * Object to store global task assets after loading or creation
     * @type {Object}
     */
    // this.assets = {};

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
    });

    /* --- Set-up events --- */
    this.flags = {};
    this.keyState = []; // holds state of keys being stroked indexed by event.keyCode
    this.shouldShowDebug = typeof _config.DEBUG_MODE_ON !== 'undefined' ? _config.DEBUG_MODE_ON : false;
    this.setupGlobalEvents();

    /* --- Modals --- */
    this._currentModal = this.MODAL_INTRODUCTION;

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

      var promise = Promise.method(generator.bind(this.context))(sceneOptions).then(function (scene) {
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

      return Promise.all(promises);
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

        if (assets[i].constructor === _experimentBabylonJs.BABYLON.Mesh) {
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

      var textureFormats = ['png', 'bmp', 'jpg', 'tiff'];

      var assetManager = new _experimentBabylonJs.BABYLON.AssetsManager(scene);
      var R = this.R;

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
          } else {
            console.warn('TaskObject.loadAssets: asset invalid or not implement with shorthand function');
            type = 'invalid';
          }
        } else if (field.constructor === Object && Object.keys(field).includes(['path', 'type'])) {
          path = this.ASSETS_FOLDER + field.path;
          type = field.type;
        } else {
          console.warn('TaskObject.loadAssets: asset invalid or not implement with shorthand function');
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
        }
      }

      /* --- Create a Deferred promise that will resolve after loading is complete --- */
      var loadDeferred = new _utilities.Deferred();

      assetManager.load();
      assetManager.onFinish = function onFinish(tasks) {
        (0, _utilities.debuglog)('TaskObject.loadAssets: tasks completed', tasks);
        loadDeferred.resolve(scene);
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

      if (asset.constructor === _experimentBabylonJs.BABYLON.Mesh) {
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

      if (typeof window === 'undefined' || typeof process !== 'undefined') {
        return Promise.resolve();
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

        if (typeof loadingScene.loadingPromise !== 'undefined' && loadingScene.loadingPromise.constructor === Promise) {
          return loadingScene.loadingPromise;
        }
        return Promise.resolve();
      }).then(function () {
        /* --- Set the loaded flag --- */
        _this2.dataManager.addRows('statusFlags', {
          flag: _this2.R.get.flags_hasLoaded,
          happenedAt: _this2.timeInMs
        });

        /* --- Start the render loop --- */
        _this2.engine.runRenderLoop(function () {
          _this2.scenes[_this2.currentScene].render();
        });

        /* --- Now that assets are loaded we generate the task scenes --- */
        return _this2.generateScenes();
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
          pause: 'pause',
          wasHandled: 'was_handled',
          beingHandled: 'being_handled'
        }
      });

      /* Add keyboard listener */
      window.addEventListener('keydown', function (evt) {
        (0, _utilities.debuglog)('TaskObject: Keydown event.');
        (0, _utilities.debuglog)(evt);

        // call taskObject keyfunction handler
        _this3.keyfunction(evt);

        // store keydown event
        var eventData = new _EventData2.default(R.get.events_keydown, _this3.timeInMs, {
          belongsTo: ['globalLog', 'keyEvents'],
          handledAt: null,
          storedAt: null,
          keyCode: evt.keyCode
        });

        // TODO add event to current scene should be a method
        if (typeof _this3.currentSceneObject !== 'undefined') {
          if (typeof _this3.currentSceneObject.stateManager !== 'undefined') {
            _this3.currentSceneObject.stateManager.addEvent(eventData);
          }
        }
      });

      // update the keystates when keyup but do not store event
      // TODO think if usefull to store keyup
      window.addEventListener('keyup', function (evt) {
        _this3.keyfunction(evt);
      });

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
      window.addEventListener('mousedown', function (evt) {
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
      });
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
        this.toggleDebugLayer();

        // prevent default action if any
        e.preventDefault();
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
    }
  }, {
    key: 'create2DScene',
    value: function create2DScene() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      /*
        Babylon Scene objects are enriched in experiment-js with:
          * sceneKey
          * parentTaskObject
          * stateManager
          * dataManager
          * initialCanvas
          * initialCamera
          * updateContentFrame
        Importantly - The registerBeforeRender() lifecycle function calls the update function of the stateManager
       */

      var optionsBase = {
        sceneKey: 'scene' + Math.random() * 100000,
        canvasBackground: new _experimentBabylonJs.BABYLON.Color4(0, 0, 0, 1),
        backgroundRoundRadius: 50,
        clearColor: new _experimentBabylonJs.BABYLON.Color4(0, 0, 0, 1),
        canvasPercentWidth: 0.8,
        canvasPercentHeight: 1
      };

      options = _lodash2.default.extend(optionsBase, options);

      var scene = new _experimentBabylonJs.BABYLON.Scene(this.engine);

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
      this.addStateManager(scene);

      /* --- Set background --- */
      scene.clearColor = options.clearColor;

      var camera = new _experimentBabylonJs.BABYLON.ArcRotateCamera('Camera', 0, Math.PI / 2, 12, _experimentBabylonJs.BABYLON.Vector3.Zero(), scene);

      var canvas = new _experimentBabylonJs.BABYLON.ScreenSpaceCanvas2D(scene, {
        id: 'ScreenCanvas',
        backgroundFill: _experimentBabylonJs.BABYLON.Canvas2D.GetSolidColorBrush(options.canvasBackground),
        backgroundRoundRadius: options.backgroundRoundRadius,
        fill: _experimentBabylonJs.BABYLON.Canvas2D.GetSolidColorBrush(options.canvasBackground),
        x: this.renderSize.width / 2 - this.renderSize.width * options.canvasPercentWidth / 2,
        y: this.renderSize.height / 2 - this.renderSize.height * options.canvasPercentHeight / 2,
        size: new _experimentBabylonJs.BABYLON.Size(this.renderSize.width * options.canvasPercentWidth, this.renderSize.height * options.canvasPercentHeight),
        zOrder: 1
      });

      /* Set the added canvas and camera to known fields in the scene*/
      scene.initialCanvas = canvas;
      scene.initialCamera = camera;

      /* ======= Debug mode ======= */
      if (typeof _config.DEBUG_MODE_ON !== 'undefined' && _config.DEBUG_MODE_ON === true) {
        canvas.createCanvasProfileInfoCanvas();
      }

      /* ======== Scene Lifecycle ======== */

      /* --- Resize handler --- */
      var updateContentFrame = function updateContentFrame() {
        this.initialCanvas.x = this.parentTaskObject.renderSize.width / 2 - this.initialCanvas.size.width / 2;
        this.initialCanvas.y = this.parentTaskObject.renderSize.height / 2 - this.initialCanvas.size.height / 2;
      };

      scene.updateContentFrame = updateContentFrame;

      /* Scene update */
      scene.registerBeforeRender(function () {
        scene.stateManager.update();
      });

      return scene;
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
        R: this.R
      };

      if (typeof object === 'undefined') {
        return baseContext;
      }
      var extendWith = {};
      switch (object.constructor) {
        case _experimentBabylonJs.BABYLON.Scene:
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
    key: 'newInfoModal',


    /* =============== Utility Functions =============== */
    /* ======== Modal Methods ======== */
    /**
     * Creates a new information modal with specified data.
     * @param  {Array}
     */
    value: function newInfoModal() {
      var modalData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      this._currentModal = modalData;
      var thisObject = this;
      var modalBox = new _experimentBoxes.SmartModal('centralSmall', function () {
        thisObject.infoModalDismissed();
      });
      modalBox.title = modalData[0];
      modalBox.content = modalData[1];

      this.infoModal = modalBox;
    }

    /**
     * Function called when infoModal are dismissed. It checks if an action is necessary and execute it. It then destroys the infoModal.
     */

  }, {
    key: 'infoModalDismissed',
    value: function infoModalDismissed() {
      if (this._currentModal) {
        // replace by keyed object for comprehension
        var modalAction = this._currentModal[2];
        switch (modalAction[0]) {
          case 'MDASTARTTASK':
            /**
             * Start the task
             */
            modalAction[1]();
            break;
          default:
            throw new Error('infoModalDismissed: Action unknown');
        }
      } else {
        throw new Error('infoModal not defined');
      }

      this.removeInfoModal();
    }
  }, {
    key: 'removeInfoModal',
    value: function removeInfoModal() {
      if (this.infoModal) {
        switch (this.infoModal.constructor.name) {
          case 'SmartModal':
            // might do something specific ?
            break;
          default:
            throw new Error('Invalid infoModal type');
        }
      } else {
        throw new Error("Can't remove InfoModal, infoModal not set");
      }

      this.infoModal = null;
      this._currentModal = null;
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

      var animation = new _experimentBabylonJs.BABYLON.Animation('animation', property, 100, _experimentBabylonJs.BABYLON.Animation.ANIMATIONTYPE_FLOAT, _experimentBabylonJs.BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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

      var animation = new _experimentBabylonJs.BABYLON.Animation('animation', property, 24, _experimentBabylonJs.BABYLON.Animation.ANIMATIONTYPE_VECTOR3, _experimentBabylonJs.BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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

      var animation = new _experimentBabylonJs.BABYLON.Animation('animation', property, 12, _experimentBabylonJs.BABYLON.Animation.ANIMATIONTYPE_COLOR3, _experimentBabylonJs.BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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
      var animCamAlpha = new _experimentBabylonJs.BABYLON.Animation('animCam', 'alpha', 60, _experimentBabylonJs.BABYLON.Animation.ANIMATIONTYPE_FLOAT, _experimentBabylonJs.BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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

      var animCamBeta = new _experimentBabylonJs.BABYLON.Animation('animCam', 'beta', 60, _experimentBabylonJs.BABYLON.Animation.ANIMATIONTYPE_FLOAT, _experimentBabylonJs.BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

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
        color1: new _experimentBabylonJs.BABYLON.Color4(0.7, 0.8, 1, 1),
        color2: new _experimentBabylonJs.BABYLON.Color4(0.2, 0.5, 1, 1),
        colorDead: new _experimentBabylonJs.BABYLON.Color4(0, 0, 0.2, 0),
        minSize: 0.1,
        maxSize: 0.5,
        minLifeTime: 0.3,
        maxLifeTime: 0.8,
        emitRate: 150,
        blendMode: _experimentBabylonJs.BABYLON.ParticleSystem.BLENDMODE_ONEONE,
        gravity: new _experimentBabylonJs.BABYLON.Vector3(0, 9.81, 0),
        // upwards
        direction1: new _experimentBabylonJs.BABYLON.Vector3(-5, -1, 3),
        direction2: new _experimentBabylonJs.BABYLON.Vector3(5, 1, -3),
        minAngularSpeed: 0,
        maxAngularSpeed: 2 * Math.PI,
        minEmitPower: 0.1,
        maxEmitPower: 0.1,
        updateSpeed: 0.01,
        startIt: false
      };

      // extend base options with specified options
      options = _lodash2.default.extend(optionsBase, options);

      // Create a particle system
      var particleSystem = new _experimentBabylonJs.BABYLON.ParticleSystem('particles', options.capacity, scene);

      // Texture of each particle
      particleSystem.particleTexture = new _experimentBabylonJs.BABYLON.Texture(options.texture, scene);

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
        this.scenes[sceneKey].stateManager.goToState(this.R.get.states_active);

        /* ======= Debug mode ======= */
        if (typeof _config.DEBUG_MODE_ON !== 'undefined' && _config.DEBUG_MODE_ON === true && this.shouldShowDebug) {
          this.scenes[sceneKey].debugLayer.show();

          if (typeof this.scenes[sceneKey].initialCanvas !== 'undefined') {
            this.scenes[sceneKey].initialCanvas.createCanvasProfileInfoCanvas();
          }
        }

        if (this._currentSceneKey) {
          this.scenes[this._currentSceneKey].stateManager.goToState(this.R.get.states_idle);

          /* ======= Debug mode ======= */
          if (typeof _config.DEBUG_MODE_ON !== 'undefined' && _config.DEBUG_MODE_ON === true) {
            this.scenes[this._currentSceneKey].debugLayer.hide();

            if (typeof this.scenes[this._currentSceneKey].initialCanvas !== 'undefined' && this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas !== null) {
              this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas.dispose();
              this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas = null;
            }
          }
        }

        this._currentSceneKey = sceneKey;

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
      return new _experimentBabylonJs.BABYLON.Size(this.engine.getRenderWidth(), this.engine.getRenderHeight());
    },
    set: function set() {
      var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilities.mandatory)();

      switch (size.constructor) {
        case _utilities.String:
          this.canvas.width = size;
          this.canvas.height = size;
          break;
        case _experimentBabylonJs.BABYLON.Size:
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

      return new _experimentBabylonJs.BABYLON.Vector3(x, y, z);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

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

module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

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
exports.noop = exports.debugError = exports.debugWarn = exports.debuglog = exports.mandatory = exports.mustBeDefined = exports.mustHaveConstructor = exports.looksLikeAPromise = exports.delay = exports.jitter = exports.recurse = exports.Deferred = exports.rep = exports.samplePermutation = exports.matrix = exports.getRow = exports.rowSum = exports.diag = exports.String = exports.Array = exports.RessourceManager = exports.DataManager = exports.EventData = exports.State = exports.StateManager = exports.TaskObject = undefined;

var _TaskObject = __webpack_require__(9);

var _TaskObject2 = _interopRequireDefault(_TaskObject);

var _StateManager = __webpack_require__(6);

var _StateManager2 = _interopRequireDefault(_StateManager);

var _State = __webpack_require__(5);

var _State2 = _interopRequireDefault(_State);

var _EventData = __webpack_require__(2);

var _EventData2 = _interopRequireDefault(_EventData);

var _DataManager = __webpack_require__(3);

var _DataManager2 = _interopRequireDefault(_DataManager);

var _RessourceManager = __webpack_require__(4);

var _RessourceManager2 = _interopRequireDefault(_RessourceManager);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* add it to the global space in case user want to import in a script tag */
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
} /**
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
exports.TaskObject = _TaskObject2.default;
exports.StateManager = _StateManager2.default;
exports.State = _State2.default;
exports.EventData = _EventData2.default;
exports.DataManager = _DataManager2.default;
exports.RessourceManager = _RessourceManager2.default;
exports.Array = _utilities.Array;
exports.String = _utilities.String;
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=experiment.max.js.map