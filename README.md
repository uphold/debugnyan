# debugnyan

A logging library that combines the simplicity and convenience of [debug](https://github.com/visionmedia/debug) with the power of [bunyan](https://github.com/trentm/node-bunyan).

## Status

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

## Installation

Install the package via `yarn`:

```sh
❯ yarn add debugnyan
```

or via `npm`:

```sh
❯ npm install debugnyan --save
```

## Usage

Create a logger by giving it a namespace and then call [bunyan's log methods](https://github.com/trentm/node-bunyan#log-method-api) on the returned instance.

By default, similarly to `debug`'s behaviour, loggers do not output any content. Each logger output can be selectively activated by using the `DEBUG` environment variable.
Pattern matching is based on the logger's name and it can optionally contain colons (`:`) to create (sub)-components properties on the logger instance.

Consider a logger named `foo:bar:biz`:

- this creates a `bunyan` logger with name `foo`
- and a `bunyan` (simple) child logger with property `component` equal to `bar`.

```js
const logger1 = require('debugnyan')('foo');
const logger2 = require('debugnyan')('foo:bar');

logger1.debug('net');
logger2.debug('qux');
```

*Example output with `DEBUG=foo`*:

```bash
DEBUG=foo node example.js

{"name":"foo","hostname":"ruimarinho","pid":1,"level":20,"msg":"net","time":"2016-10-04T18:54:14.530Z","v":0}
{"name":"foo","hostname":"ruimarinho","pid":1,"component":"bar","level":20,"msg":"qux","time":"2016-10-04T18:54:14.531Z","v":0}
```

*Example output with `DEBUG=foo:bar`*:

```bash
DEBUG=foo:bar node example.js

{"name":"foo","hostname":"ruimarinho","pid":2,"component":"bar","level":20,"msg":"qux","time":"2016-10-04T18:55:08.217Z","v":0}
```

The `prefix` and `suffix` for each component is also customizable:

```js
const logger = require('debugnyan')('foo', {}, { suffix: 'module' });
```

When creating a _child_ logger you may also override the default `simple` behavior:

```js
const logger = require('debugnyan')('foo', {}, { suffix: 'module', simple: false });
```

## Tests

```
❯ npm test
```

## Release

```sh
❯ npm version [<new version> | major | minor | patch] -m "Release %s"
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/debugnyan.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/debugnyan
[travis-image]: https://img.shields.io/travis/seegno/debugnyan.svg?style=flat-square
[travis-url]: https://travis-ci.org/seegno/debugnyan
