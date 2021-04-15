'use strict';
const LdapClient = require('../api/LdapClient');
const Mongo = require('./Mongo');
const config = require('../config/Configuration');

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
    this.client = new LdapClient();
  }

  /**
   * Get a filtered list of users from AD, query uses LDAP filtering.
   * @returns {Array<Object>} Array represents a list of user objects
   */
  async getUsers() {
      try {
        const mongo = new Mongo();

        let qryOpts = {
          filter: config.ldapQueryFilter,
          scope: 'sub',
          paged: {
            pageSize: Number(config.ldapPageSize),
            pagePause: false
          }
        };

        let result = await this.client.search(config.ldapQueryBaseDN, qryOpts);

        const resultSize = result.length;

        while (result.length > 0) {
          let u = result.pop();
          let _ = mongo.upsertAdUser(u.sAMAccountName, u);
        }

        return { resultSize, endSize: result.length };
      } catch (err) {
        console.error(err);
      }
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
