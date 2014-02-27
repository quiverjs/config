
'use strict'

var should = require('should')
var configLib = require('../lib/config')
var copyObject = require('quiver-copy').copyObject

describe('config lib test', function() {
  var testHandler = function(args, inputStreamable, callback) {
    callback(null, inputStreamable)
  }

  var testHandleable = {
    toStreamHandler: function() {
      return testHandler
    }
  }
  var testHandleableBuilder = function(config, callback) {
    callback(null, testHandleable)
  }

  var testConfig = {
    quiverHandleableBuilders: {
      'test handler': testHandleableBuilder
    }
  }

  it('get handler test', function(callback) {
    var config = copyObject(testConfig)

    ;(function() {
      var handler = configLib.getStreamHandler(config, 'test handler')
    }).should.throw()

    configLib.getStreamHandler(config, 'test handler', function(err, handler) {
      should.exists(err)

      callback()
    })
  })

  it('load stream handler test', function(callback) {
    var config = copyObject(testConfig)

    configLib.loadStreamHandler(config, 'test handler', function(err, handler) {
      if(err) return callback(err)

      should.equal(handler, testHandler)
      should.exists(configLib.getStreamHandler(config, 'test handler'))

      callback()
    })
  })
})