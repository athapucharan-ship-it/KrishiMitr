'use strict';

// Route every /api/* request through the existing Express API application.
module.exports = require('../server/server').app;
