'use strict';
const ActiveDirectory = require('activedirectory2').promiseWrapper;
const LdapClient = require('../api/LdapClient');
const Mongo = require('./Mongo');
const config = require('../config/Configuration');

const ldapConfig = {
  url: config.ldapUrl,
  baseDN: config.ldapBaseDN,
  username: config.ldapUsername,
  password: config.ldapPassword,
  attributes: {
    user: config.adUserProperties.split(',')
  }
};

let qryOpts = {
  filter: config.ldapQueryFilter,
  baseDN: config.ldapQueryBaseDN
};

/**
 * Connect to AD via LDAP, Get filtered users.
 * @class
 */
class LdapLoader {
  /**
   * Connects to LDAP with the specified config.
   * @constructor
   */
  constructor() {
    this.ad = new ActiveDirectory(ldapConfig);  // connect to AD with the current config.
    this.client = new LdapClient();
  }

  /**
   * Get a filtered list of users from AD, query uses LDAP filtering.
   * @returns {Array<Object>} Array represents a list of user objects
   */
  async getUsers() {
    return new Promise(async (res, rej) => {
      try {
        const mongo = new Mongo();

        let result = await this.ad.findUsers(qryOpts, false);
        //if (!result || result.length == 0) throw new Error('No users found.');

        const resultSize = result.length;

        while (result.length > 0) {
          let u = result.pop();
          mongo.upsertAdUser(u.sAMAccountName, u);
        }

        res({ resultSize, endSize: result.length });
      } catch (err) {
        console.error(err);
        rej("Caught error");
      }
    });
  }

  async setUsers(users) {
    Object.keys(users).forEach(async (user) => {
      try {
        const change = this.client.createChange('replace', users[user]);
        this.client.modify(user, change);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = LdapLoader;
