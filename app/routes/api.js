const express = require('express');
const router = express.Router();
const model = require('../model');
const sequelize = require('sequelize');

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

    // const graduateList = await model.Graduates.findAll(
    //     {
    //         attributes: ['city', [sequelize.fn('COUNT', sequelize.col('city')),'count']],
    //         group: 'city',
    //         raw: true
    //     }
    // );
    // responseData.data = graduateList;
    // res.json(responseData);
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

async function getEmPercentList(req, res, next) {
    const emPercentList = await model.Graduates.findAll(
        {
            attributes: ['emIndustry', [sequelize.fn('COUNT', sequelize.col('emIndustry')),'count']],
            group: 'emIndustry',
            raw: true
        }
    );
    responseData.data = emPercentList;
    res.json(responseData);
}



router.get('/graduateList', getGraduateList);
router.get('/emList', getEmList);
router.get('/classList', getClassList);
router.get('/teacherList', getTeacherList);
router.get('/emPercentList', getEmPercentList);

module.exports = router;