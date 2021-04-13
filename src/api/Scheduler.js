'use strict';
const getDateString = require('../components/DateString');
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
    console.log(getDateString(), '- Cron start');
    try {
      const ad = new AD();
      const eadmin = new Eadmin();
      const compare = new Compare();

      const adUsers = await ad.getUsers();
      const eadminUsers = await eadmin.getUsers();

      console.log(getDateString(), '- [AD] Got:', adUsers.resultSize, ', missing:', adUsers.endSize);
      console.log(getDateString(), '- [EA] Got:', eadminUsers.resultSize, ', missing:', eadminUsers.endSize);

      const { diff, warn } = await compare.process();
      console.log(diff, warn);

      eadmin.setUsers(diff["ActiveDirectory"]);
      ad.setUsers(diff["Eadmin"]);
    }
    catch (err) {
      console.error(getDateString(), err);
    }
    finally {
      console.log(getDateString(), '- runCompare end');
    }
  }
}

module.exports = Scheduler;
