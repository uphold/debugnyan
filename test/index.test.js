/**
 * Module dependencies.
 */

const Logger = require('bunyan');
const debug = require('debug');
const debugnyan = require('..');

describe('debugnyan', () => {
  it('should return an instance of a bunyan logger', () => {
    const logger = debugnyan('foo');

    expect(logger).toBeInstanceOf(Logger);
    expect(logger.fields.name).toEqual('foo');
  });

  it('should return the same logger instance', () => {
    const logger1 = debugnyan('fuu');
    const logger2 = debugnyan('fuu');

    expect(logger1).toEqual(logger2);
  });

  it('should have a default level above fatal (no output)', () => {
    const logger = debugnyan('net');

    expect(logger.level()).toEqual(Logger.FATAL + 1);
  });

  it('should accept a dictionary of options', () => {
    const logger = debugnyan('biz', { bar: 'qux', biz: 'net' });

    expect(logger.fields.bar).toEqual('qux');
    expect(logger.fields.biz).toEqual('net');
  });

  it('should ignore the `name` option', () => {
    const logger = debugnyan('nor', { name: 'bar' });

    expect(logger.fields.name).toEqual('nor');
  });

  it('should be on the debug level if `DEBUG` matches logger name', () => {
    debug.enable('abc');

    const logger = debugnyan('abc');

    expect(logger.level()).toEqual(Logger.DEBUG);
  });

  describe('namespacing', () => {
    it('should support multiple components separated by colons', () => {
      const logger = debugnyan('foo:bar:biz:qux');

      expect(logger).toBeInstanceOf(Logger);
      expect(logger.fields.name).toEqual('foo');
      expect(logger.fields.component).toEqual('bar');
      expect(logger.fields.subcomponent).toEqual('biz');
      expect(logger.fields.subsubcomponent).toEqual('qux');
    });

    it('should ignore the component option', () => {
      const logger = debugnyan('foo:bar', { component: 'biz' });

      expect(logger.fields.component).toEqual('bar');
    });

    it('should accept the `simple` option', () => {
      const logger = debugnyan('foo:biz', {}, { simple: false });

      expect(logger).not.toHaveProperty('_isSimpleChild');
    });

    it('should be on the debug level if `DEBUG` matches logger name', () => {
      debug.enable('foo:bar');

      const logger = debugnyan('foo:bar');

      expect(logger.level()).toEqual(Logger.DEBUG);
    });

    it('should return the same logger instances', () => {
      const logger1 = debugnyan('foo:bar');
      const logger2 = debugnyan('foo:bar');

      expect(logger1).toEqual(logger2);
    });

    it('should enable the debug level if parent is declared before children', () => {
      debug.enable('zab:oof');

      const logger1 = debugnyan('zab:oof');
      const logger2 = debugnyan('zab:oof:zib');

      expect(logger1.level()).toEqual(Logger.DEBUG);
      expect(logger2.level()).toEqual(Logger.DEBUG);
    });

    it('should not enable the debug level if parent is declared after children', () => {
      debug.enable('kao:oob');

      const logger1 = debugnyan('kao:oob:zib');
      const logger2 = debugnyan('kao:oob');

      expect(logger1.level()).not.toEqual(Logger.DEBUG);
      expect(logger2.level()).toEqual(Logger.DEBUG);
    });
  });
});
