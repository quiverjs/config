
'use strict'

var getter = require('./getter')
var loader = require('./loader')
var mergeObjects = require('quiver-merge').mergeObjects

module.exports = mergeObjects([getter, loader])