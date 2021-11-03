/**
 * @file Index.js
 * @description
 * Entry point for the solution, starts the cron job.
 */
'use strict';
require('../lib/Logging');
const Cron = require('../lib/Cron');
const Scheduler = require('../api/Scheduler');

console.info('Running eadmin-sync');

const cron = new Cron();
const scheduler = new Scheduler();

console.info('Starting cron job');
try {
  cron.run(scheduler.run);
}
catch (error) {
  console.info('Got Error while starting cron job, stopping application');
  console.error(error);
  process.exit();
}

process.on('SIGINT', async function () {
  try {
    console.info('Got SIGINT, stopping application');
  }
  catch (error) {
    console.error(error);
  }
  finally {
    process.exit();
  }
});

process.on('unhandledRejection', function(reason, p){
  console.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

process.on('uncaughtException', function (err) {
console.error('Unhandled exception found: ' + err.stack);
});
