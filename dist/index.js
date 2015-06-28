
/**
 * Module dependencies.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = debugnyan;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

/**
 * Loggers.
 */

var loggers = Object.create(null);

/**
 * Default level.
 */

var level = _bunyan2['default'].FATAL + 1;

/**
 * Export `debugnyan`.
 */

function debugnyan(name, options, config) {
  var components = name.split(':');
  var root = components[0];

  config = _extends({
    prefix: 'sub',
    suffix: 'component'
  }, config);

  if (!loggers[root]) {
    loggers[root] = _bunyan2['default'].createLogger(_extends({}, options, { name: root, level: level }));
  }

  var child = loggers[root];

  for (var i = 1; i < components.length; i++) {
    var _extends2;

    var current = components[i];
    var next = loggers[components.slice(0, i).join(':')];
    var childName = components.slice(0, i + 1).join(':');

    if (loggers[childName]) {
      child = loggers[childName];

      continue;
    }

    options = _extends({}, options, (_extends2 = {}, _extends2['' + config.prefix.repeat(i - 1) + config.suffix] = current, _extends2.level = level, _extends2));

    child = next.child(options, true);

    loggers[childName] = child;
  }

  if (_debug2['default'].enabled(name)) {
    child.level(_bunyan2['default'].DEBUG);
  }

  return loggers[name];
}

module.exports = exports['default'];