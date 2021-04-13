'use strict';
const sql = require('mssql');
const Mongo = require('./Mongo');
const config = require('../config/Configuration');
const EadminTable = require('../models/EadminSql.js');

const sqlConfig = {
  user: config.sqlUser,
  password: config.sqlPassword,
  server: config.sqlServer,
  database: config.sqlDatabase
}

class EadminLoader {
  async getUsers() {
    return new Promise(async (res, rej) => {
      try {
        const mongo = new Mongo();

        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query('SELECT * FROM ' + config.sqlTable);
        const resultSize = result.recordset.length;

        while (result.recordset.length > 0) {
          let u = result.recordset.pop();
          mongo.upsertEadminUser(u.sLoginID, u);
        }

        res({ resultSize, endSize: result.recordset.length });
      } catch (err) {
        console.error(err);
        rej("Caught error");
      }
    });
  }

  async setUsers(users) {
    const pool = await sql.connect(sqlConfig);

    Object.keys(users).forEach(async (user) => {
      try {
        let statement = "";
        statement += `UPDATE ${config.sqlTable} `;
        statement += `SET`;

        Object.keys(users[user]).forEach((field) => {
          statement += ` ${field} = '${users[user][field]}',`;
        });

        statement = statement.slice(0, -1);
        statement += ` WHERE sLoginID = '${user}'`;

        const result = await pool.request().query(statement);
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = EadminLoader;
