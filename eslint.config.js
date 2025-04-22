'use strict';

/**
 * Module dependencies.
 */

const { defineConfig } = require('eslint/config');
const uphold = require('eslint-config-uphold');

/**
 * `ESLint` configuration.
 */

module.exports = defineConfig([
  {
    extends: [uphold],
    name: 'uphold-config'
  }
]);
