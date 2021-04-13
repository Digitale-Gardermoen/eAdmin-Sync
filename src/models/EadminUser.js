const Schema = require('mongoose').Schema;

const schema = new Schema({
  sLoginID: String,
  sName: String,
  sPhone2: String,
  sPhone1: String,
  sEMail: String
}, {
  timestamps: true
});

module.exports = schema;
