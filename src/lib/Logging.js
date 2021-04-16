const config = require('../config/Configuration');
require('better-logging')(console);

if (config.environment === 'prod') console.logLevel = config.logLevel;
else console.logLevel = 4;