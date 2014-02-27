
'use strict'

var error = require('quiver-error').error
var copyObject = require('quiver-copy').copyObject
var handleableLib = require('quiver-handleable')
var simpleHandlerLib = require('quiver-simple-handler')

var installHandleable = function(config, handlerName, callback) {
  var handleableBuilderTable = config.quiverHandleableBuilders || { }
  var handleableBuilder = handleableBuilderTable[handlerName]

  if(!handleableBuilder) return callback(error(404, 
    'handleable builder not found: ' + handlerName))

  if(!config.quiverHandleables) config.quiverHandleables = { }

  handleableBuilder(copyObject(config), function(err, handleable) {
    if(err) return callback(err)
    
    config.quiverHandleables[handlerName] = handleable
    callback(null, handleable)
  })
}

var loadHandleable = function(config, handlerName, callback) {
  var handleableTable = config.quiverHandleables || { }

  var handleable = handleableTable[handlerName]
  if(handleable) return callback(null, handleable)

  installHandleable(config, handlerName, callback)
}

var installHandler = function(config, handlerConvert, handlerName, callback) {
  loadHandleable(config, handlerName, function(err, handleable) {
    if(err) return callback(err)
    
    var configKey = handlerConvert.configKey
    var toHandlerMethod = handlerConvert.toHandlerMethod

    if(!handleable[toHandlerMethod]) return callback(error(500, 
      'handleable is not of type ' + handlerConvert.handlerType + 
      ': ' + handlerName))

    var handler = handleable[toHandlerMethod]()
    if(!config[configKey]) config[configKey] = { }

    config[configKey][handlerName] = handler

    callback(null, handler)
  })
}

var loadHandler = function(config, handlerConvert, handlerName, callback) {
  var handlerTable = config[handlerConvert.configKey] || { }

  var handler = handlerTable[handlerName]
  if(handler) return callback(null, handler)

  installHandler(config, handlerConvert, handlerName, callback)
}

var loadStreamHandler = function(config, handlerName, callback) {
  loadHandler(config, handleableLib.streamHandlerConvert, 
    handlerName, callback)
}

var loadHttpHandler = function(config, handlerName, callback) {
  loadHandler(config, handleableLib.httpHandlerConvert, 
    handlerName, callback)
}

var installSimpleHandler = function(config, handlerName, inputType, outputType, callback) {
  loadStreamHandler(config, handlerName, function(err, streamHandler) {
    if(err) return callback(err)
    
    var simpleHandler = simpleHandlerLib.streamHandlerToSimpleHandler(
      inputType, outputType, streamHandler)

    config.quiverSimpleHandlers[handlerName] = simpleHandler
    callback(null, simpleHandler)
  })
}

var loadSimpleHandler = function(config, handlerName, inputType, outputType, callback) {
  var handler = config.quiverSimpleHandlers[handlerName]

  if(handler) return callback(null,handler)

  installSimpleHandler(config, handlerName, inputType, outputType, callback)
}

module.exports = {
  installHandleable: installHandleable,
  loadHandleable: loadHandleable,

  installHandler: installHandler,
  loadHandler: loadHandler,

  loadStreamHandler: loadStreamHandler,
  loadHttpHandler: loadHttpHandler,
  
  installSimpleHandler: installSimpleHandler,
  loadSimpleHandler: loadSimpleHandler
}