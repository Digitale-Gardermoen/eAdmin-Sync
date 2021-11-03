'use strict';
const ldap = require('ldapjs');
const config = require('../config/Configuration');

/**
 * A helper class for using ldajs.
 * @class LdapClient
 * @see {@link http://ldapjs.org/client.html | Docs}
 */
class LdapClient {
  /**
   * @constructor
   * Build the LDAP connection and authenticate with a user that has access to add, modify and search.
   */
  constructor() {
    this.client = ldap.createClient({
      url: [ config.ldapUrl ]
    });

    this.client.on('error', (err) => { if (err) console.error(err); });
    this.client.bind(config.ldapUsername, config.ldapPassword, (err) => { if (err) console.error(err); });
  }

  /**
   * Add an object via LDAP
   * @param {String} name - The DistinguishedName of the object you are adding.
   * @param {Object} entry - The object which should be added.
   * @returns {Promise<void>} - Returns nothing but a promise if you need to wait for the object to be added.
   */
  add(name, entry) {
    return new Promise((res, rej) => {
      this.client.add(name, entry, (err) => {
        if (err) rej(err);
        else res();
      });
    })
  }

  /**
   * Modify attributes on the specified object.
   * @param {String} name - The DistinguishedName of the object you are modifying.
   * @param {Object} change - A change object from the createChange method.
   * @returns {Promise<void>} - Returns an empty promise.
   */
  modify(name, change) {
    return new Promise((res, rej) => {
      this.client.modify(name, change, (err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  /**
   * Create a change object.
   * @see {@link http://ldapjs.org/client.html#change | Change docs}
   * @param {String} operation - The operation you want the change to do.
   * @param {Object} modification - An object with the changes for the LDAP object.
   * @returns {ldap.Change} - Represents a change object created by ldapjs.
   */
  createChange(operation, modification) {
    if (Object.keys(modification).length > 1) {
      let change = [];
      Object.keys(modification).forEach(key => {
        let mod = {};
        mod[key] = modification[key];

        change += new ldap.Change({
          operation,
          mod
        });
      });
      
      return change;
    }
    else {
      return new ldap.Change({
        operation,
        modification
      });
    }
  }

  /**
   * Search for LDAP objects.
   * @see {@link http://ldapjs.org/client.html#search | Search docs}
   * @param {String} base - The BASE DN string of the object to search in.
   * @param {Object} options - Options for the search, such as filters etc. See docs.
   * @returns {Promise<Array<Object>>} - Returned values represent a promise, this resolves to an array of user objects.
   */
  search(base, options) {
    return new Promise((res, rej) => {
      let data = [];

      this.client.search(base, options, (error, emitter) => {
        if (error) rej(error);

        emitter.on('searchEntry', (entry) => data.push(entry.object));
        emitter.on('error', (err) => rej(err));
        emitter.on('end', (result) => { if (result.status == 0) res(data); });
      });
    });
  }
}

module.exports = LdapClient;
