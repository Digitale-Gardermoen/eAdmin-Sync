const Schema = require('mongoose').Schema;

const schema = new Schema({
  dn: String,
  displayName: String,
  sAMAccountName: String,
  mobile: String,
  telephoneNumber: String,
  mail: String
}, {
  timestamps: true
});

module.exports = schema;
