![Experiment.js logo](./assets/experiment-js.png)
An open-source, cross-platform, and headache-free development framework that makes the development of modern behavioural experiments easy and fun

# Objectives

- Same code in all experimental settings (web, lab, fMRI, mobile etc.)
- Produces high quality apps in 2D or 3D
- Event based
- Able to interact with user at millisecond precision
- Able to record any input with millisecond accuracy
- Connect to any backend / sockets / parallel ports / disk
- Could integrate current open platforms such as The Experiment Factory
- Has a UI toolbox with all the necessary for experiment development  
- Any scientist with basic coding skills should be able to learn and develop apps in the framework
- Should run asynchronously and never block the main thread
- Should be modular and small in size to allow cherry-picking
- Takes care of string localisation for different languages
- Should use technologies which are open, with an active community

# Technology stack

- Same code in all experimental settings (web, lab, fMRI, mobile etc.)
    + One language Javascript: native for web / Node.js + Electron for fMRI / Cordova for mobile
- Produces high quality apps in 2D or 3D
    + BABYLON.JS — Open source 3D engine with an active community
    + THREE.JS - Will be added soon as a possible backend
- Any scientist with basic coding skills should be able to learn and develop apps in the framework
    + JS allow to build web GUI to help novice build tasks
    + Boiler plates on Github / Examples / Playground
- Could integrate current open platforms such as The Experiment Factory
    + Same technology used by the factory (JS/Electron)
- Connect to any backend / sockets / parallel ports / disk
    + With Node.js we have low level access without having to rewrite the apps
- Should run asynchronously and never block the main thread
    + The framework relies heavily on promises and in particular custom promises called Deferred
- Should be modular and small in size to allow cherry-picking
    + Uses Webpack to create modularity both for the browser and node
    + Stored on NPM

# Description

Experiment.js is a framework allowing you to build computer based experiments using javascript,
and be able to deploy that code on the web, on mobile, or natively for fMRI use.
The framework simplifies the management of state and events, and record in a structured way any relevant input
from your subject as well as any events from your task. It interfaces seamlessly with multiple data-storage or communication scheme, wether it be the local file system, an external API, a database, a web-socket interface, or even a parallel port.
It is built upon BABYLON.js, a very active 3D engine with a strong community behind it, and allows you to use any functionality of this engine.

This is an alpha version, I am still working actively on the framework although it is already functional, I am stll working on the documentation.
Meanwhile If you do try the framework please do not hesitate to submit issues, or contact me directly, feedback is most welcome !

# Install
## Requirements
You need to install Node.js (https://nodejs.org/) and NPM (installed with node).
In your terminal you will now have access to `npm` which allows you to install modules stored on the internet (like experiment.js) and keep track of versions for you if those are updates.


Optional: Yarn is an alternative to NPM that build over it, sometimes makes downloading module faster by keeping some version cached. You can install with `> npm i -g yarn`

## Boiler plates
You can either use one of the boiler plates or install manually. For now only the web boilerplate is developed.
It will get you started for developing your web experiment, set up the dependencies and a general folder structure.

## Manual install
You can install experiment.js through npm or yarn in your terminal.

1. Open your terminal

2. Create the directory you cant to store your app in:

```
cd to/your/directory
mkdir name-of-your-app
cd name-of-your-app
```

3. Initiate a NPM project, enter project name etc. This will create a package.json file specific to your project.

`npm init`

4. Install experiment-js and all its dependencies

`npm install experiment-js`

or

`yarn add experiment-js`

## Use
The way you decide to use experimentJS will determine how you should import it.

Load it in a script tag in a html web page:
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Experiment.js</title>
    <script src="node_modules/jquery/dist/jquery.js"></script>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <script src="node_modules/tether/dist/js/tether.min.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>

    <script src="node_modules/experiment-mathjs/dist/math.js"></script>
    <script src="node_modules/lodash/lodash.js"></script>
    <script src="node_modules/chartjs/chart.js"></script>
    <script src="node_modules/experiment-babylon-js/lib/babylon.max.js"></script>

    <script src="node_modules/experiment-boxes/lib/experimentBoxes.max.js" charset="utf-8"></script>
    <script src="node_modules/experiment-js/lib/experiment.max.js" charset="utf-8"></script>
    <style>
    html, body {
      overflow: hidden;
      width   : 100%;
      height  : 100%;
      margin  : 0;
      padding : 0;
    }

    .task-canvas {
      width   : 100%;
      height  : 100%;
      touch-action: none;
    }

    .h5, h5 {
      font-size: 20pt !important;
    }


    body {
      background: #E3E3E3;
    }
    </style>
  </head>
  <body>
    <script type="text/javascript">  
    // Wait until the container div is loaded then start the task
    document.addEventListener('DOMContentLoaded', () => {
      const taskObject = new TaskObject(document.getElementsByClassName('task-canvas'))
      taskObject.startTask()   
    })
    </script>
    <canvas class="task-canvas">
      <p>
        Your browser does not support the canvas element and will not be able to render the task.
      </p>
      <p>
        Please install Google Chrome to continue: https://www.google.com/chrome
      </p>
    </canvas>
  </body>
</html>
```

or

Develop using the latest tools in a modular and ES6 way: have a look at our boilerplate (http://www.github.com/albertbuchard/experiment-boilerplate-web)

or

Import it in Node or Js files, or make it cross platform from the get go and install Meteor and Electron. You will use `import` statements, and pick which class and functions you need from the framework:
```
// Import the classes and function I need from the experiment-js
import { RessourceManager, TaskObject, Deferred, debuglog, preloadImages } from 'experiment-js'
import { SmartForm } from 'experiment-boxes'
```

# General Structure
![Main modules](http://i.imgur.com/VOIA6vY.png)
![Global Framework](http://i.imgur.com/hwbjZEA.png)
![Experiment.js modules](http://i.imgur.com/8cAwvLP.png)

# Dependencies
Lodash, jQuery, chartjs, bootstrap
experiment-babylon-js, experiment-boxes, experiment-mathjs
Optionals: experiment-api

# Roadmap

- Implement Three.js as backend
- Documentation 2D / 3D + link to Babylon.js
- Website
- Electron boilerplate with parallel port support
- Cordova boilerplate
- GUI interface for easy prototyping and code generation
- Build tests and set up continuous integration to facilitate open-source development
- Write more helper function for 3D development

## Authors

- Albert Buchard, **Bavelier Lab** in Geneva
- ❤️ Your name here ❤️ ...

# License
Apache-2
