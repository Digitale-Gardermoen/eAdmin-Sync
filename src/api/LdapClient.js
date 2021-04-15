'use strict';
const ldap = require('ldapjs');
const config = require('../config/Configuration');

class LdapClient {
  constructor() {
    this.client = ldap.createClient({
      url: [ config.ldapUrl ]
    });

    this.client.on('error', (err) => { if (err) console.error(err); });
    this.client.bind(config.ldapUsername, config.ldapPassword, (err) => { if (err) console.error(err); });
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
