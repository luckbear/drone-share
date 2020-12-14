const db = require('../db');

module.exports = db.defineModel('companies', {
    code: db.STRING(100),
    name: db.STRING(100),
    city: db.STRING(100),
    comType: db.STRING(100),
    lat: db.STRING(100),
    lng: db.STRING(100),
});