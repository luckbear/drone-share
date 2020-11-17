const db = require('../db');

module.exports = db.defineModel('employments', {
    code: db.STRING(100),
    name: db.STRING(100),
    phone: db.STRING(100),
    authOrg: db.STRING(100),
    categoryGrade: db.STRING(100),
    levelGrade: db.STRING(100),
    info: db.STRING(100),
    emCode: db.STRING(100),
    releaseDate: db.STRING(100),
    driverGrade: db.STRING(100)
});