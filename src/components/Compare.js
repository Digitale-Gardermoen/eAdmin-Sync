const Mongo = require('../lib/Mongo');
const translateFields = require('../models/TranslateFields');
const syncConfig = require('../config/SyncConfig.json');

/**
 * Compare two or more objects
 * @class
 */
class Compare {
  constructor() {
    this.db = new Mongo();
  }
  /**
   * 
   */
  async process() {
    const eadminUsers = await this.db.fetchEadminUsers();
    const ADUsers = await this.db.fetchADUsers();
    let diff = { "ActiveDirectory": {}, "Eadmin": {} };
    let warn = {};

    while (eadminUsers.length > 0) {
      let user = eadminUsers.pop()._doc;

      let target = await this.db.findADUser(user.sLoginID);
      if (!target) {
        warn[user.sLoginID] = "Target user was not found in Active Directory";
        continue;
      }

      let change = this.checkUser(user, target, "Eadmin");

      // Save changes to be done in the diff object. As changes will be done in another method.
      if (Object.keys(change).length != 0) diff["Eadmin"][target.dn] = change;

      // clear values
      user = "";
      target = "";
    }

    while (ADUsers.length > 0) {
      let user = ADUsers.pop()._doc;

      let target = await this.db.findEadminUser(user.sAMAccountName);
      if (!target) {
        warn[user.sAMAccountName] = "Target user was not found in Eadmin";
        continue;
      }

      let change = this.checkUser(user, target, "ActiveDirectory");

      // Save changes to be done in the diff object. As changes will be done in another method.
      if (Object.keys(change).length != 0) diff["ActiveDirectory"][user.sAMAccountName] = change;

      // clear values
      user = "";
      target = "";
    };

    return { diff, warn };
  }

  checkUser(user, target, base) {
    const change = {};
    // This loop checks for changed data on the user
    // Currently the datechanged value in mongoDB is UNUSED, it is not a rqeuirement for the size of the userbase.
    syncConfig[base].fields.forEach((field) => {
      // Check if the value from eadmin is empty or blank space.
      // This also needs to REMOVE any value from AD if its changed on a user.
      if (!user[field]) {
        if (target[translateFields[field]]) {
          // queue change for replacing with a blank value.
          change[translateFields[field]] = user[field];
        }
        return;
      }

      // Check if the target field is empty, as it is already confirmed the user field is not empty above.
      // or check if the target field is not the same as the user field.
      if (!target[translateFields[field]] | target[translateFields[field]] != user[field]) {
        change[translateFields[field]] = user[field];
        return;
      }
    });

    return change;
  }
}

module.exports = Compare;
