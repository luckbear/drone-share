const userInfo = {
  userName: "", //String（3-10）
  password: "", //String(6-15)
  rePassword: "",
  contact: "",
  companyName: "",
  companyAddress: "",
  companyLocation: "",
  companyTypes: ["科研", "制造", "系统开发"],
  businessFields: ["应急", "救援", "水利"],
  droneTypes: { 多旋翼: 6, 固定翼: 0, 垂直起降: 0 },
  droneUsages: ["电力巡线", "航空物流"],
  driverLicenceSource: { dji: 7, aopo: 3 },
  supplyInfo: {
    aerialData: [
      {
        name: "",
        type: "",
        area: "",
        resolution: "",
        precision: "",
        date: "",
        administrativDivision: "",
        centerLat: 21, //Number
        centerLng: 121, //Number
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
        administrativDivision: "",
        centerLat: 21, //Number
        centerLng: 121, //Number
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
        administrativDivision: "",
        businessFields: "",
        centerLat: 21, //Number
        centerLng: 121, //Number
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
        administrativDivision: "",
        centerLat: 21, //Number
        centerLng: 121, //Number
        notes: ""
      }
    ],
    airspace: [
      {
        name: "",
        administrativDivision: "",
        centerLat: 21, //Number
        centerLng: 121, //Number
        notes: ""
      }
    ],
    project: [
      {
        name: "",
        businessFields: "",
        administrativDivision: "",
        centerLat: 21, //Number
        centerLng: 121, //Number
        area: "",
        notes: ""
      }
    ],
    droneTypes: [{ 多旋翼: 6, 固定翼: 0, 垂直起降: 0 }],
    driverLicenceSource: [{ dji: 7, aopo: 3 }]
  }
};
