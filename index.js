
/**
 * Module dependencies.
 */

const bunyan = require('bunyan');
const debug = require('debug');

/**
 * Loggers.
 */

const loggers = Object.create(null);

/**
 * Default level.
 */

const level = bunyan.FATAL + 1;

/**
 * Export `debugnyan`.
 */

module.exports = function debugnyan(name, options, {
  prefix = 'sub',
  simple = true,
  suffix = 'component'
} = {}) {
  const components = name.split(':');
  const [root] = components;

  if (!loggers[root]) {
    loggers[root] = bunyan.createLogger(Object.assign({ level }, options, { name: root }));
  }

  let child = loggers[root];

  for (let i = 1; i < components.length; i++) {
    const current = components[i];
    const next = loggers[components.slice(0, i).join(':')];
    const childName = components.slice(0, i + 1).join(':');

    if (loggers[childName]) {
      child = loggers[childName];

      continue;
    }

    options = Object.assign({ level }, options, { [`${prefix.repeat(i - 1)}${suffix}`]: current });
    child = next.child(options, simple);
    loggers[childName] = child;
  }

  if (debug.enabled(name)) {
    child.level(level);
  }

  return loggers[name];
};
