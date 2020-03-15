const userInfo = {
  userName: "", //String（3-10）
  password: "", //String(6-15)
  rePassword: "",
  contact: "",
  companyName: "",
  companyAddress: "",
  companyLocation: [21, 121],
  companyTypes: ["科研", "制造", "系统开发"],
  businessFields: ["应急", "救援", "水利"],

  province: "",
  city: "",
  district: "",
  droneData: [
    {
      droneTypes: "垂直起降",
      droneUsages: "气象探测",
      droneMaker: "ddsd",
      buyTime: "2020-03-15T16:00:00.000Z",
      isSale: "否",
      maxLoad: "dddd"
    }
  ],
  driverData: [
    {
      driverLicenceSource: "ASFC",
      type: "多旋翼",
      grade: "四",
      driverGrade: " 教员等级"
    }
  ],

  supplyInfo: {
    aerialData: [
      {
        name: "",
        type: "",
        area: "",
        resolution: "",
        precision: "",
        date: "",
        province: "",
        city: "",
        district: "",
        centerLatLng: [21, 121],
        region: [
          [21, 121],
          [23, 121],
          [24, 121]
        ],
        notes: ""
      }
    ],
    airspace: [
      {
        name: "",
        province: "",
        city: "",
        district: "",
        centerLatLng: [21, 121],
        region: [
          [21, 121],
          [23, 121],
          [24, 121]
        ],
        notes: ""
      }
    ],
    project: [
      {
        name: "",
        province: "",
        city: "",
        district: "",
        businessFields: "",
        centerLatLng: [21, 121],
        area: "",
        notes: ""
      }
    ]
  },
  demandInfo: {
    aerialData: [
      {
        name: "",
        type: "",
        area: "",
        resolution: "",
        precision: "",
        date: "",
        province: "",
        city: "",
        district: "",
        centerLatLng: [21, 121],
        notes: ""
      }
    ],
    airspace: [
      {
        name: "",
        province: "",
        city: "",
        district: "",
        centerLatLng: [21, 121],
        notes: ""
      }
    ],
    project: [
      {
        name: "",
        businessFields: "",
        province: "",
        city: "",
        district: "",
        centerLatLng: [21, 121],
        area: "",
        notes: ""
      }
    ],
    droneData: [
      {
        droneTypes: "垂直起降",
        droneUsages: "气象探测"
      }
    ],
    driverData: [
      {
        driverLicenceSource: "ASFC",
        type: "多旋翼",
        grade: "四",
        driverGrade: " 教员等级"
      }
    ]
  }
};
