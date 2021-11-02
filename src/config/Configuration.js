'use strict';
require('dotenv').config();

class Configuration {
  constructor() {
    this.config = {};

    this.config.environment = process.env.ENVIRONMENT || dev;
    this.config.logLevel = Number(process.env.LOGLEVEL) || 2;

    this.config.sqlUser = process.env.SQLUSERNAME;
    this.config.sqlPassword = process.env.SQLPASSWORD;
    this.config.sqlServer = process.env.SQLSERVER;
    this.config.sqlDatabase = process.env.SQLDATABASE;
    this.config.sqlTableOrView = process.env.SQLTABLEORVIEW;
    this.config.sqlUpdateTable = process.env.SQLUPDATETABLE;
    this.config.sqlTimeout = Number(process.env.SQLTIMEOUT) || 15000;
    this.config.sqlUseEncrypt = process.env.SQLUSEENCRYPT || true;
    this.config.sqlTrustCertificate = process.env.SQLTRUSTCERTIFICATE || false;

    this.config.schedule = process.env.CRONSCHEDULE;

    this.config.ldapUrl = process.env.LDAP_URL;
    this.config.ldapBaseDN = process.env.LDAP_BASEDN;
    this.config.ldapUsername = process.env.LDAP_USERNAME;
    this.config.ldapPassword = process.env.LDAP_PASSWORD;
    this.config.ldapQueryBaseDN = process.env.LDAP_QUERY_OPTS_BASEDN;
    this.config.ldapQueryFilter = process.env.LDAP_QUERY_FILTER;
    this.config.ldapPageSize = process.env.LDAP_QUERY_PAGESIZE;
    this.config.adUserProperties = process.env.ADUSERPROPERTIES;
  }
}

module.exports = new Configuration().config;
