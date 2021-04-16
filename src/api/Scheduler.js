'use strict';
const AD = require('../lib/ActiveDirectory');
const Eadmin = require('../lib/Eadmin');
const Compare = require('../components/Compare');

/**
 * Class is built to run as a task, the task is to:
 * Get AD users, populate a csv file and send the csv file to an API.
 * @class Scheduler
 */
class Scheduler {
  /**
   * Run the task, this should be called by the cron job.
   */
  async run() {
    console.info('Job start');
    try {
      const ad = new AD();
      const eadmin = new Eadmin();
      const compare = new Compare();

      console.info('Fetching users...')
      const eadminUsers = await eadmin.getUsers();
      const adUsers = await ad.getUsers();
      console.info('[EA] count:', eadminUsers.length);
      console.info('[AD] count:', adUsers.length);

      console.info('Processing users...');
      const { diff, warn } = await compare.process(eadminUsers, adUsers);
      if (Object.keys(diff["ActiveDirectory"]).length < 1 & Object.keys(diff["Eadmin"]).length < 1) {
        console.info('Found no changes, returning');
        return;
      }
      console.info('[EA] count:', Object.keys(diff["ActiveDirectory"]).length);
      console.info('[AD] count:', Object.keys(diff["Eadmin"]).length);

      console.info('Writing changes');
      eadmin.setUsers(diff["ActiveDirectory"]);
      ad.setUsers(diff["Eadmin"]);
    }
    catch (err) {
      console.error( err);
    }
    finally {
      console.info('Job end');
    }
  }
}

module.exports = Scheduler;
