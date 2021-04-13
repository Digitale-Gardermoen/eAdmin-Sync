'use strict';
const sql = require('mssql').TYPES;

const EadminSql = {
  "sLoginID": sql.VarChar(50),
  "sName": sql.VarChar(50),
  "sEMail": sql.VarChar(50),
  "sPhone1": sql.VarChar(50),
  "sPhone2": sql.VarChar(50)
};

module.exports = EadminSql;