'use strict';
const sql = require('mssql');
const config = require('../config/Configuration');

const sqlConfig = {
  user: config.sqlUser,
  password: config.sqlPassword,
  server: config.sqlServer,
  database: config.sqlDatabase,
  options: {
    enableArithAbort: false
  },
  connectionTimeout: config.sqlTimeout
}

class EadminLoader {
  async getUsers() {
      try {
        const pool = await sql.connect(sqlConfig);
        console.debug('[EA] Querying', config.sqlDatabase, 'with statement: SELECT * FROM', config.sqlTable)
        const res = await pool.request().query('SELECT * FROM ' + config.sqlTable);
        console.debug('[EA] Found', res.recordset.length, 'users');
        return res.recordset;
      } catch (err) {
        console.error(err);
      }
  }

  async setUsers(users) {
    const pool = await sql.connect(sqlConfig);

    Object.keys(users).forEach(async (user) => {
      try {
        console.debug('[EA] Creating statement for user:', user);
        let statement = "";
        statement += `UPDATE ${config.sqlTable} `;
        statement += `SET`;

        Object.keys(users[user]).forEach((field) => {
          statement += ` ${field} = '${users[user][field]}',`;
        });

        statement = statement.slice(0, -1);
        statement += ` WHERE sLoginID = '${user}'`;

        console.debug('[EA] Got statement:', statement);

        if (config.environment == 'prod') {
          pool.request().query(statement);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = EadminLoader;
