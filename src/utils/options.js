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
  }
];

const filterOptions = [
  {
    prop: "aerialDataType",
    label: "数据类型",
    content: { options: ["正射影像", "倾斜摄影"] }
  },
  {
    prop: "businessFields",
    content: {
      options: [
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
    }
  }
];

const droneFields = [
  { type: "index", label: "序号" },
  {
    prop: "droneType",
    label: "无人机类型",
    content: {
      type: "el-select",
      options: ["多旋翼", "固定翼", "垂直起降"],
      attrs: {
        size: "mini"
      }
    }
  },
  {
    prop: "droneUsage",
    label: "无人机用途",
    content: {
      type: "el-select",
      options: [
        "抢险救灾",
        "森林防火",
        "地理测绘",
        "气象探测",
        "空中应急通信",
        "电力巡线",
        "航空物流"
      ],
      attrs: {
        size: "mini"
      }
    }
  },
  {
    prop: "droneMaker",
    label: "厂家",
    content: {
      type: "el-input",
      attrs: {
        size: "mini"
      }
    }
  },
  {
    prop: "buyTime",
    label: "购置日期",
    content: {
      type: "el-date-picker",
      attrs: {
        size: "mini",
        type: "date"
      }
    }
  },
  // {
  //   prop: "isSale",
  //   label: "是否在售"
  // content: {
  //   type: "el-radio-group",
  //   options: ["是", "否"],
  //   attrs: {
  //     size: "mini"
  //   }
  // }
  // },
  {
    prop: "maxLoad",
    label: "最大载荷",
    content: {
      type: "el-input",
      attrs: {
        size: "mini"
      }
    }
  }
];

const driverFields = [
  {
    type: "index",
    label: "序号"
  },
  {
    prop: "driverLicenceSource",
    label: "授权机构",
    content: {
      type: "el-select",
      options: ["AOPA", "UTC", "ASFC"],
      attrs: {
        size: "mini"
      }
    }
  },
  {
    prop: "driverType",
    label: "类别等级",
    content: {
      type: "el-select",
      options: [
        "固定翼",
        "无人直升机",
        "多旋翼",
        "垂直起降固定翼",
        "无人自转旋翼机",
        "无人飞艇",
        "其他"
      ],
      attrs: {
        size: "mini"
      }
    }
  },
  {
    prop: "grade",
    label: "级别等级",
    content: {
      type: "el-select",
      options: ["一", "二", "三", "四", "五", "六", "七", "八", "九"],
      attrs: {
        size: "mini"
      }
    }
  },
  {
    prop: "driverGrade",
    label: "驾驶员等级",
    content: {
      type: "el-select",
      options: ["视距内等级", " 超视距等级", " 教员等级"],
      attrs: {
        size: "mini"
      }
    }
  }
];

const rules = {
  drones: {
    droneType: [{ required: true, message: "无人机类型必选" }],
    droneUsage: { required: true, message: "无人机用途必选" }
  },
  drivers: {
    driverLicenceSource: { required: true, message: "授权机构必选" },
    driverType: { required: true, message: "类别等级必选" },
    grade: { required: true, message: "级别等级必选" },
    driverGrade: { required: true, message: "驾驶员必选" }
  }
};

export { companyOptions, filterOptions, droneFields, driverFields, rules };
