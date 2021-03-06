/**
 * Boiler Plate For Cognitive Tasks JS
 *
 *
 * author: Albert Buchard 2016
 *
 * REQUIRE ECMA2016 / JQUERY / MATHJS / BABYLON
 */

/* =============== Set-up =============== */
import _ from 'lodash'
import BABYLON from 'experiment-babylon-js'

import { ParamBox, SmartModal } from 'experiment-boxes'
import Promise from 'bluebird'
import math from 'experiment-mathjs'

import DataManager from './DataManager'
import RessourceManager from './RessourceManager'
import EventData from './EventData'
import StateManager from './StateManager'
import State from './State'

import {
  Array,
  String,
  Deferred,
  mandatory,
  debuglog,
  debugWarn,
  debugError,
  mustHaveConstructor,
  delay,
  hasConstructor,
} from './utilities'


if (typeof window !== 'undefined') {
  /* === Get the absolute path of the library === */
  const scripts = document.getElementsByTagName('script')
  if (scripts.length) {
    const assetsFolderFullpath = scripts[scripts.length - 1].src
    const delimiterIndices = assetsFolderFullpath.indicesOf('/')
    window.assetsFolderFullpath = assetsFolderFullpath.substr(0, delimiterIndices[delimiterIndices.length - 2])
  } else {
    window.assetsFolderFullpath = './'
  }
}

/** Class handling graphic engine interface and lifecycle of the task */
export default class TaskObject {
  /**
   * class constructor : initialize the task
   * @param  {Object} target element where the task will be contained
   * @return {TaskObject}
   */
  constructor(target = mandatory(),
    assetsFolder = null,
    engine = 'babylon') {
    if (typeof window === 'undefined') { // TODO should it fail more gracefully ?
      return { error: 'Wrong environment. ExperimentJS only works in the browser.' }
    }
    /* --- Constants --- */
    // this.constants = {};

    /* --- Store canvas information --- */
    this._target = (typeof target.length !== 'undefined') ? target[0] : target
    this.canvas = this._target

    /* --- Setup engine --- */
    if (engine === 'babylon') {
      // Start BabylonJS engine
      this.engine = new BABYLON.Engine(this.canvas, false, null, false) // TODO check hardware for retina
    } else {
      throw new Error('TaskObject.constructor: engine not supported.')
    }

    /* --- Size values --- */
    this.height = window.innerHeight
    this.width = window.innerWidth
    this.babylonCanvasHeight = this.canvas.height
    this.babylonCanvasWidth = this.canvas.width

    /**
     * Task DataManager
     * @type {DataManager}
     */
    this.dataManager = new DataManager(this)

    /**
     * The main connection object in the dataManager used by the TaskObject.
     * It is set when using this.setConnection() which is a wrapper for the dataManager function
     * @type {Object}
     */
    this.connection = null

    /* --- Add global mouse and keyboard event tables --- */
    const globalLogFields = this.dataManager.GLOBAL_LOG_FIELDS

    // globalLogs is the default data table of the dataManager,
    // adding specific data table for mouse and key events
    this.dataManager.addTable('keyEvents', globalLogFields)
    this.dataManager.addTable('mouseEvents', globalLogFields)

    /* --- Add task status table --- */
    const taskStatusFields = ['level', 'happenedAt']
    this.dataManager.addTable('taskStatus', taskStatusFields)

    /* --- Add raised flags --- */
    const statusFlagsFields = ['flag', 'happenedAt']
    this.dataManager.addTable('statusFlags', statusFlagsFields)

    /* --- Add the checkpoint table --- */
    const checkpointFields = ['code', 'happenedAt', 'message']
    this.dataManager.addTable('checkpoints', checkpointFields)

    /* --- Assets --- */
    /**
     * Path to assets folder
     * @type {String}
     */
    if (assetsFolder) {
      this.ASSETS_FOLDER = assetsFolder
    } else {
      this.ASSETS_FOLDER = window.assetsFolderFullpath
    }

    this.ASSETS_FLARE_PATH = `${this.ASSETS_FOLDER}/textures/flare/flare.png`

    /**
     * Object to store global task assets after loading or creation
     * @type {Object}
     */
    this.assetsToLoad = {}

    this.R = new RessourceManager()
    this.R.add({
      states: {
        active: 'active',
        idle: 'idle',
        pause: 'pause',
      },
      folders: {
        assetsFolder: assetsFolder || window.assetsFolderFullpath,
      },
    })


    /* --- Set-up events --- */
    this.flags = {}
    this.keyState = [] // holds state of keys being stroked indexed by event.keyCode
    this.shouldShowDebug = typeof window.DEBUG_MODE_ONE !== 'undefined' ? window.DEBUG_MODE_ONE : false
    this.setupGlobalEvents()

    /* --- Modals --- */
    this.currentModal = null

    /* --- Task parameters --- */
    this.parameters = {}

    /* --- Task level variables --- */
    this.variables = {}
    this.variables.shouldSeeInformation = true

    /* --- Scenes --- */
    this.scenes = {}
    this.sceneGenerators = {}
    this.sceneGenerators.functions = {}
    this.sceneGenerators.functionsOptions = {}

    /* --- Set a default loading scene --- */
    this.sceneGenerators.loading = TaskObject.default2dSceneGenerator
    this.sceneGenerators.loadingOptions = { sceneKey: 'loading', shouldLoadAssets: true }

    this._currentSceneKey = ''

    /* --- ParamBox setup --- */
    this._paramBox = null

    /* if ParamBox library is loaded - create one */
    if (typeof ParamBox === 'function') {
      this._paramBox = new ParamBox()
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

  registerSceneGenerator(sceneGenerator = mandatory('sceneGenerator'), options = {}, loading = false, promise = false, key = null) {
    // option base
    options = _.clone(options)

    if ((key === null) && (sceneGenerator.name !== '')) {
      key = sceneGenerator.name
    } else {
      key = `scene${Object.keys(this.sceneGenerators.functions).length}`
    }

    if (loading) {
      this.sceneGenerators.loading = sceneGenerator
      this.sceneGenerators.loadingOptions = options
    } else {
      this.sceneGenerators.functions[key] = sceneGenerator
      this.sceneGenerators.functionsOptions[key] = options
    }
  }

  registerLoadingFunction(loadingSceneGenerator = mandatory('loadingSceneGenerator'), options = {}, promise = false) {
    /* --- Force sceneKey to be loading --- */
    options.sceneKey = 'loading'

    this.registerSceneGenerator(
      loadingSceneGenerator,
      options,
      true,
      promise,
    )
  }

  callSceneGenerator(key = mandatory()) {
    const sceneOptions = this.sceneGenerators.functionsOptions[key]
    const generator = this.sceneGenerators.functions[key]

    const promise = Promise.method(generator.bind(this.context))(sceneOptions)
      .then((scene) => {
        if (typeof scene.sceneKey === 'undefined') {
          scene.sceneKey = key
        }

        this.scenes[scene.sceneKey] = scene
      })

    return promise
  }

  generateScenes() {
    const functionKeys = Object.keys(this.sceneGenerators.functions)
    const promises = []
    for (let i = 0; i < functionKeys.length; i++) {
      promises.push(this.callSceneGenerator(functionKeys[i]))
    }

    return Promise.all(promises)
  }

  static default2dSceneGenerator(options) {
    /* --- Get the taskObject instance from binded context --- */
    const taskObject = this.taskObject

    const optionsBase = {
      canvasBackground: new BABYLON.Color4(1, 1, 1, 1),
      backgroundRoundRadius: 0,
      clearColor: new BABYLON.Color4(1, 1, 1, 1),
      canvasPercentWidth: 1,
      canvasPercentHeight: 1,
      mode: 'central',
      level: null,
      shouldLoadAssets: false,
    }

    options = _.extend(optionsBase, options)

    /* --- Create a basic 2D scene using a Canvas2D as background --- */
    const scene = taskObject.create2DScene(options)

    /* --- Load assets --- */
    let assetObject = {
      logo: {
        path: '/assets/experiment-js.svg',
        type: 'texture',
      },
    }

    // Will load all the assets contained in the task assetsToLoad variable
    if (options.shouldLoadAssets) {
      assetObject = _.extend(assetObject, taskObject.assetsToLoad)
    }

    // add content loaded text
    scene.loadingPromise = taskObject.loadAssets(assetObject, scene)
    .then(() => {
      const canvas = scene.initialCanvas

      const texture = taskObject.R.get.textures_logo
      texture.hasAlpha = true

      const height = math.max(taskObject.renderSize.height * 0.05, 45)
      new BABYLON.Sprite2D(texture, { // eslint-disable-line
        parent: canvas,
        id: 'logo',
        marginAlignment: 'h: center, v:center',
        size: new BABYLON.Size(height * 3000 / 730, height),
        origin: BABYLON.Vector2.Zero(),
      })
    })


    return scene
  }

  cloneAssetsIntoScene(assets = mandatory(), scene = mandatory()) {
    if (assets.constructor !== Array) {
      assets = [assets]
    }

    const assetsArray = []
    for (let i = 0; i < assets.length; i++) {
      const clone = assets[i].clone()
      clone._scene = scene

      if (assets[i].constructor === BABYLON.Mesh) {
        if (clone.material) {
          clone.material = clone.material.clone()
          clone.material._scene = scene
          if (clone.material.subMaterials) {
            for (let j = 0; j < clone.material.subMaterials.length; j++) {
              clone.material.subMaterials[j] = clone.material.subMaterials[j].clone()
              clone.material.subMaterials[j]._scene = scene
            }
          }
        }
        scene.addMesh(clone)
      }

      assetsArray.push(clone)
    }

    return assetsArray
  }

  loadAssets(assetObject = mandatory(), scene = mandatory(), assetFolder = '') {
    if (assetObject.constructor !== Object) {
      throw new Error('TaskObject.loadAssets: assetObject is not an Object')
    }

    if ((assetFolder === '') && (typeof this.ASSETS_FOLDER !== 'undefined')) {
      assetFolder = this.ASSETS_FOLDER
    }

    const textureFormats = ['png', 'bmp', 'jpg', 'tiff', 'svg']
    const soundFormats = ['wav', 'mp3', 'flac', 'aac', 'mp4', 'ogg']

    const assetManager = new BABYLON.AssetsManager(scene)
    const R = this.R

    const binaryPromises = []

    const names = Object.keys(assetObject)
    let field
    let type
    let path
    for (let i = 0; i < names.length; i++) {
      field = assetObject[names[i]]

      if (field.constructor === String) {
        path = this.ASSETS_FOLDER + field

        if (textureFormats.indexOf(R.getFormat(path)) !== -1) {
          type = 'texture'
        } else if (soundFormats.indexOf(R.getFormat(path)) !== -1) {
          type = 'sound'
        } else {
          console.warn('TaskObject.loadAssets: asset invalid or not implemented with shorthand string definition (use full object with path and type)')
          type = 'invalid'
        }
      } else if ((field.constructor === Object) && (Object.keys(field).includes(['path', 'type']))) {
        path = this.ASSETS_FOLDER + field.path
        type = field.type
      } else {
        console.warn('TaskObject.loadAssets: asset invalid')
        type = 'invalid'
      }

      if (type === 'texture') {
        const assetManagerTask = assetManager.addTextureTask(`${names[i]}Task`, path)
        assetManagerTask.onSuccess = function (task) {
          R.add({
            textures: {
              [this.textureName]: task.texture,
            },
          })
        }.bind({
          textureName: names[i],
        })
      } else if (type === 'sound') {
        const assetManagerTask = assetManager.addBinaryFileTask(`${names[i]}Task`, path)
        assetManagerTask.onSuccess = function (task) {
          const isReady = new Deferred()
          binaryPromises.push(isReady.promise)
          R.add({
            sounds: {
              [this.soundName]: new BABYLON.Sound(this.soundName, task.data, scene, isReady.resolve),
            },
          })
        }.bind({
          soundName: names[i],
        })
      }
      // TODO all the rest such as Meshes.. what else ?
    }

    /* --- Create a Deferred promise that will resolve after loading is complete --- */
    const loadDeferred = new Deferred()

    assetManager.load()
    assetManager.onFinish = function onFinish(tasks) {
      debuglog('TaskObject.loadAssets: tasks completed', tasks)
      Promise.all(binaryPromises).then(() => loadDeferred.resolve(tasks))
    }

    return loadDeferred.promise
  }

  cloneAssetIntoScene(asset = mandatory(), scene = mandatory()) {
    // TODO: Merge with cloneAssetsIntoScene
    if (asset.constructor === Array) {
      return this.cloneAssetsIntoScene(asset, scene)
    }

    const clone = asset.clone()
    clone._scene = scene

    if (asset.constructor === BABYLON.Mesh) {
      if (clone.material) {
        clone.material = clone.material.clone()
        clone.material._scene = scene
        if (clone.material.subMaterials) {
          for (let i = 0; i < clone.material.subMaterials.length; i++) {
            clone.material.subMaterials[i] = clone.material.subMaterials[i].clone()
            clone.material.subMaterials[i]._scene = scene
          }
        }
      }
      scene.addMesh(clone)
    }

    return clone
  }

  /* ======== Class Methods ======== */
  /* ======== Lifecycle Methods ======== */
  /**
   * Creates the game engine object and loads the scenes.
   */
  startTask() {
    if (typeof window === 'undefined') {
      return Promise.resolve()
    }

    window.addEventListener('resize', () => {
      this.engine.resize()
    })

    const deferred = new Deferred()
    /* --- Create a loading scene in order to load assets --- */
    const loadingOptions = this.sceneGenerators.loadingOptions
    const loadingScene = (this.sceneGenerators.loading.bind(this.context))(loadingOptions)
    loadingScene.loadingPromise.then(() => {
        /* --- Store the scene in the TaskObject --- */
      this.scenes.loading = loadingScene

        /* --- Set the currentScene to the loading scene that has finished loading --- */
      this.currentScene = loadingScene.sceneKey

      if ((typeof loadingScene.loadingPromise !== 'undefined') && (loadingScene.loadingPromise.constructor === Promise)) {
        return loadingScene.loadingPromise
      }
      return Promise.resolve()
    })
      .then(() => {
        /* --- Set the loaded flag --- */
        this.dataManager.addRows('statusFlags', {
          flag: this.R.get.flags_hasLoaded,
          happenedAt: this.timeInMs,
        })

        /* --- Start the render loop --- */
        this.engine.runRenderLoop(() => {
          this.scenes[this.currentScene].render()
        })

        /* --- Now that assets are loaded we generate the task scenes --- */
        return this.generateScenes()
      })
      .then((message) => {
        debuglog(message)
        deferred.resolve('TaskObject.startTask: loaded and scene generated.')
      })

    return deferred.promise
  }

  /* ======== Babylon Setup ======== */
  /* === Global events === */
  setupGlobalEvents() {
    // TODO: Put every flag in the ressourceManager
    /* --- Lifecycle flags --- */
    const R = this.R
    R.add({
      flags: { // TODO think about how to order those strings so not mess everything up and keep it understandable
        hasLoaded: 'hasLoaded',
        sceneStarts: 'scene_starts',
        sceneEnds: 'scene_ends',
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
        tooltipDismissed: 'tooltipDismissed',
      },
    })

    /* Add keyboard listener */
    window.addEventListener('keydown', (evt) => {
      debuglog('TaskObject: Keydown event.')
      debuglog(evt)

      // call taskObject keyfunction handler
      this.keyfunction(evt)

      // store keydown event
      const eventData = new EventData(
        R.get.events_keydown,
        this.timeInMs, {
          belongsTo: ['globalLog', 'keyEvents'],
          handledAt: null,
          storedAt: null,
          keyCode: evt.keyCode,
          key: evt.key,
        },
      )

      // TODO add event to current scene should be a method
      if (typeof this.currentSceneObject !== 'undefined') {
        if (typeof this.currentSceneObject.stateManager !== 'undefined') {
          this.currentSceneObject.stateManager.addEvent(eventData)
        }
      }
    })

    // update the keystates when keyup but do not store event
    // TODO think if usefull to store keyup
    window.addEventListener('keyup', (evt) => {
      this.keyfunction(evt)
    })

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
    window.addEventListener('mousedown', (evt) => {
      debuglog('TaskObject: mousedown event.')
      debuglog(evt)

      const eventData = new EventData(
        R.get.events_click,
        new Date().getTime(), {
          belongsTo: ['globalLog', 'mouseEvents'],
          handledAt: null,
          storedAt: null,
          clientX: evt.clientX,
          clientY: evt.clientY,
          engineX: evt.clientX *
            (this.renderSize.width / window.innerWidth),
          engineY: (window.innerHeight - evt.clientY) *
            (this.renderSize.height / window.innerHeight),
        },
      )

      // make an static EventData from dom event?
      if (typeof this.currentSceneObject !== 'undefined') {
        if (typeof this.currentSceneObject.stateManager !== 'undefined') {
          this.currentSceneObject.stateManager.addEvent(eventData)
        }
      }
    })


    window.addEventListener('resize', (evt) => {
      debuglog('TaskObject: resize event.')
      debuglog(evt)

      const eventData = new EventData(
        R.get.events_resize,
        this.timeInMs, {
          belongsTo: ['globalLog'],
          handledAt: null,
          storedAt: null,
          outerHeight: evt.target.outerHeight,
          outerWidth: evt.target.outerWidth,
        },
      )

      // if a current scene exists pass it down the stateManager
      // and look for a resize handler updateContentFrame
      if (typeof this.currentSceneObject !== 'undefined') {
        try {
          this.addEventToCurrentScene(eventData)
        } catch (e) {
          console.error(e)
        } finally {
          if (typeof this.currentSceneObject.updateContentFrame !== 'undefined') {
            this.currentSceneObject.updateContentFrame()
          }
        }
      }
    })

    /* --- Focus event --- */
    const checkFocus = function () {
      let event = R.get.events_windowBlur
      if (document.hasFocus()) {
        event = R.get.events_windowFocus
      }

      this.addEventToCurrentScene(new EventData(event, this.timeInMs))
    }.bind(this)

    let visibilityChange
    if (typeof document.hidden !== 'undefined') {
      visibilityChange = 'visibilitychange'
    } else if (typeof document.mozHidden !== 'undefined') {
      visibilityChange = 'mozvisibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      visibilityChange = 'webkitvisibilitychange'
    }

    document.addEventListener(visibilityChange, checkFocus)
    window.addEventListener('focus', checkFocus)
    window.addEventListener('blur', checkFocus)
  }

  keyfunction(e) {
    const dCode = 68
    const shiftCode = 16
    const altCode = 18 // TODO check if it is the same on all platforms

    // check if shift + P hotkeys were stroke and toggle visibility if so
    this.keyState[e.keyCode] = e.type === 'keydown'

    // hide and show debug layer
    if (this.keyState[shiftCode] && this.keyState[altCode] && this.keyState[dCode]) {
      // 16 == Shift - 68 == D -- 18 Alt
      // make sure to reset D value in case keyup event is ignored (keep shift true for rapid toggle)
      this.keyState[dCode] = false
      this.keyState[altCode] = false

      // toggle debug visibility
      this.toggleDebugLayer()

      // prevent default action if any
      e.preventDefault()
    }
  }

  addStateManager(scene = mandatory('scene')) {
    scene.stateManager = new StateManager(scene, this.dataManager)
  }

  // TODO create a familly of hooks that call functions forthe curent scene, like this one
  addEventToCurrentScene(eventData = mandatory()) {
    try {
      // checks that there is a current scene
      if (typeof this.currentSceneObject !== 'undefined') {
        // checks that the scene has a stateManager
        if (typeof this.currentSceneObject.stateManager !== 'undefined') {
          // adds the event
          this.currentSceneObject.stateManager.addEvent(eventData)
        } else {
          throw new Error('TaskObject.addEventToCurrentScene: No stateManager in currentSceneObject')
        }
      } else {
        // else return an error message
        throw new Error('TaskObject.addEventToCurrentScene: No current scene object')
      }
    } catch (e) {
      debugError(e)
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
  create2DScene(options = mandatory()) {
    const optionsBase = {
      sceneKey: `scene${Math.random() * 100000}`,
      canvasBackground: new BABYLON.Color4(0, 0, 0, 1),
      backgroundRoundRadius: 0,
      clearColor: new BABYLON.Color4(0, 0, 0, 1),
      width: null,
      height: null,
      canvasPercentWidth: 1,
      canvasPercentHeight: 1,
      minWidth: Number.NEGATIVE_INFINITY,
      minHeight: Number.NEGATIVE_INFINITY,
      maxWidth: Number.POSITIVE_INFINITY,
      maxHeight: Number.POSITIVE_INFINITY,
    }

    options = _.extend(optionsBase, options)

    const getCanvasDimensions = (noNull = true) => {
      let size = null
      let width = null
      let height = null

      const pWidth = (this.renderSize.width * options.canvasPercentWidth).boundTo(options.minWidth, options.maxWidth)
      const pHeight = (this.renderSize.height * options.canvasPercentHeight).boundTo(options.minWidth, options.maxHeight)

      let x = null
      let y = null

      if (options.width) {
        width = options.width
      } else if (options.canvasPercentWidth !== 1) {
        width = pWidth
      }
      if (options.height) {
        height = options.height
      } else if (options.canvasPercentHeight !== 1) {
        height = pHeight
      }

      if ((height !== null) || (width !== null) || noNull) {
        size = new BABYLON.Size(width !== null ? width : pWidth, height !== null ? height : pHeight)
        x = (this.renderSize.width / 2) - ((this.renderSize.width * options.canvasPercentWidth) / 2)
        y = (this.renderSize.height / 2) - ((this.renderSize.height * options.canvasPercentHeight) / 2)
      }

      return { size, x, y }
    }

    const { size: customSized } = getCanvasDimensions()


    const scene = new BABYLON.Scene(this.engine)

    /**
     * Holds the scenekey inside the scene object.
     * @type {string}
     */
    scene.sceneKey = options.sceneKey

    /**
     * Reference to the parent taskObject
     * @type {TaskObject}
     */
    scene.parentTaskObject = this

    /* --- Add a stateManager --- */
    this.addStateManager(scene)

    /* --- Set background --- */
    scene.clearColor = options.clearColor

    const camera = new BABYLON.ArcRotateCamera('Camera', 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene)
    let canvasOptions = {
      id: 'ScreenCanvas',
      backgroundFill: BABYLON.Canvas2D.GetSolidColorBrush(options.clearColor),
      fill: BABYLON.Canvas2D.GetSolidColorBrush(options.clearColor),
      zOrder: 1,
    }

    const canvas = new BABYLON.ScreenSpaceCanvas2D(scene, canvasOptions)

    canvasOptions = {
      id: 'initialCanvas',
      parent: canvas,
      roundRadius: options.backgroundRoundRadius,
      borderThickness: 0,
      fill: BABYLON.Canvas2D.GetSolidColorBrush(options.canvasBackground),
      marginAlignment: 'h: center, v: center',
      size: customSized,
      zOrder: 1,
    }

    const initialCanvas = new BABYLON.Rectangle2D(canvasOptions)

    /* Set the added canvas and camera to known fields in the scene*/
    scene.screenCanvas = canvas
    scene.initialCanvas = initialCanvas
    scene.initialCamera = camera

    scene.initialCanvas.lastResize = this.timeInMs

    /* Create a GUI canvas */
    scene.initialGui = scene.stateManager.addGuiCanvas()

    /* ======= Debug mode ======= */
    if ((typeof window.DEBUG_MODE_ONE !== 'undefined') && (window.DEBUG_MODE_ONE === true)) {
      // canvas.createCanvasProfileInfoCanvas()
    }

    /* ======== Scene Lifecycle ======== */

    /* --- Resize handler --- */
    const updateContentFrame = function () {
      // this refers to the scene here
      if (customSized) {
        this.initialCanvas.resizeAt = this.parentTaskObject.timeInMs + 1000
        delay(1000).then(() => {
          if ((this.parentTaskObject.timeInMs - this.initialCanvas.lastResize > 100) && (this.initialCanvas.resizeAt < this.parentTaskObject.timeInMs)) {
            // ((this.parentTaskObject.renderSize.width / 2) - (this.initialCanvas.size.width / 2), (this.parentTaskObject.renderSize.height / 2) - (this.initialCanvas.size.height / 2))
            this.initialCanvas.lastResize = this.parentTaskObject.timeInMs
            const { size: customSized } = getCanvasDimensions()
            debugWarn('scene.updateContentFrame: window has been resized ', customSized)
            this.initialCanvas.size = customSized

            // check if the user has defined custom resize functions
            if ((typeof this.onResize !== 'undefined') && (this.onResize !== null)) {
              if (this.onResize.constructor === Function) {
                this.onResize = [this.onResize]
              }

              const context = this.parentTaskObject.context
              for (const f of this.onResize) {
                if (f.constructor !== Function) continue
                f.bind(context)()
              }
            }
          }
        })
      }
    }


    scene.updateContentFrame = updateContentFrame

    /**
     * Custom resize functions called by updateContentFrame. Can be set by the user
     * to perform scene updates on resize. Can be an array of function or a single function.
     * @type {!function|array}
     */
    scene.onResize = null

    /* Scene update */
    scene.registerBeforeRender(() => {
      scene.stateManager.update()
    })

    return (scene)
  }


    /**
     * create3DScene - 3D Scene generator with an initialCanvas of the specifified size
     * Babylon Scene objects are enriched in experiment-js with:
     *  - sceneKey
     *  - parentTaskObject
     *  - stateManager
     *  - dataManager
     *  - initialCanvas
     *  - initialCamera
     *  - initialLight
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
  create3DScene(options = mandatory()) {
    const optionsBase = {
      sceneKey: `scene${Math.random() * 100000}`,
      canvasBackground: new BABYLON.Color4(0, 0, 0, 1),
      backgroundRoundRadius: 0,
      clearColor: new BABYLON.Color4(0, 0, 0, 1),
      camera: [0, 0, 5, BABYLON.Vector3.Zero()],
      width: null,
      height: null,
      canvasPercentWidth: 1,
      canvasPercentHeight: 1,
      lightIntensity: 1,
      minWidth: Number.NEGATIVE_INFINITY,
      minHeight: Number.NEGATIVE_INFINITY,
      maxWidth: Number.POSITIVE_INFINITY,
      maxHeight: Number.POSITIVE_INFINITY,
    }

    options = _.extend(optionsBase, options)

    const getCanvasDimensions = (noNull = true) => {
      let size = null
      let width = null
      let height = null

      const pWidth = (this.renderSize.width * options.canvasPercentWidth).boundTo(options.minWidth, options.maxWidth)
      const pHeight = (this.renderSize.height * options.canvasPercentHeight).boundTo(options.minWidth, options.maxHeight)

      let x = null
      let y = null

      if (options.width) {
        width = options.width
      } else if (options.canvasPercentWidth !== 1) {
        width = pWidth
      }
      if (options.height) {
        height = options.height
      } else if (options.canvasPercentHeight !== 1) {
        height = pHeight
      }

      if ((height !== null) || (width !== null) || noNull) {
        size = new BABYLON.Size(width !== null ? width : pWidth, height !== null ? height : pHeight)
        x = (this.renderSize.width / 2) - ((this.renderSize.width * options.canvasPercentWidth) / 2)
        y = (this.renderSize.height / 2) - ((this.renderSize.height * options.canvasPercentHeight) / 2)
      }

      return { size, x, y }
    }

    const { size: customSized } = getCanvasDimensions()


    const scene = new BABYLON.Scene(this.engine)

      /**
       * Holds the scenekey inside the scene object.
       * @type {string}
       */
    scene.sceneKey = options.sceneKey

      /**
       * Reference to the parent taskObject
       * @type {TaskObject}
       */
    scene.parentTaskObject = this

      /* --- Add a stateManager --- */
    this.addStateManager(scene)

      /* --- Set background --- */
    scene.clearColor = options.clearColor
    options.clearColor[3] = 0

    const camOptions = ['Camera', ...options.camera, scene]
    const camera = new BABYLON.ArcRotateCamera(...camOptions)

    camera.attachControl(this.canvas, true)

   // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight('Light', new BABYLON.Vector3(0, 1, 0), scene)

   // Default intensity is 1. Let's dim the light a small amount
    light.intensity = options.lightIntensity

    let canvasOptions = {
      id: 'ScreenCanvas',
      backgroundFill: BABYLON.Canvas2D.GetSolidColorBrush(options.clearColor),
      fill: BABYLON.Canvas2D.GetSolidColorBrush(options.clearColor),
      zOrder: 1,
    }

    const canvas = new BABYLON.ScreenSpaceCanvas2D(scene, canvasOptions)

    canvasOptions = {
      id: 'initialCanvas',
      parent: canvas,
      roundRadius: options.backgroundRoundRadius,
      borderThickness: 0,
      fill: BABYLON.Canvas2D.GetSolidColorBrush(options.canvasBackground),
      marginAlignment: 'h: center, v: center',
      size: customSized,
      zOrder: 1,
    }

    const initialCanvas = new BABYLON.Rectangle2D(canvasOptions)

    /* Set the added canvas and camera to known fields in the scene*/
    scene.screenCanvas = canvas
    scene.initialCanvas = initialCanvas
    scene.initialCamera = camera
    scene.initialLight = light

    canvas.levelVisible = false

    scene.initialCanvas.lastResize = this.timeInMs

      /* Create a GUI canvas */
    scene.initialGui = scene.stateManager.addGuiCanvas()

      /* ======= Debug mode ======= */
    if ((typeof window.DEBUG_MODE_ONE !== 'undefined') && (window.DEBUG_MODE_ONE === true)) {
        // canvas.createCanvasProfileInfoCanvas()
    }

      /* ======== Scene Lifecycle ======== */

      /* --- Resize handler --- */
    const updateContentFrame = function () {
        // this refers to the scene here
      if (customSized) {
        this.initialCanvas.resizeAt = this.parentTaskObject.timeInMs + 1000
        delay(1000).then(() => {
          if ((this.parentTaskObject.timeInMs - this.initialCanvas.lastResize > 100) && (this.initialCanvas.resizeAt < this.parentTaskObject.timeInMs)) {
              // ((this.parentTaskObject.renderSize.width / 2) - (this.initialCanvas.size.width / 2), (this.parentTaskObject.renderSize.height / 2) - (this.initialCanvas.size.height / 2))
            this.initialCanvas.lastResize = this.parentTaskObject.timeInMs
            const { size: customSized } = getCanvasDimensions()
            debugWarn('scene.updateContentFrame: window has been resized ', customSized)
            this.initialCanvas.size = customSized

              // check if the user has defined custom resize functions
            if ((typeof this.onResize !== 'undefined') && (this.onResize !== null)) {
              if (this.onResize.constructor === Function) {
                this.onResize = [this.onResize]
              }

              const context = this.parentTaskObject.context
              for (const f of this.onResize) {
                if (f.constructor !== Function) continue
                f.bind(context)()
              }
            }
          }
        })
      }
    }


    scene.updateContentFrame = updateContentFrame

      /**
       * Custom resize functions called by updateContentFrame. Can be set by the user
       * to perform scene updates on resize. Can be an array of function or a single function.
       * @type {!function|array}
       */
    scene.onResize = null

      /* Scene update */
    scene.registerBeforeRender(() => {
      scene.stateManager.update()
    })

    return (scene)
  }

  /* ======= dataManager ======= */
  setConnection(variables = mandatory()) {
    if (!this.dataManager) {
      throw new Error('StateManager.setCheckpoint: no dataManager')
    }

    return this.dataManager.setConnection(variables)
    .then((connection) => {
      this.connection = connection
      return connection
    })
    .catch((error) => { debugError(error) })
  }

  setCheckpoint(code = mandatory(), message = '') {
    // store the whole object in the db ? ... probably not or.. ? it might be a great idea
    // we need to save the current state name, the non object globals,
    // and the events in store, we also have to store the state globals
    // to restore we load the past state.. .hm might be too complicated

    if (!this.dataManager) {
      throw new Error('StateManager.setCheckpoint: no dataManager')
    }

    return this.dataManager.addRows('checkpoints', { code, happenedAt: this.timeInMs, message })
  }

  getCheckpoint() {
    if (!this.dataManager) {
      throw new Error('StateManager.getCheckpoint: no dataManager')
    }

    return this.dataManager.query('getCheckpoint', {}, this.connection)
  }

  /* ======= Context ======= */
  getContext(object) {
    const scene = (typeof this.currentSceneObject !== 'undefined') ? this.currentSceneObject : null
    const stateManager = ((scene !== null) && (typeof scene.stateManager !== 'undefined')) ? scene.stateManager : null
    const state = ((stateManager !== null) && (typeof stateManager.currentState !== 'undefined')) ? this.currentSceneObject.stateManager.currentState : null

    const baseContext = {
      taskObject: this,
      dataManager: (typeof this.dataManager !== 'undefined') ? this.dataManager : null,
      scene,
      stateManager,
      state,
      connection: this.connection,
      R: this.R,
    }

    if (typeof object === 'undefined') {
      return (baseContext)
    }
    let extendWith = {}
    switch (object.constructor) {
      case BABYLON.Scene:
        extendWith = {
          scene: object,
          stateManager: object.stateManager,
          state: object.stateManager.currentState,
        }
        break
      case StateManager:
        extendWith = {
          scene: object._parent,
          stateManager: object,
          state: object.currentState,
        }
        break
      case State:
        extendWith = {
          scene: object._parent,
          stateManager: object._stateManager,
          state: object,
        }
        break
      default:
        debugWarn('TaskObject.getContext: object is not of valid class. Returning taskObject context.')
        return (baseContext)
    }

    return (_.extend(baseContext, extendWith))
  }

  get context() {
    return this.getContext()
  }

  /* =============== Getters and Setters =============== */
  /* ======== Property definitions for JSDOC ======== */
  /**
   * Key string of the current scene - should not be null but an empty string on startup
   * @return {string} sceneKey in the scenes object
   */
  static get currentScene() { /**/ }

  /**
   * The current babylon scene object
   * @return {BABYLON.Scene}
   */
  static get currentSceneObject() { /**/ }

  /**
   * ParamBox object linked to the task object.
   * @return {ParamBox}
   */
  static get paramBox() { /**/ }

  static get renderSize() { /**/ }

  /* ======== Getter/Setter definitions ======== */
  get currentScene() {
    return this._currentSceneKey
  }

  set currentScene(sceneKey) {
    if (Object.keys(this.scenes).indexOf(sceneKey) !== -1) {
      if (this._currentSceneKey) {
        this.scenes[this._currentSceneKey].stateManager.goToState(this.R.get.states_idle)

        /* ======= Debug mode ======= */
        if ((typeof window.DEBUG_MODE_ONE !== 'undefined') && (window.DEBUG_MODE_ONE === true)) {
          this.scenes[this._currentSceneKey].debugLayer.hide()

          if ((typeof this.scenes[this._currentSceneKey].initialCanvas !== 'undefined') && (this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas !== null)) {
            // this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas.dispose()
            // this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas = null
          }
        }
      }

      this._currentSceneKey = sceneKey

      this.scenes[sceneKey].stateManager.goToState(this.R.get.states_active)

      /* ======= Debug mode ======= */
      if ((typeof window.DEBUG_MODE_ONE !== 'undefined') && (window.DEBUG_MODE_ONE === true) && (this.shouldShowDebug)) {
        this.scenes[sceneKey].debugLayer.show()

        if (typeof this.scenes[sceneKey].initialCanvas !== 'undefined') {
          // this.scenes[sceneKey].initialCanvas.createCanvasProfileInfoCanvas()
        }
      }

      debuglog(`TaskObject.currentScene: changed to ${sceneKey}`)
    } else if (sceneKey === null || sceneKey === '') {
      this._currentSceneKey = ''
    } else {
      console.error('TaskObject.currentScene: Invalid sceneKey.')
    }
  }

  toggleDebugLayer() {
    const scene = this.currentSceneObject
    this.shouldShowDebug = !this.shouldShowDebug

    if (typeof scene !== 'undefined') {
      if (this.shouldShowDebug) {
        this.scenes[this._currentSceneKey].debugLayer.show()

        if (typeof this.scenes[this._currentSceneKey].initialCanvas !== 'undefined') {
          this.scenes[this._currentSceneKey].initialCanvas.createCanvasProfileInfoCanvas()
        }
      } else {
        this.scenes[this._currentSceneKey].debugLayer.hide()

        if ((typeof this.scenes[this._currentSceneKey].initialCanvas !== 'undefined') && (this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas !== null)) {
          this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas.dispose()
          this.scenes[this._currentSceneKey].initialCanvas._profilingCanvas = null
        }
      }
    } else {
      console.error('taskObject.toggleDebugLayer: currentSceneObject is undefined')
    }
  }

  get currentSceneObject() {
    return this.scenes[this._currentSceneKey]
  }

  set currentSceneObject(sceneObject) {
    if (_.has(sceneObject, 'sceneKey')) {
      this.currentScene = sceneObject.sceneKey
    } else {
      throw new Error('Specified scene has no sceneKey')
    }
  }

  get time() {
    return this.timeInMs
  }

  get timeInSec() {
    return new Date().getTime() / 1000
  }

  get timeInMs() {
    return new Date().getTime()
  }

  get paramBox() {
    return this._paramBox
  }

  set paramBox(paramBox) {
    if (this._paramBox) {
      this._paramBox.delete()
    }
    this._paramBox = paramBox
  }

  get renderSize() {
    return new BABYLON.Size(
      this.engine.getRenderWidth(),
      this.engine.getRenderHeight(),
    )
  }

  set renderSize(size = mandatory()) {
    switch (size.constructor) {
      case String:
        this.canvas.width = size
        this.canvas.height = size
        break
      case BABYLON.Size:
        this.canvas.width = `${size.width}px`
        this.canvas.height = `${size.height}px`
        break
      case Array:
        if (size.length === 2) {
          this.canvas.width = size[0]
          this.canvas.height = size[1]
        } else {
          throw new Error(
          'TaskObject.renderSize: set with invalid size array, array lenght has to be === 2.',
        )
        }
        break
      default:
        throw new Error(
        'TaskObject.renderSize: set with invalid size array, array lenght has to be === 2.',
      )
    }
  }

  /* =============== Utility Functions =============== */

  /**
   * modal - Creates a new information modal with specified data.
   *
   * @param {!object} options
   *
   * @returns {type} Description
   */
  modal({ type = 'centralLarge', title = '', content = '', event = new EventData(this.R.get.events_modalDismissed) }) {
    this.dismissModal()
    this.currentModal = { data: { type, title, content, event } }
    const deferred = new Deferred()

    this.currentModal.deferred = deferred

    const modalBox = new SmartModal(type, function dismissed() {
      if ((event.constructor === EventData) && (this.stateManager !== null)) {
        event.happenedAt = this.stateManager.timeInMs
        this.stateManager.addEvent(event)
      }

      this.taskObject.currentModal.deferred.resolve('Modal closed.')
      this.taskObject.currentModal = null
    }.bind(this.context))

    modalBox.title = title
    modalBox.content = content

    this.currentModal.modalBox = modalBox
    return deferred.promise
  }

  dismissModal() {
    if ((this.currentModal !== null) && (hasConstructor(SmartModal, this.currentModal.modalBox))) {
      this.currentModal.modalBox.callThenDestroy()
      this.currentModal = null
    }
  }

  /* === Animation helpers === */
  animateFloat(object, property, from, to) {
    const keys = [{
      frame: 0,
      value: from,
    }, {
      frame: 100,
      value: to,
    }]

    const animation = new BABYLON.Animation(
      'animation',
      property,
      100,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    animation.setKeys(keys)

    this.currentSceneObject.stopAnimation(object)
    object.animations.push(animation)
    object._scene.beginAnimation(object, 0, 100, false, 1, () => {})
  }

  animateVector3(object, property, from, to, frameTotal = 24) {
    const keys = [{
      frame: 0,
      value: from,
    }, {
      frame: frameTotal,
      value: to,
    }]

    const animation = new BABYLON.Animation(
      'animation',
      property,
      24,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    animation.setKeys(keys)

    this.currentSceneObject.stopAnimation(object)

    object.animations.push(animation)
  }

  animateColor3(object, property, from, to) {
    const keys = [{
      frame: 0,
      value: from,
    }, {
      frame: 24,
      value: to,
    }]

    const animation = new BABYLON.Animation(
      'animation',
      property,
      12,
      BABYLON.Animation.ANIMATIONTYPE_COLOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    animation.setKeys(keys)

    object._scene.stopAnimation(object)

    object.animations.push(animation)
  }

  animateMainCameraRotation(toAlpha, toBeta, scene) {
    // Alpha is the rotation angle around Y axis = azimuth
    // Beta is the rotation angle around X axis = inclinaison
    scene = this.scenes[this.currentScene]
    const animCamAlpha = new BABYLON.Animation(
      'animCam',
      'alpha',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    const camera = scene.activeCamera
    const keysAlpha = []

    if (TaskObject.overPI(camera.alpha, toAlpha)) {
      keysAlpha.push({
        frame: 0,
        value: camera.alpha,
      })

      console.log(camera.alpha)
      console.log(toAlpha)

      let firstStop = -Math.PI
      let secondStop = Math.PI

      if (camera.alpha > 0) {
        firstStop = Math.PI
        secondStop = -Math.PI
      }

      keysAlpha.push({
        frame: 50,
        value: firstStop,
      })
      keysAlpha.push({
        frame: 51,
        value: secondStop,
      })
      keysAlpha.push({
        frame: 100,
        value: toAlpha,
      })
    } else {
      keysAlpha.push({
        frame: 0,
        value: camera.alpha,
      })
      keysAlpha.push({
        frame: 100,
        value: toAlpha,
      })
    }

    const animCamBeta = new BABYLON.Animation(
      'animCam',
      'beta',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    const keysBeta = []
    keysBeta.push({
      frame: 0,
      value: camera.beta,
    })
    keysBeta.push({
      frame: 100,
      value: toBeta,
    })

    animCamAlpha.setKeys(keysAlpha)
    animCamBeta.setKeys(keysBeta)

    camera.animations.push(animCamAlpha)
    camera.animations.push(animCamBeta)

    scene.beginAnimation(camera, 0, 100, false, 1, () => {})
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
  addParticuleSystemTo(mesh = mandatory(), options = {}) {
    if (typeof mesh._scene === 'undefined') {
      throw new Error('addParticuleSystemTo: mesh _scene is undefined.')
    }

    const scene = mesh._scene

    // option base
    const optionsBase = {
      name: `particle${mesh.name}`,
      capacity: 2000,
      texture: this.ASSETS_FLARE_PATH,
      minEmitBox: null,
      maxEmitBox: null,
      color1: new BABYLON.Color4(0.7, 0.8, 1, 1),
      color2: new BABYLON.Color4(0.2, 0.5, 1, 1),
      colorDead: new BABYLON.Color4(0, 0, 0.2, 0),
      minSize: 0.1,
      maxSize: 0.5,
      minLifeTime: 0.3,
      maxLifeTime: 0.8,
      emitRate: 150,
      blendMode: BABYLON.ParticleSystem.BLENDMODE_ONEONE,
      gravity: new BABYLON.Vector3(0, 9.81, 0),
      // upwards
      direction1: new BABYLON.Vector3(-5, -1, 3),
      direction2: new BABYLON.Vector3(5, 1, -3),
      minAngularSpeed: 0,
      maxAngularSpeed: 2 * Math.PI,
      minEmitPower: 0.1,
      maxEmitPower: 0.1,
      updateSpeed: 0.01,
      startIt: false,
    }

    // extend base options with specified options
    options = _.extend(optionsBase, options)

    // Create a particle system
    const particleSystem = new BABYLON.ParticleSystem(
      'particles',
      options.capacity,
      scene,
    )

    // Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture(
      options.texture,
      scene,
    )

    // Where the particles come from
    particleSystem.emitter = mesh
    // the starting object, the emitter
    if (options.minEmitBox !== null) {
      particleSystem.minEmitBox = options.minEmitBox // Starting all from
    }

    if (options.maxEmitBox !== null) {
      particleSystem.maxEmitBox = options.maxEmitBox // To...
    }

    // Colors of all particles
    particleSystem.color1 = options.color1
    particleSystem.color2 = options.color2
    particleSystem.colorDead = options.colorDead

    // Size of each particle (random between...
    particleSystem.minSize = options.minSize
    particleSystem.maxSize = options.maxSize

    // Life time of each particle (random between...
    particleSystem.minLifeTime = options.minLifeTime
    particleSystem.maxLifeTime = options.maxLifeTime

    // Emission rate
    particleSystem.emitRate = options.emitRate

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = options.blendMode

    // Set the gravity of all particles
    particleSystem.gravity = options.gravity

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = options.direction1
    particleSystem.direction2 = options.direction2

    // Angular speed, in radians
    particleSystem.minAngularSpeed = options.minAngularSpeed
    particleSystem.maxAngularSpeed = options.maxAngularSpeed

    // Speed
    particleSystem.minEmitPower = options.minEmitPower
    particleSystem.maxEmitPower = options.maxEmitPower
    particleSystem.updateSpeed = options.updateSpeed

    // Start the particle system
    if (options.startIt) {
      particleSystem.start()
    }

    return particleSystem
  }

  /* ======== Static functions ======== */
  /* === Angle functions === */
  static borderPI(radians) {
    const offset = Math.PI
    radians += offset
    const sign = Math.sign(radians)
    return radians -
      (sign * Math.floor(Math.abs(radians) / (2 * Math.PI)) * (2 * Math.PI)) -
      offset
  }

  static checkForCloserSignedAngle(baseAngle, checkedAngle) {
    checkedAngle = TaskObject.borderPI(checkedAngle)
    console.log(checkedAngle)
    console.log(`baseAngle:${baseAngle}`)
    let sign = Math.sign(checkedAngle)

    if (checkedAngle === 0) {
      sign = Math.sign(baseAngle)
    }
    const signedAngle = checkedAngle - (sign * (2 * Math.PI))
    console.log(`signedAngle:${signedAngle}`)
    const currentAngleArc = Math.abs(baseAngle - checkedAngle)
    const signedAngleArc = Math.abs(baseAngle - signedAngle)

    return currentAngleArc <= signedAngleArc ? checkedAngle : signedAngle
  }

  static overPI(angleA, angleB) {
    return Math.abs(angleA - angleB) > Math.PI
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
  static fadeOut(sound, { currentVolume = null, step = 0.02, threshold = 0.02, delayInMs = 50, pause = false } = {}) {
    mustHaveConstructor(BABYLON.Sound, sound)

    if (currentVolume === null) {
      currentVolume = sound.getVolume()
    }
    mustHaveConstructor(Number, currentVolume, step, threshold)

    currentVolume = currentVolume.boundTo(0, 1)
    step = step.boundTo(0, 1)

    let decrement = step * currentVolume
    if (decrement < step / 10) {
      decrement = step / 10
    }
    currentVolume -= decrement
    if (currentVolume > threshold) {
      debuglog(`fadeOut.currentVolume:${currentVolume}`)
      sound.setVolume(currentVolume)
      delay(delayInMs).then(() => TaskObject.fadeOut(sound, { currentVolume, step, threshold, delayInMs, pause }))
    } else if (pause) {
      debuglog('fadeOut:  pause')
      sound.pause()
    } else {
      debuglog('fadeOut:  stop')
      sound.stop()
    }
  }


  /**
   * Returns an array filled with len elements of value
   * @param  {object} value any value
   * @param  {number} len   number of element repeated
   * @return {array}
   */
  static fillArray(value, len) {
    const a = []
    for (let i = 1; i <= len; i++) {
      a.push(value)
    }
    return a
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
  static sphericalToEuclidian(r, inclination, azimuth) {
    const z = r * Math.sin(inclination) * Math.cos(azimuth)
    const x = r * Math.sin(inclination) * Math.sin(azimuth)
    const y = r * Math.cos(inclination)

    return new BABYLON.Vector3(x, y, z)
  }

  /**
   * Get random number between min and max.
   * @param  {Number} min
   * @param  {Number} max
   * @return {Number}
   */
  static getRandomArbitrary(min, max) {
    return ((Math.random() * (max - min)) + min)
  }

  static getRandomElement(array = mandatory()) {
    if (array.constructor === Array) {
      return array[Math.round(
        TaskObject.getRandomArbitrary(0, array.length - 1),
      )]
    }
    throw new Error('TaskObject: argument is not of type array.')
  }
}
