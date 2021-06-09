/**
 * @file Loggins.js
 * @description
 * This is the helper file for the better-logging library.
 * Only called once for setting correct settings.
 */
const config = require('../config/Configuration');
require('better-logging')(console);

if (config.environment === 'prod') console.logLevel = config.logLevel;
else console.logLevel = 4;