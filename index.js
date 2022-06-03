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
 * As described in this issue on the `bunyan` repo: https://github.com/trentm/node-bunyan/issues/491.
 * Under the hood, bunyan connects the logger to process.stdout.
 * What happens when starting a service and piping it into bunyan with `yarn service | bunyan`, then hitting `ctrl+C`:
 * - `ctrl+C` closes the bunyan process. This results in process.stdout being no longer writable.
 * - `ctrl+C` may not immeditely close `service`. For example, if `service` implements `process.on(SIGINT)`, it will perform some extra actions, eventually calling debugnyan's logger.
 * Calling debugnyan's logger triggers a write on process.stdout, which at this point results in an `EPIPE error` because the bunyan process is closed.
 * The following block ensures that if process.stdout is closed, then trying to log anything will silently fail.
 */
process.stdout.on('error', error => {
  if (error.code !== 'EPIPE') {
    throw error;
  }
});

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
