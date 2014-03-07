
'use strict'

var error = require('quiver-error').error
var copyObject = require('quiver-copy').copyObject

var clearQuiverConfigKeys = [
  'quiverInstalledMiddlewares',
  'quiverInstallingMiddlewares',
  'quiverHandleables',
  'quiverStreamHandlers',
  'quiverHttpHandlers',
  'quiverSimpleHandlers'
]

var clearQuiverConfigStates = function(config) {
  clearQuiverConfigKeys.forEach(function(configKey) {
    config[configKey] = { }
  })
}

var handlerConfigKeyTable = {
  'stream handler': 'quiverStreamHandlers',
  'simple handler': 'quiverSimpleHandlers',
  'http handler': 'quiverHttpHandlers',
  'handleable': 'quiverHandleables'
}

var returnError = function(err, callback) {
  if(callback) return callback(err)

  throw err
}

var returnResult = function(result, callback) {
  if(callback) return callback(null, result)

  return result
}

var getHandleableBuilder = function(config, handlerName, callback) {
  var handleableBuilder = config.quiverHandleableBuilders[handlerName]
  if(!handleableBuilder) return returnError(error(500,
    'handleable ' + handlerName + ' expected but not found'), callback)

  return returnResult(handleableBuilder, callback)
}

var getHandler = function(config, handlerType, handlerName, callback) {
  var configKey = handlerConfigKeyTable[handlerType]
  if(!configKey) return returnError(error(500,
    'invalid handler type ' + handlerType), callback)

  var handlerTable = config[configKey] || { }
  var handler = handlerTable[handlerName]

  if(!handler) return returnError(error(500,
    'handler ' + handlerName + ' expected but not found'), callback)

  return returnResult(handler, callback)
}

var getHandleable = function(config, handlerName, callback) {
  var handlerTable = config.quiverHandleables || { }
  var handler = handlerTable[handlerName]

  if(!handler) return returnError(error(500,
    'handleable ' + handlerName + ' expected but not found'), callback)

  return returnResult(handler, callback)
}

var getStreamHandler = function(config, handlerName, callback) {
  var handlerTable = config.quiverStreamHandlers || { }
  var handler = handlerTable[handlerName]

  if(!handler) return returnError(error(500,
    'stream handler ' + handlerName + ' expected but not found'), callback)

  var safeArgsHandler = function(args, inputStreamable, callback) {
    handler(copyObject(args), inputStreamable, callback)
  }

  return returnResult(safeArgsHandler, callback)
}

var getSimpleHandler = function(config, handlerName, callback) {
  var handlerTable = config.quiverSimpleHandlers || { }
  var handler = handlerTable[handlerName]

  if(!handler) return returnError(error(500,
    'simple handler ' + handlerName + ' expected but not found'), callback)

  return returnResult(handler, callback)
}

var getHttpHandler = function(config, handlerName, callback) {
  var handlerTable = config.quiverHttpHandlers || { }
  var handler = handlerTable[handlerName]

  if(!handler) return returnError(error(500,
    'http handler ' + handlerName + ' expected but not found'), callback)

  return returnResult(handler, callback)
}

module.exports = {
  clearQuiverConfigStates: clearQuiverConfigStates,
  getHandleableBuilder: getHandleableBuilder,
  getHandler: getHandler,
  getHandleable: getHandleable,
  getStreamHandler: getStreamHandler,
  getSimpleHandler: getSimpleHandler,
  getHttpHandler: getHttpHandler
}