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

module.exports = function debugnyan(name, options, { prefix = 'sub', simple = true, suffix = 'component' } = {}) {
  const [root, ...components] = name.split(':');

  if (!loggers[root]) {
    loggers[root] = bunyan.createLogger({ ...options, level, name: root });
  }

  if (!loggers[name]) {
    loggers[name] = loggers[root].child(
      components.reduce(
        (total, current, i) => {
          total[`${prefix.repeat(i)}${suffix}`] = current;

          return total;
        },
        { level }
      ),
      simple
    );
  }

  if (debug.enabled(name)) {
    loggers[name].level(bunyan.DEBUG);
  }

  return loggers[name];
};
