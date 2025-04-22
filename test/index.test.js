/* eslint-disable node-plugin/no-process-env */

/**
 * Module dependencies.
 */

const { beforeEach, describe, it } = require('node:test');
const Logger = require('bunyan');
const assert = require('node:assert/strict');
const debug = require('debug');
const debugnyan = require('..');

describe('debugnyan', () => {
  beforeEach(() => {
    delete process.env.LOG_LEVEL;
  });

  it('should return an instance of a bunyan logger', () => {
    const logger = debugnyan('foo');

    assert.ok(logger instanceof Logger);
    assert.equal(logger.fields.name, 'foo');
  });

  it('should return the same logger instance', () => {
    const logger1 = debugnyan('fuu');
    const logger2 = debugnyan('fuu');

    assert.equal(logger1, logger2);
  });

  it('should have a default level above fatal (no output)', () => {
    const logger = debugnyan('net');

    assert.equal(logger.level(), Logger.FATAL + 1);
  });

  it('should accept a dictionary of options', () => {
    const logger = debugnyan('biz', { bar: 'qux', biz: 'net' });

    assert.equal(logger.fields.bar, 'qux');
    assert.equal(logger.fields.biz, 'net');
  });

  it('should ignore the `name` option', () => {
    const logger = debugnyan('nor', { name: 'bar' });

    assert.equal(logger.fields.name, 'nor');
  });

  it('should be on the default debug level if `DEBUG` matches logger name', () => {
    debug.enable('abc');

    const logger = debugnyan('abc');

    assert.equal(logger.level(), Logger.DEBUG);
  });

  it('should be on the specified level via `options.level` if `DEBUG` matches logger name', () => {
    debug.enable('abc');
    process.env.LOG_LEVEL = 'info';

    const logger = debugnyan('abc', { level: 'warn' });

    assert.equal(logger.level(), Logger.WARN);
  });

  it('should be on the specified level via `process.env.LOG_LEVEL` if `DEBUG` matches logger name', () => {
    debug.enable('abc');
    process.env.LOG_LEVEL = 'warn';

    const logger = debugnyan('abc');

    assert.equal(logger.level(), Logger.WARN);
  });

  describe('namespacing', () => {
    it('should support multiple components separated by colons', () => {
      const logger = debugnyan('foo:bar:biz:qux');

      assert.ok(logger instanceof Logger);
      assert.equal(logger.fields.name, 'foo');
      assert.equal(logger.fields.component, 'bar');
      assert.equal(logger.fields.subcomponent, 'biz');
      assert.equal(logger.fields.subsubcomponent, 'qux');
    });

    it('should ignore the component option', () => {
      const logger = debugnyan('foo:bar', { component: 'biz' });

      assert.equal(logger.fields.component, 'bar');
    });

    it('should accept the `simple` option', () => {
      const logger = debugnyan('foo:biz', {}, { simple: false });

      assert.ok(!('_isSimpleChild' in logger));
    });

    it('should be on the debug level if `DEBUG` matches logger name', () => {
      debug.enable('foo:bar');

      const logger = debugnyan('foo:bar');

      assert.equal(logger.level(), Logger.DEBUG);
    });

    it('should return the same logger instances', () => {
      const logger1 = debugnyan('foo:bar');
      const logger2 = debugnyan('foo:bar');

      assert.equal(logger1, logger2);
    });
  });
});
