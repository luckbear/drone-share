const db = require('../db');

module.exports = db.defineModel('law', {
    code: db.STRING(100),
    title: db.STRING(100),
    date: db.STRING(100),
    content: db.STRING(100),
    author: db.STRING(100),
    attachment: db.STRING(100),
});