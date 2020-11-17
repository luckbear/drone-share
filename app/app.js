const express = require('express');
const apiRoute = require('./routes/api')

const app = express();

app.use('/',apiRoute);

app.listen(8081);

console.log('启动成功，运行在localhost:8081');




