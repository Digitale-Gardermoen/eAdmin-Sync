const translateFields = require('../models/TranslateFields');
const syncConfig = require('../config/SyncConfig.json');

/**
 * Compare two or more objects
 * @class
 */
class Compare {
  /**
   * Processes the two arrays and creates a diff and warn object.
   * @param {Array<Object>} eadminUsers - An array of user objects that will be compared.
   * @param {Array<Object>} adUsers - An array of user objects that will be compared.
   * @returns {Object<Object, Object>} - Returned values represent an object with the diff and warn values.
   */
  async process(eadminUsers, adUsers) {
    const eadminClone = JSON.parse(JSON.stringify(eadminUsers));
    const adClone = JSON.parse(JSON.stringify(adUsers));

    let diff = { "ActiveDirectory": {}, "Eadmin": {} };
    let warn = {};

    /*
      Each while loop does the same thing, but was split for simplicity sake.
      Could very likely be done better, but cba to fix it.
      The while loop stops when the user arrays are emptied, as we use the .pop() function.
      This is so we can ensure the loop is done BEFORE the promise is resolved.
    */
    console.info('[EA] Comparing users to AD');
    while (eadminUsers.length > 0) {
      let user = eadminUsers.pop();
      console.debug('[EA] Checking user:', user.sLoginID);

      /*
        Fetch the target user doing the comparison.
        The find returns the user object if found
        and undefined if it doesn't exist.
      */
      let target = adClone.find(obj => { return obj.sAMAccountName === user.sLoginID });
      if (!target) {
        warn[user.sLoginID] = "Target user was not found in Active Directory";
        continue;
      }

      let change = this.checkUser(user, target, "Eadmin");

      // Save changes to be done in the diff object. Because changes will be done in another method.
      if (Object.keys(change).length != 0) {
        console.debug('[EA] Found discrepancy:', JSON.stringify(change));
        diff["Eadmin"][target.dn] = change;
      }
    }

    console.info('[AD] Comparing users to Eadmin');
    while (adUsers.length > 0) {
      let user = adUsers.pop();
      console.debug('[AD] Checking user:', user.sAMAccountName);

      /*
        Fetch the target user doing the comparison.
        The find returns the user object if found
        and undefined if it doesn't exist.
      */
      let target = eadminClone.find(obj => { return obj.sLoginID === user.sAMAccountName });
      if (!target) {
        warn[user.sAMAccountName] = "Target user was not found in Eadmin";
        continue;
      }

      let change = this.checkUser(user, target, "ActiveDirectory");

      // Save changes to be done in the diff object. As changes will be done in another method.
      if (Object.keys(change).length != 0) {
        console.debug('[AD] Found discrepancy:', JSON.stringify(change));
        diff["ActiveDirectory"][user.sAMAccountName] = change;
      }
    };

    return { diff, warn };
  }

  /**
   * Check the configured fields for the two user objects.
   * @param {Object} user - The user object for the first compare.
   * @param {Object} target - The target object to compare against.
   * @param {String} base - A base for which the syncConfig gets it fields from.
   * @returns {Object} - Returned data represents an object with the changed values.
   */
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
