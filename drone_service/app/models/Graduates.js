const db = require('../db');

module.exports = db.defineModel('graduates', {
    code: db.STRING(100),
    name: db.STRING(100),
    sourceCode: db.STRING(100),
    licenseCode: db.STRING(100),
    authOrg: db.STRING(100),
    isEmployment: db.STRING(100),
    city: db.STRING(100),
    emIndustry: db.STRING(100),
    lng: db.STRING(100),
    lat: db.STRING(100),
});