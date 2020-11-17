const express = require('express');
const router = express.Router();
const model = require('../model');

// model.sync();

let responseData = {};

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: '成功',
        data: null
    }
    next();
})


async function getGraduateList(req, res, next) {
    const graduateList = await model.Graduates.findAll();
    responseData.data = graduateList;
    res.json(responseData);
}

async function getEmList(req, res, next) {
    const emList = await model.Employments.findAll();
    responseData.data = emList;
    res.json(responseData);
}

async function getClassList(req, res, next) {
    const classList = await model.Classes.findAll();
    responseData.data = classList;
    res.json(responseData);
}

async function getTeacherList(req, res, next) {
    const teacherList = await model.Teachers.findAll();
    responseData.data = teacherList;
    res.json(responseData);
}

router.get('/graduateList', getGraduateList);
router.get('/emList', getEmList);
router.get('/classList', getEmList);
router.get('/teacherList', getEmList);

module.exports = router;