const express = require('express');
const router = express.Router();
const model = require('../model');
const sequelize = require('sequelize');
const { Op } = sequelize;

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

//毕业生行业聚合
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

async function getClassList(req, res, next) {
  const limit = Number(req.query.pageSize);
  const offset = (req.query.pageNum - 1) * limit;
  const keyWord = req.query.keyWord;
  const where = {};
  // keyWord && Object.assign(where, { title: { [Op.substring]: keyWord } });
  const industryList = await model.Classes.findAndCountAll({ where, limit, offset });
  responseData.data = industryList.rows;
  responseData.count = industryList.count;
  res.json(responseData);
}

async function getEmList(req, res, next) {
  const limit = Number(req.query.pageSize);
  const offset = (req.query.pageNum - 1) * limit;
  const keyWord = req.query.keyWord;
  const where = {};
  // keyWord && Object.assign(where, { title: { [Op.substring]: keyWord } });
  const industryList = await model.Employments.findAndCountAll({ where, limit, offset });
  responseData.data = industryList.rows;
  responseData.count = industryList.count;
  res.json(responseData);
}

async function getTeacherList(req, res, next) {
  const teacherList = await model.Teachers.findAll();
  responseData.data = teacherList;
  res.json(responseData);
}

//按公司类型聚合
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

//按城市聚合
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


async function getIndustrieList(req, res, next) {
  const limit = Number(req.query.pageSize);
  const offset = (req.query.pageNum - 1) * limit;
  const keyWord = req.query.keyWord.trim();
  const where = {};
  keyWord && Object.assign(where, { title: { [Op.substring]: keyWord } });
  const industryList = await model.Industries.findAndCountAll({ where, limit, offset });
  responseData.data = industryList.rows;
  responseData.count = industryList.count;
  res.json(responseData);
}

async function getLawList(req, res, next) {
  const limit = Number(req.query.pageSize);
  const offset = (req.query.pageNum - 1) * limit;
  const keyWord = req.query.keyWord.trim();
  const where = {};
  keyWord && Object.assign(where, { title: { [Op.substring]: keyWord } });
  const industryList = await model.Law.findAndCountAll({ where, limit, offset });
  responseData.data = industryList.rows;
  responseData.count = industryList.count;
  res.json(responseData);
}

async function getNewsList(req, res, next) {
  const limit = Number(req.query.pageSize);
  const offset = (req.query.pageNum - 1) * limit;
  const keyWord = req.query.keyWord.trim();
  const where = {};
  keyWord && Object.assign(where, { title: { [Op.substring]: keyWord } });
  const industryList = await model.News.findAndCountAll({ where, limit, offset });
  responseData.data = industryList.rows;
  responseData.count = industryList.count;
  res.json(responseData);
}

async function getExpertList(req, res, next) {
  const limit = Number(req.query.pageSize);
  const offset = (req.query.pageNum - 1) * limit;
  const keyWord = req.query.keyWord.trim();
  const where = {};
  keyWord && Object.assign(where, { name: { [Op.substring]: keyWord } });
  const industryList = await model.Experts.findAndCountAll({ where, limit, offset });
  responseData.data = industryList.rows;
  responseData.count = industryList.count;
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