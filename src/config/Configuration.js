'use strict';
require('dotenv').config();

class Configuration {
  constructor() {
    this.config = {};

    this.config.mongooseHost = process.env.MONGOOSE_HOST;
    this.config.mongooseUsername = process.env.MONGOOSE_USERNAME;
    this.config.mongoosePassword = process.env.MONGOOSE_PASSWORD;
    this.config.mongooseDbname = process.env.MONGOOSE_DBNAME;

    this.config.sqlUser = process.env.SQLUSERNAME;
    this.config.sqlPassword = process.env.SQLPASSWORD;
    this.config.sqlServer = process.env.SQLSERVER;
    this.config.sqlDatabase = process.env.SQLDATABASE;
    this.config.sqlTable = process.env.SQLTABLE;

    this.config.schedule = process.env.CRONSCHEDULE;

    this.config.ldapUrl = process.env.LDAP_URL;
    this.config.ldapBaseDN = process.env.LDAP_BASEDN;
    this.config.ldapUsername = process.env.LDAP_USERNAME;
    this.config.ldapPassword = process.env.LDAP_PASSWORD;
    this.config.ldapQueryBaseDN = process.env.LDAP_QUERY_OPTS_BASEDN;
    this.config.ldapQueryFilter = process.env.LDAP_QUERY_FILTER;
    this.config.adUserProperties = process.env.ADUSERPROPERTIES;
  }
}

module.exports = new Configuration().config;
