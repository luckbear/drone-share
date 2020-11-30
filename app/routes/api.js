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
    // const graduateList = await model.Graduates.findAll();
    // responseData.data = graduateList;
    // res.json(responseData);

    const graduateList = await model.Graduates.findAll(
        {
            attributes: ['city', 'lat', 'lng', [sequelize.fn('COUNT', sequelize.col('city')), 'count']],
            group: ['city', 'lat', 'lng'],
            raw: true
        }
    );
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

async function getEmPercentList(req, res, next) {
    const emPercentList = await model.Graduates.findAll(
        {
            attributes: ['emIndustry', [sequelize.fn('COUNT', sequelize.col('emIndustry')), 'count']],
            group: 'emIndustry',
            raw: true
        }
    );
    responseData.data = emPercentList;
    res.json(responseData);
}

async function getIndustryPercentList(req, res, next) {
    const emIndustryPercentList = await model.Companies.findAll(
        {
            attributes: ['comType', [sequelize.fn('COUNT', sequelize.col('comType')), 'count']],
            group: 'comType',
            raw: true
        }
    );
    responseData.data = emIndustryPercentList;
    res.json(responseData);
}

async function getCompanyList(req, res, next) {
    const companyList = await model.Companies.findAll(
        {
            attributes: ['city', 'lat', 'lng', [sequelize.fn('COUNT', sequelize.col('city')), 'count']],
            group: ['city', 'lat', 'lng'],
            raw: true
        }
    );
    responseData.data = companyList;
    res.json(responseData);
}

async function getExpertList(req, res, next) {
    const expertList = await model.Experts.findAll();
    responseData.data = expertList;
    res.json(responseData);
}

async function getIndustrieList(req, res, next) {
    const industryList = await model.Industries.findAll();
    responseData.data = industryList;
    res.json(responseData);
}

async function getLawList(req, res, next) {
    const lawList = await model.Law.findAll();
    responseData.data = lawList;
    res.json(responseData);
}

async function getNewsList(req, res, next) {
    const newsList = await model.News.findAll();
    responseData.data = newsList;
    res.json(responseData);
}



router.get('/graduateList', getGraduateList);
router.get('/emList', getEmList);
router.get('/classList', getClassList);
router.get('/teacherList', getTeacherList);
router.get('/emPercentList', getEmPercentList);
router.get('/industryPercentList', getIndustryPercentList);
router.get('/companyList', getCompanyList);
router.get('/expertList', getExpertList);
router.get('/industryList', getIndustrieList);
router.get('/lawList', getLawList);
router.get('/newsList', getNewsList);

module.exports = router;