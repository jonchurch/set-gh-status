#!/usr/bin/env node
const { argv } = require('yargs')
  .example("$0 -m 'Celebrating' -e :tada:")
  .alias('v', 'version')
  .option('m', {
    alias: 'message',
    describe: 'status message to set',
  })
  .option('e', {
    alias: 'emoji',
    describe: 'status emoji, in unicode or :emoji: form',
  })
  // .alias('x', 'expires')
  .option('b', {
    alias: 'busy',
    type: 'boolean',
    describe: 'indicate if busy',
  })
  .option('t', {
    alias: 'token',
    describe: 'Github personal access token, requires user scopes',
  })
  .alias('h', 'help')
  .help('h');

const config = require('../config');

if (argv.t) {
  config.GH_TOKEN = argv.t;
}

const { setStatus } = require('../index.js');

setStatus({
  message: argv.m,
  emoji: argv.e,
  expiresAt: argv.x,
  limitedAvailability: argv.b,
}).catch(console.error);
