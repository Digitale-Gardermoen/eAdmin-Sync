const config = require('../config/Configuration');
const mongoose = require('mongoose');

const adSchema = require('../models/ADUser');
const eadminSchema = require('../models/EadminUser');

class MongoDB {
  constructor() {
    this.conn = mongoose.connect(
      config.mongooseHost, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //user: config.mongooseUsername,
        //pass: config.mongoosePassword,
        dbName: config.mongooseDbname
      },
      function (err) {
        if (err) console.error('Failed to connect to mongo', err);    // this might be changed to do some better errorhandling later...
      }
    );

    this.eadminUser = mongoose.model('eadminuser', eadminSchema);
    this.AdUser = mongoose.model('aduser', adSchema);
  }

  async upsertEadminUser(sLoginID, userObj) {
      return await this.eadminUser.updateMany(
        { sLoginID },
        { $set: userObj },
        { upsert: true }
      );
  }
  
  async upsertAdUser(sAMAccountName, userObj) {
      return await this.AdUser.updateMany(
        { sAMAccountName },
        { $set: userObj },
        { upsert: true }
      );
  }

  async fetchADUsers() {
    return await this.AdUser
      .find()
      .select('-_id -__v')
      .exec();
  }
  
  async fetchEadminUsers() {
    return await this.eadminUser
      .find()
      .select('-_id -__v')
      .exec();
  }

  async findADUser(sAMAccountName) {
    return await this.AdUser.findOne({sAMAccountName}).lean();
  }

  async findEadminUser(sLoginID) {
    return await this.eadminUser.findOne({sLoginID}).lean();
  }

  async deleteADUsers(arr) {
    return await this.AdUser.deleteMany({
      'sAMAccountName': { $nin: arr }
    });
  }
  
  async deleteEadminUsers(arr) {
    return await this.eadminUser.deleteMany({
      'sLoginID': { $nin: arr }
    });
  }

  disconnectdb() {
    mongoose.disconnect();
    return;
  }

}

module.exports = MongoDB;
