'use strict';
const ldap = require('ldapjs');
const config = require('../config/Configuration');

class LdapClient {
  constructor() {
    this.client = ldap.createClient({
      url: [ config.ldapUrl ]
    });

    this.client.on('error', () => console.error);

    this.client.bind(config.ldapUsername, config.ldapPassword, (err) => console.error(err));
  }

  add(name, entry) {
    return new Promise((res, rej) => {
      this.client.add(name, entry, (err) => {
        if (err) rej(err);
        else res();
      });
    })
  }

  modify(name, change) {
    return new Promise((res, rej) => {
      this.client.modify(name, change, (err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  createChange(operation, modification) {
    return new ldap.Change({
      operation,
      modification
    });
  }
}

module.exports = LdapClient;
