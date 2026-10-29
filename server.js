'use strict';

// Vercel detects this root Express entry point and runs the exported app as a function.
require('express');
module.exports = require('./server/server').app;
