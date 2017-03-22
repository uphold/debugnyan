
/**
 * Module dependencies.
 */

import Logger from 'bunyan';
import debug from 'debug';
import debugnyan from '../src/index';

describe('debugnyan', () => {
  it('should return an instance of a bunyan logger', () => {
    const logger = debugnyan('foo');

    logger.should.be.an.instanceOf(Logger);
    logger.fields.name.should.equal('foo');
  });

  it('should return the same logger instance', () => {
    const logger1 = debugnyan('fuu');
    const logger2 = debugnyan('fuu');

    logger1.should.equal(logger2);
  });

  it('should have a default level above fatal (no output)', () => {
    const logger = debugnyan('net');

    logger.level().should.equal(Logger.FATAL + 1);
  });

  it('should accept a dictionary of options', () => {
    const logger = debugnyan('biz', { bar: 'qux', biz: 'net' });

    logger.fields.bar.should.equal('qux');
    logger.fields.biz.should.equal('net');
  });

  it('should ignore the `name` option', () => {
    const logger = debugnyan('nor', { name: 'bar' });

    logger.fields.name.should.equal('nor');
  });

  it('should be on the debug level if `DEBUG` matches logger name', () => {
    debug.enable('abc');

    const logger = debugnyan('abc');

    logger.level().should.equal(Logger.DEBUG);
  });

  describe('namespacing', () => {
    it('should support multiple components separated by colons', () => {
      const logger = debugnyan('foo:bar:biz:qux');

      logger.should.be.an.instanceOf(Logger);
      logger.fields.name.should.equal('foo');
      logger.fields.component.should.equal('bar');
      logger.fields.subcomponent.should.equal('biz');
      logger.fields.subsubcomponent.should.equal('qux');
    });

    it('should ignore the component option', () => {
      const logger = debugnyan('foo:bar', { component: 'biz' });

      logger.fields.component.should.equal('bar');
    });

    it('should accept the `simple` option', () => {
      const logger = debugnyan('foo:biz', {}, { simple: false });

      logger.should.not.have.property('_isSimpleChild');
    });

    it('should be on the debug level if `DEBUG` matches logger name', () => {
      debug.enable('foo:bar');

      const logger = debugnyan('foo:bar');

      logger.level().should.equal(Logger.DEBUG);
    });

    it('should return the same logger instances', () => {
      const logger1 = debugnyan('foo:bar');
      const logger2 = debugnyan('foo:bar');

      logger1.should.equal(logger2);
    });

    it('should enable the debug level if parent is declared before children', () => {
      debug.enable('zab:oof');

      const logger1 = debugnyan('zab:oof');
      const logger2 = debugnyan('zab:oof:zib');

      logger1.level().should.equal(Logger.DEBUG);
      logger2.level().should.equal(Logger.DEBUG);
    });

    it('should not enable the debug level if parent is declared after children', () => {
      debug.enable('kao:oob');

      const logger1 = debugnyan('kao:oob:zib');
      const logger2 = debugnyan('kao:oob');

      logger1.level().should.not.equal(Logger.DEBUG);
      logger2.level().should.equal(Logger.DEBUG);
    });
  });
});
