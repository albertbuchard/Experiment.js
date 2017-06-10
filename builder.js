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
 import TaskObject from './src/framework/TaskObject'
 import StateManager from './src/framework/StateManager'
 import State from './src/framework/State'
 import EventData from './src/framework/EventData'
 import DataManager from './src/framework/DataManager'
 import RessourceManager from './src/framework/RessourceManager'

 import Loader from './src/framework/objects/Loader'

 import {
   Array,
   String,
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
 } from './src/framework/utilities'


/* add it to the global space in case user want to import in a script tag */
 if (typeof window !== 'undefined') {
   window.TaskObject = TaskObject
   window.StateManager = StateManager
   window.State = State
   window.EventData = EventData
   window.DataManager = DataManager
   window.RessourceManager = RessourceManager
   window.jitter = jitter
   window.delay = delay
   window.Deferred = Deferred
 }


 export {
  TaskObject,
  StateManager,
  State,
  EventData,
  DataManager,
  RessourceManager,
  Array,
  String,
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
  Loader,
}
