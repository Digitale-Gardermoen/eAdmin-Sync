'use strict';
const LdapClient = require('../api/LdapClient');
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
        let qryOpts = {
          filter: config.ldapQueryFilter,
          scope: 'sub',
          paged: {
            pageSize: Number(config.ldapPageSize),
            pagePause: false
          }
        };

        let base = config.ldapQueryBaseDN.split(';');
        let users = [];
        for (let i = 0; i < base.length; i++) {
          console.debug('[AD] Searching LDAP with base:', base[i]);
          const res = await this.client.search(base[i], qryOpts);
          console.debug('[AD] Found', res.length, 'users');
          users = users.concat(res);
        }

        return users;
      } catch (err) {
        console.error(err);
      }
  }

  /**
   * Set the users attributes to found changes via LDAP.
   * @param {Array<Object>} users - Users with the list of attributes to change.
   */
  async setUsers(users) {
    Object.keys(users).forEach(async (user) => {
      try {
        console.info('[AD] Creating LDAP change for user:', user);
        const change = this.client.createChange('replace', users[user]);
        if (Array.isArray(change)) { 
          change.forEach(obj => console.debug('[AD] Created change object:', obj.json));
        }
        else console.debug('[AD] Created change object:', change.json);
        if (config.environment == 'prod') {
          this.client.modify(user, change);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = LdapLoader;
