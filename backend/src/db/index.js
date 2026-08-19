require('dotenv').config();

const mode = process.env.DB_MODE || 'pg';

if (mode === 'memory') {
  module.exports = require('./memory');
} else {
  module.exports = require('./pg');
}
