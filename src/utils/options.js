//公司类型

const companyOptions = [
  {
    name: "companyTypes",
    label: "公司类型",
    value: ["科研", "制造", "系统开发", "销售", "培训", "行业应用", "科普教育"]
  },
  {
    name: "businessFields",
    label: "业务范围",
    value: [
      "应急",
      "救援",
      "水利",
      "电力",
      "植保",
      "环保",
      "安防",
      "勘察",
      "测绘",
      "航拍"
    ]
  },

  {
    name: "droneUsages",
    label: "无人机用途",
    value: [
      "抢险救灾",
      "森林防火",
      "地理测绘",
      "气象探测",
      "空中应急通信",
      "电力巡线",
      "航空物流"
    ]
  }
];

const companySource = [
  {
    name: "droneTypes",
    label: "无人机数量",
    value: [{ 多旋翼: 0 }, { 固定翼: 0 }, { 垂直起降: 0 }]
  },
  {
    name: "driverGrades",
    label: "飞手数量",
    value: [{ 视距内等级: 0 }, { 超视距等级: 0 }, { 教员等级: 0 }]
  }
];

export { companyOptions,companySource };
