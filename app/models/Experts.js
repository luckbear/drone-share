const db = require('../db');

module.exports = db.defineModel('experts', {
    code: db.STRING(100),
    name: db.STRING(100),
    company: db.STRING(100),
    grade: db.STRING(100),
});