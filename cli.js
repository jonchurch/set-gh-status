#!/usr/bin/env node
const { argv } = require('yargs')
  .example("$0 -m 'Celebrating' -e tada")
  .alias('m', 'message')
  .alias('e', 'emoji')
  // .alias('x', 'expires')
  .alias('b', 'busy')
  .alias('t', 'token')
  .boolean(['b']);

const config = require('./config');

if (argv.t) {
  config.GH_TOKEN = argv.t;
}

const { setStatus } = require('./index.js');

setStatus({
  message: argv.m,
  emoji: argv.e,
  expiresAt: argv.x,
  limitedAvailability: argv.b,
}).catch(console.error);
