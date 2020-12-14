const db = require('../db');

module.exports = db.defineModel('teachers', {
    code: db.STRING(100),
    name: db.STRING(100),
    imgPath: db.STRING(100),
    teachingAge: db.STRING(100),
    classType: db.STRING(100),
    introduction: db.STRING(100)
});