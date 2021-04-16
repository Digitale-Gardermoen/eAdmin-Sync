'use strict';
const getDateString = require('../components/DateString');
const Cron = require('../lib/Cron');
const Scheduler = require('../api/Scheduler');

console.log(getDateString(), '- Running eadmin-sync');

const cron = new Cron();
const scheduler = new Scheduler();

console.log(getDateString(), '- Running cron job');
try {
  cron.run(scheduler.run);
}
catch (error) {
  console.log(getDateString(), '- Got Error while running cron job, stopping application');
  console.error(getDateString(), error);
  process.exit();
}

process.on('SIGINT', async function () {
  try {
    console.log(getDateString(), '- Got SIGINT, stopping application');
  }
  catch (error) {
    console.error(getDateString(), error);
  }
  finally {
    process.exit();
  }
});
