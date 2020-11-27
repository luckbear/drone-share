const db = require('../db');

module.exports = db.defineModel('companies', {
    code: db.STRING(100),
    name: db.STRING(100),
    city: db.STRING(100),
    type: db.STRING(100),
});