const db = require('../db');

module.exports = db.defineModel('classes', {
    code: db.STRING(100),
    beginDate: db.STRING(100),
    duration: db.STRING(100),
    title: db.STRING(100),
    authOrg: db.STRING(100),
    info: db.STRING(100),
    emCode: db.STRING(100),
    releaseDate: db.STRING(100)
});