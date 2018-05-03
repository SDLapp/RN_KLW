

/**
 * 全局api
 * liz
 * 2016.12.19
 */
const api = {
  crawlerapi: 'http://172.16.12.35/WebApi/api/Values/',
  // NOTE：用户相关api
  system: {
    login: '/rest/Author/IsLogins', // 登陆
    resetpwd: '/rest/Author/ResetPwd', // 修改密码
    contactlist: '/rest/DirectoriesApi/getDirectories/',//通讯录
    nettest: '/rest/Author/SwitchNewWork/',
    systemconfig: '/rest/SysConfig/GetAppSettings/',
    GetPolluntType: '/rest/MenuInfo/GetPolluntType',//获取污染物类型（颗粒物、标准站）
  },
  // NOTE: 全文检索相关api
  monitorpoint: {
    monitortype: '/rest/MenuInfo/GetPolluntType/',
    pointlist: '/rest/OutputAsPointApi/GetPointsByPollutantType/',
    singlepoint: '/rest/OutputAsPointApi/GetPointBaseInfo/', // 单个监测点查询
    CollectPoint: '/rest/OutputAsPointApi/CollectPointInfo/',
    collectpointlist: '/rest/OutputAsPointApi/GetCollectInfo/',
    uploadimage: '/rest/OutputAsPointApi/AddPointImg/',
    legend: '/rest/OutputAsPointApi/GetWaterLevels/',
    GetPointNewRealTimeDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewRealTimeDataByPollutantType',    //数据一览 实时数据
    GetPointNewMinuteDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewMinuteDataByPollutantType',    //数据一览 分钟数据
    GetPointNewHourDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewHourDataByPollutantType',    //数据一览 小时数据
    GetPointNewDayDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewDayDataByPollutantType',    //数据一览 日数据
    GetLastHourData:'/rest/ControlData/GetLastHourData',//国控点小时站点列表
    GetLastDayData:'/rest/ControlData/GetLastDayData',
    GetPoint:'/rest/ControlData/GetPoint',//获取国控点
    GetRealTimeData:'/rest/RealTime/GetRealTimeData', //根据排口获取一段时间的实时数据,详情页面
    GetMinuteData:'/rest/Minute/GetMinuteData', //根据排口获取一段时间的分钟数据,详情页面
    GetHourDatas:'/rest/Hour/GetHourSinglePollutantData',//获取小时数据,详情页面
    GetDayDatas:'/rest/Day/GetDaySinglePollutantData',//获取日均数据,详情页面
    GetZQDayData:'/rest/ControlData/GetZQDayData',//获取国控点日均数据,详情页面
    GetZQHourData:'/rest/ControlData/GetZQHourData',//获取国控点小时数据,详情页面
  },
  wholesearch: {
    fulltextsearch: '/rest/OutputAsPointApi/GetLxSearchResult/', // 全文检索
    searchhistory: '/rest/OutputAsPointApi/GetSearchContent/',
    savesearchtext: '/rest/OutputAsPointApi/AddSearchContent/',
  },
  monitortarget: {
    targetother: '/rest/OutputAsPointApi/GetEntOtherInfo/',
    uploadimage: '/rest/OutputAsPointApi/AddEntImg/',
  },
  // NOTE: 监控相关api
  monitordata: {
    lastData: '/rest/OutputAsPointApi/GetPointNewRealTimeData/',
    realtimeData: '/rest/RealTime/GetRealTimeData/',
    minuteData: '/rest/Minute/GetMinuteData/',
    hourData: '/rest/Hour/GetHourSinglePollutantData/',
    dayData: '/rest/Day/GetDaySinglePollutantData/',
    pollutantCodes:'/rest/OutputAsPointApi/GetPollutantCodes',//获取污染源种类
    GetPollutantRelated:'/rest/PollutantRelatedApi/GetPollutantRelated', //监测因子标准
  },
  alarm: {
    awaitchecklist: '/rest/AlarmDealInfoApi/GetAllPointExceptionInfo/',
    verifiedlist: '/rest/AlarmDealInfoApi/GetVerifiedExceptionInfo/',
    alarmlist: '/rest/AlarmDealInfoApi/GetAllExceptionInfo/',
    postfeedback: '/rest/AlarmDealInfoApi/AddEarlyWarningFeedback/',
    uploadimage: '/rest/AlarmDealInfoApi/UploadImage/',
    feedbackdetail: '/rest/AlarmDealInfoApi/GetEarlyWarningByVerify/',
    feddbackalarmdetail: '/rest/AlarmDealInfoApi/GetVerifyInfoByVerifyID/',
  },
};

export default api;
