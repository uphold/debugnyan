
/**
 * Module dependencies.
 */

import bunyan from 'bunyan';
import debug from 'debug';

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

export default function debugnyan(name, options, config) {
  const components = name.split(':');
  const [root] = components;

  config = Object.assign({
    prefix: 'sub',
    suffix: 'component'
  }, config);

  if (!loggers[root]) {
    loggers[root] = bunyan.createLogger(Object.assign({}, options, { name: root, level }));
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

    options = Object.assign({}, options, {
      [`${config.prefix.repeat(i - 1)}${config.suffix}`]: current,
      level
    });

    child = next.child(options, true);

    loggers[childName] = child;
  }

  if (debug.enabled(name)) {
    child.level(bunyan.DEBUG);
  }

  return loggers[name];
}
