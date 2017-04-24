# Experiment JS alpha
Experiment.js is a framework allowing you to build computer based experiments using javascript,
and be able to deploy that code on the web, on mobile, or natively for fMRI use.
The framework simplifies the management of state and events, and record in a structured way any relevant input
from your subject as well as any events from your task. It interfaces seamlessly with multiple data-storage or communication scheme, wether it be the local file system, an external API, a database, a web-socket interface, or even a parallel port.
It is built upon BABYLON.js, a very active 3D engine with a strong community behind it, and allows you to use any functionality of this engine.

This is an alpha version, I am still working actively on the framework although it is already functional, I will be creating a documentation soon.
Meanwhile If you do try the framework please do not hesitate to submit issues, or contact me directly, feedback is most welcome !

## Install

`npm instal experiment-js`

or

`yarn add experiment-js`

## Use
The way you decide to use experimentJS will determine how you should install it.

Load it in a script tag in a classic website

or

Develop using the latest tools in a modular and ES6 way
Install Node - NPM - Yarn
Install Babel

or

Make it cross platform from the get go and install Meteor and Electron


## ExperimentJS tools

### Scene generator builder
If you are not sure how to start building your task, the scene generator builder (SGB) will construct
the code of your scene from a JSON file containing the structured timeline of events or your task.
You can also use SGB web interface to generate javascript code.

SGB needs a three dimensional array of [eventName, duration, [allowedInputsFromUser]]


## Dependencies
BABYLON.js, Lodash, mathjs, jQuery

## Author
Made with ❤️ by Albert Buchard

From the **Bavelier Lab** in Geneva

## Licence
Apache-2
