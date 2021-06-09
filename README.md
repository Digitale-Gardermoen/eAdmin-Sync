# Eadmin-Sync

A simple node sync for syncing an SQL database against AD.

## Configuration

Here is an example `.env` file, this needs to be created in the root dir.

```.env
### Env and logging ###
# Can be prod
# anything else stops writing and sets loglevel to 4
# even if the loglevel is set to something else in .env
ENVIRONMENT = dev

# -1 Turn of logging
#  0 error
#  1 warn
#  2 info
#  3 log
#  4 debug
LOGLEVEL = 4

### Sql config ###
SQLUSERNAME = user
SQLPASSWORD = pass
SQLSERVER = localhost
SQLDATABASE = mydb
SQLTABLE = users
SQLTIMEOUT = 15000

### Cron config ###
CRONSCHEDULE = */10 * * * * *

### LDAP and query config ###
LDAP_URL = ldap://127.0.0.1:10389
LDAP_USERNAME = uid=admin,ou=system
LDAP_PASSWORD = secret
# Can be comma separated to search multiple DN's.
LDAP_QUERY_OPTS_BASEDN = ou=users,dc=wimpi,dc=net
LDAP_QUERY_FILTER = (objectClass=person)
LDAP_QUERY_PAGESIZE = 1000
ADUSERPROPERTIES = dn,sAMAccountName,displayName,mobile,telephoneNumber,mail
```

Here is an example `SyncConfig.json` file, this needs to be placed in `src/config/`.

```json
{
  "ActiveDirectory": {
    "fields": [
      "mail"
    ]
  },
  "Eadmin": {
    "fields": [
      "mobilenumber"
    ]
  }
}
```

Here is an example `TranslateFields.js` file, it needs to be placed in `src/models/`.

```javascript
/**
 * What fields should be translated to and from both systems.
 * @var
 */
const translateFields = {
  // database fields
  'username': 'sAMAccountName',
  'fullname': 'displayName',
  'email': 'mail',
  'telephone': 'telephoneNumber',
  'mobilephone': 'mobile',
  // AD fields
  'sAMAccountName': 'username',
  'displayName': 'fullname',
  'mail': 'email',
  'telephoneNumber': 'telephone',
  'mobile': 'mobilephone'
};

module.exports = translateFields;
```

Match the fields to each system.

## Documentation

To create docs use the JSDoc library and this command: `jsdoc -c .\doc.json -r`. This will create an `out` folder in the same directory which you can [serve](https://www.npmjs.com/package/serve) as a website.

The docs are surely an over-simplyfication of the actual process, most of which should be somewhat commented in the code.
