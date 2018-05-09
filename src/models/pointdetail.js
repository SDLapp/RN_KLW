import { Toast } from 'antd-mobile';
import moment from 'moment';

import {Model} from '../dvapack'
import * as pointdetailService  from '../services/pointdetailService'
import * as datapreviewService  from '../services/datapreviewService'
import {shishi,fenzhong,xiaoshi,ri,klw} from '../config/globalconst'
import {
    getRealTime,
    getHourTime,
    formatDateString,
    getGKRealTime,
    getDayTime,
    getMinuteTime,} from '../utils/HistoryDataTimeUtils'
import { NavigationActions } from '../utils';
import {doRepairData,repairDataOfGK} from '../utils/RepairData'
import {handlePollutantData,getComparePollutantDataList} from '../utils/DetailLogic'

export default Model.extend({
    namespace:'pointdetail',
    state:{
        PollutantData:[],
        chartData:[],
        Pollutants:[],
        ComparePointData:[],
        CompareData:[],
        PollutantSelect:0,
        ServiceType:2,
        ticks:[],
        chartDomain:[0,10],
        item:null,
        compareItem:null,
        selectDate:null,
        searchType:'xiaoshi',
        validDataCount:0,
        validCompareDataCount:0,
        isRefreshing:false,
        firstLoading:false,
    },
    reducers:{
        
    },
    subscriptions:{
        setupSubscriber({ dispatch, listen }) {
            listen({
                PointDetail: ({ params:{item} }) => {
                    // console.log('setupSubscriber');
                    dispatch({ type: 'getPollutantRelated',
                        payload: {item:item,},
                    });
                },
            });
          },
    },
    effects:{
        //小时数据
        *getHourSinglePollutantData({ payload: {item,time,Pollutant} }, { update, call, put,select,take }){
            const { user } = yield select(state => state.app);
            let PollutantData = [];
            const { timeSpan,Pollutants,PollutantSelect,ServiceType,searchType } = yield select(state => state.pointdetail);
            Pollutant = Pollutants[PollutantSelect];;
            if (item.tag == '国控') {
                //GroupID
                PollutantData =  yield call(pointdetailService.getZQHourData, 
                    {user,DGIMN:item.DGIMN,BeginTime:timeSpan.BeginTime,
                        EndTime:timeSpan.EndTime,
                });
            } else {
                
                PollutantData =  yield call(pointdetailService.GetHourDatas, 
                                    {user,DGIMN:item.DGIMN,BeginTime:timeSpan.BeginTime,
                                        EndTime:timeSpan.EndTime,pollutantType:Pollutant.PollutantName,
                                        PollutantCode:Pollutant.PollutantCode,
                                });
            } 
            
            let {tempArray,listArray} = doRepairData({data:PollutantData,ServiceType,searchType,
                                        'tag':item.tag,timeSpan,'code':Pollutant.PollutantCode
                                        ,timeFun:(item)=>{
                                            item._MonitorTime = item.MonitorTime.substring(0,(item.MonitorTime.length-3));
                                        }});
            listArray.reverse();

            let {ticks,chartData, chartDomain,validDataCount,} 
                = handlePollutantData({'PollutantData':tempArray,'ServiceType':2,'tag':item.tag,
                                        'PollutantCode':Pollutants[PollutantSelect].PollutantCode});
            yield update ({
                'selectDate':timeSpan.str,'PollutantData':listArray,
                ticks,chartData,chartDomain,validDataCount,
                'CompareData':[],'isRefreshing':false,
            });
        },
        //实时
        *GetRealTimeData({ payload: {item,time,Pollutant} }, { update, call, put,select,take }){
            let PollutantData = [],tempArray,listArray;
            const { user } = yield select(state => state.app);
            const { timeSpan,Pollutants,PollutantSelect,ServiceType,searchType } = yield select(state => state.pointdetail);
            yield update({'selectDate':time.str});
            if (item.tag == '国控') {
                PollutantData =  yield call(pointdetailService.getZQHourData, 
                    {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,
                });
            } else {
                Pollutant = Pollutants[PollutantSelect];
                PollutantData =  yield call(pointdetailService.GetRealTimeData, 
                    {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,pollutantType:Pollutant.PollutantName,
                        PollutantCode:Pollutant.PollutantCode,
                });
            }
            let code = Pollutants[PollutantSelect].PollutantCode;
            if (item.tag == '国控') {
                let {tempArray:_tempArray,listArray:_listArray} = repairDataOfGK({data:PollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
                    ,timeFun:(item)=>{
                        item._MonitorTime = item.MonitorTime;
                    }});
                tempArray=_tempArray;listArray=_listArray;
            } else {
                let {tempArray:_tempArray,listArray:_listArray} = doRepairData({data:PollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
                    ,timeFun:(item)=>{
                        item._MonitorTime = item.MonitorTime;
                    }});
                tempArray=_tempArray;listArray=_listArray;
            }
            
            listArray.reverse();
            yield update({'PollutantData':[]});
            yield update({'PollutantData':listArray});
            //补充数据 结束
            let {ticks,chartData, chartDomain,validDataCount,} 
                = handlePollutantData({'PollutantData':tempArray,'ServiceType':0,'tag':item.tag,
                                        'PollutantCode':Pollutants[PollutantSelect].PollutantCode});
            yield update ({
                ticks,chartData,chartDomain,validDataCount,
                'CompareData':[],'isRefreshing':false,
            });
        },
        //分钟
        *GetMinuteData({ payload: {item,time,Pollutant} }, { update, call, put,select,take }){
            let PollutantData = [],tempArray,listArray;
            const { user } = yield select(state => state.app);
            const { timeSpan,Pollutants,PollutantSelect,ServiceType,searchType } = yield select(state => state.pointdetail);
            yield update({'selectDate':time.str});
            if (item.tag == '国控') {
                PollutantData =  yield call(pointdetailService.getZQHourData, 
                    {user,DGIMN:item.DGIMN,BeginTime:timeSpan.BeginTime,
                        EndTime:timeSpan.EndTime,
                });
            } else {
                Pollutant = Pollutants[PollutantSelect];
                PollutantData =  yield call(pointdetailService.GetMinuteData, 
                    {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,pollutantType:Pollutant.PollutantName,
                        PollutantCode:Pollutant.PollutantCode,
                });
            }
            let code = Pollutants[PollutantSelect].PollutantCode;
            if (item.tag == '国控') {
                let {tempArray:_tempArray,listArray:_listArray} = repairDataOfGK({data:PollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
                    ,timeFun:(item)=>{
                        item._MonitorTime = item.MonitorTime;
                    }});
                tempArray=_tempArray;listArray=_listArray;
            } else {
                let {tempArray:_tempArray,listArray:_listArray} = doRepairData({data:PollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
                    ,timeFun:(item)=>{
                        item._MonitorTime = item.MonitorTime.substring(0,(item.MonitorTime.length-3));
                    }});
                tempArray=_tempArray;listArray=_listArray;
            }
            listArray.reverse();
            //补充数据 结束
            yield update({'PollutantData':[]});
            yield update({'PollutantData':listArray});

            let {ticks,chartData, chartDomain,validDataCount,} 
                = handlePollutantData({'PollutantData':tempArray,'ServiceType':1,'tag':item.tag,
                                        'PollutantCode':Pollutants[PollutantSelect].PollutantCode});
            yield update ({
                ticks,chartData,chartDomain,validDataCount,
                'CompareData':[],'isRefreshing':false,
            });
        },
        //日均
        *GetDayDatas({ payload: {item,time,Pollutant} }, { update, call, put,select,take }){
            let PollutantData = [];
            const { timeSpan,Pollutants,PollutantSelect,ServiceType,searchType } = yield select(state => state.pointdetail);
            //在不需要展示污染物的位置，调用查询方法，不传递污染物信息，由后台控制
            yield update({'selectDate':time.str});
            const { user } = yield select(state => state.app);
            if (item.tag == '国控') {
                PollutantData =  yield call(pointdetailService.getZQDayData, 
                    {user,DGIMN:item.DGIMN,BeginTime:timeSpan.BeginTime,
                        EndTime:timeSpan.EndTime,
                });
            } else {
                Pollutant = Pollutants[PollutantSelect];
                PollutantData =  yield call(pointdetailService.GetDayDatas, 
                    {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,pollutantType:Pollutant.PollutantName,
                        PollutantCode:Pollutant.PollutantCode,
                });
            }
            let code = Pollutants[PollutantSelect].PollutantCode;
            let {tempArray,listArray} = doRepairData({data:PollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
                            ,timeFun:(item)=>{
                                item._MonitorTime = item.MonitorTime.split(' ')[0];
                            }});
            listArray.reverse();
            yield update({'PollutantData':[]});
            yield update({'PollutantData':listArray});

            let {ticks,chartData, chartDomain,validDataCount,} 
                = handlePollutantData({'PollutantData':tempArray,'ServiceType':3,'tag':item.tag,
                                        'PollutantCode':Pollutants[PollutantSelect].PollutantCode});
            yield update ({
                ticks,chartData,chartDomain,validDataCount,
                'CompareData':[],'isRefreshing':false,
            });
        },
        //初始化数据加载
        *getPollutantRelated({ payload: {item} }, { update, call, put,select,take }){
            const { user } = yield select(state => state.app);
            let Pollutants = [];
            if (item.tag == '国控') {
                Pollutants = [
                    {
                        PollutantCode:"a34004",
                        PollutantName:"PM2.5",
                        Unit:"μg/m³",
                    },{
                        PollutantCode:"a34002",
                        PollutantName:"PM10",
                        Unit:"μg/m³",
                    }
                ]
            } else {
                Pollutants = yield call(pointdetailService.GetPollutantRelated, 
                    {user,DGIMN:item.DGIMN,type:item.type,});
                const { selectedPolluntType } = yield select(state => state.app);
                if (selectedPolluntType == klw) {
                    Pollutants = Pollutants.filter(todo=>{
                        //a01001"温度"  a01002"湿度"
                        if (todo['PollutantCode']=='a01001'||todo['PollutantCode']=='a01002') {
                            return false
                        } else {
                            return true;
                        }
                    })
                }
            }
            let {PollutantSelect} = yield select(state => state.pointdetail);
            //没有污染物可能导致崩溃
            if (Pollutants.length>0) {
                let date = new Date();
                date.setTime(date.getTime()-60*60*1000);
                let time = getHourTime(date);
                let timeSpan = time,ServiceType = 2,searchType = 'xiaoshi',
                PollutantSelect = 0;

                let PollutantData = [];
                Pollutant = Pollutants[PollutantSelect];;
                if (item.tag == '国控') {
                    //GroupID
                    PollutantData =  yield call(pointdetailService.getZQHourData, 
                        {user,DGIMN:item.DGIMN,BeginTime:timeSpan.BeginTime,
                            EndTime:timeSpan.EndTime,
                    });
                } else {
                    
                    PollutantData =  yield call(pointdetailService.GetHourDatas, 
                                        {user,DGIMN:item.DGIMN,BeginTime:timeSpan.BeginTime,
                                            EndTime:timeSpan.EndTime,pollutantType:Pollutant.PollutantName,
                                            PollutantCode:Pollutant.PollutantCode,
                                    });
                } 
                
                let {tempArray,listArray} = doRepairData({data:PollutantData,ServiceType,searchType,
                                            'tag':item.tag,timeSpan,'code':Pollutant.PollutantCode
                                            ,timeFun:(item)=>{
                                                item._MonitorTime = item.MonitorTime.substring(0,(item.MonitorTime.length-3));
                                            }});
                listArray.reverse();

                let {ticks,chartData, chartDomain,validDataCount,} 
                    = handlePollutantData({'PollutantData':tempArray,'ServiceType':2,'tag':item.tag,
                                            'PollutantCode':Pollutants[PollutantSelect].PollutantCode});
                yield put('getBdPoints',{ 
                    item:item,
                    Pollutant:Pollutants[PollutantSelect] 
                });
                yield take('getBdPoints/@@end');
                yield update ({
                    'timeSpan':time,Pollutants,ServiceType:2,
                    searchType:'xiaoshi',PollutantSelect:0,item,
                    'selectDate':timeSpan.str,'PollutantData':listArray,
                    ticks,chartData,chartDomain,validDataCount,
                    'CompareData':[],'isRefreshing':false,
                    'firstLoading':true,
                });
            } else {
                Toast.info('该监测点没有监测项！', 2, null, false);
                yield put(NavigationActions.back());
            }
        },
        *getBdPoints({ payload: {item,Pollutant} }, { update, call, put,select }){
            const { selectedPolluntType,user } = yield select(state => state.app);
            const { searchType } = yield select(state => state.pointdetail);
            //Latitude/Longitude
            // let result = yield call(pointdetailService.GetSystemPoints,{ 
            //     pollutantType:selectedPolluntType,
            //     searchTime:formatDateString(new Date()),
            //     GroupID:item.GroupID,
            // });
            let {pointBeens:result} = yield select(state => state.datapreview);
            // let GKpointBeens = {};
            // if (searchType == 'xiaoshi') {
            //     GKpointBeens =  yield call(datapreviewService.getLastHourData, 
            //         {type:selectedPolluntType,user,'searchTime':item.Times,mTag:xiaoshi,GroupID:item.GroupID});
            // } else if (searchType == 'ri') {
            //     GKpointBeens =  yield call(datapreviewService.getLastHourData, 
            //         {type:selectedPolluntType,user,'searchTime':item.Times,mTag:ri,GroupID:item.GroupID});
            // }
            // result = GKpointBeens.concat(result);
            result = result.filter(todo=>{
                return todo.GroupID==item.GroupID
                &&todo[Pollutant.PollutantCode]!=undefined
                &&todo[Pollutant.PollutantCode]!=undefined
                &&todo.DGIMN!=item.DGIMN;
            });
            result.reverse();
            yield update({ComparePointData:result});
        },
        *getHourBdData({ payload: {item,compareItem,time,Pollutant} }, { update, call, put,select,take }){
            const { timeSpan,Pollutants,PollutantSelect,ServiceType,searchType } = yield select(state => state.pointdetail);
            if (!compareItem) {
                const { compareItem:original } = yield select(state => state.pointdetail);
                compareItem = original;
            } else {
                yield update({compareItem});
            }
            const { user } = yield select(state => state.app);
            Pollutant = Pollutants[PollutantSelect];
            //在不需要展示 查询时间 的位置，调用查询方法，不传递 查询时间 信息，由后台控制
            if (!time) {
                let {selectDate} = yield select(state => state.pointdetail);
                time = getHourTime(selectDate);
            }

            if (ServiceType != 2){
                if (item.tag == '国控') {
                    //GroupID
                    PollutantData =  yield call(pointdetailService.getZQHourData, 
                        {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                            EndTime:time.EndTime,
                    });
                } else {
                    PollutantData =  yield call(pointdetailService.GetHourDatas, 
                        {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                            EndTime:time.EndTime,pollutantType:Pollutant.PollutantName,
                            PollutantCode:Pollutant.PollutantCode,
                    });
                }
            }
            let code = Pollutants[PollutantSelect].PollutantCode;
            let {tempArray,listArray} = doRepairData({data:PollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
            ,timeFun:(item)=>{
                //去掉秒的无用信息
                item._MonitorTime = item.MonitorTime.substring(0,(item.MonitorTime.length-3));
            }});
            PollutantData = tempArray;

            let comparePollutantData = [];
            if (compareItem.tag == '国控') {
                //GroupID
                comparePollutantData =  yield call(pointdetailService.getZQHourData, 
                    {user,DGIMN:compareItem.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,
                });
            } else {
                comparePollutantData = yield call(pointdetailService.GetHourDatas, 
                    {user,DGIMN:compareItem.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,pollutantType:Pollutant.PollutantName,
                        PollutantCode:Pollutant.PollutantCode,
                });
            }
            let {tempArray:compareTempArray,listArray:compareListArray} = doRepairData({data:comparePollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
            ,timeFun:(item)=>{
                //去掉秒的无用信息
                item._MonitorTime = item.MonitorTime.substring(0,(item.MonitorTime.length-3));
            }});
            comparePollutantData = compareTempArray;
            // 整理对比图所需数据
            let {ticks,chartData, chartDomain,validDataCount,} 
                = handlePollutantData({'PollutantData':tempArray,'ServiceType':2,'tag':item.tag,
                                        'PollutantCode':code});
            let {chartData:CompareData,chartDomain:compareDomain,validDataCount:validCompareDataCount,} 
                = handlePollutantData({'PollutantData':compareListArray,'ServiceType':2,'tag':compareItem.tag,
                                        'PollutantCode':code});
            if (chartDomain[0]>compareDomain[0]) {
                chartDomain[0] = compareDomain[0]
            }
            if (chartDomain[1]<compareDomain[1]) {
                chartDomain[1] = compareDomain[1]
            }
            let bothList = getComparePollutantDataList({'listArray':listArray,
                'compareListArray':compareListArray,});
            yield update (
                {'PollutantData':bothList,ticks,chartData,
                CompareData,chartDomain,validDataCount,
                validCompareDataCount,isRefreshing:false,}
            );
        },
        *getDayBdData({ payload: {item,compareItem,time,Pollutant} }, { update, call, put,select,take }){
            const { timeSpan,Pollutants,PollutantSelect,ServiceType,searchType } = yield select(state => state.pointdetail);
            if (!compareItem) {
                const { compareItem:original } = yield select(state => state.pointdetail);
                compareItem = original;
            } else {
                yield update({compareItem});
            }
            const { user } = yield select(state => state.app);
            Pollutant = Pollutants[PollutantSelect];
            //在不需要展示污染物的位置，调用查询方法，不传递污染物信息，由后台控制
            if (!time) {
                let {selectDate} = yield select(state => state.pointdetail);
                time = getDayTime(selectDate);
            }

            if (ServiceType != 3){
                if (item.tag == '国控') {
                    PollutantData =  yield call(pointdetailService.getZQDayData, 
                        {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                            EndTime:time.EndTime,
                    });
                } else {
                    PollutantData =  yield call(pointdetailService.GetDayDatas, 
                        {user,DGIMN:item.DGIMN,BeginTime:time.BeginTime,
                            EndTime:time.EndTime,pollutantType:Pollutant.PollutantName,
                            PollutantCode:Pollutant.PollutantCode,
                    });
                }
            }
            let code = Pollutants[PollutantSelect].PollutantCode;
            let {tempArray,listArray} = doRepairData({data:PollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
            ,timeFun:(item)=>{
                //去掉秒的无用信息
                item._MonitorTime = item.MonitorTime.split(' ')[0];
            }});
            PollutantData = tempArray;
            let comparePollutantData = {};
            if (compareItem.tag == '国控') {
                comparePollutantData =  yield call(pointdetailService.getZQDayData, 
                    {user,DGIMN:compareItem.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,
                });
            } else {
                comparePollutantData = yield call(pointdetailService.GetDayDatas, 
                    {user,DGIMN:compareItem.DGIMN,BeginTime:time.BeginTime,
                        EndTime:time.EndTime,pollutantType:Pollutant.PollutantName,
                        PollutantCode:Pollutant.PollutantCode,
                });
            }
            let {tempArray:compareTempArray,listArray:compareListArray} = doRepairData({data:comparePollutantData,ServiceType,searchType,'tag':item.tag,timeSpan,code
            ,timeFun:(item)=>{
                //去掉秒的无用信息
                item._MonitorTime = item.MonitorTime.split(' ')[0];
            }});
            comparePollutantData = compareTempArray;
            // 整理对比图所需数据
            let {ticks,chartData, chartDomain,validDataCount,} 
                = handlePollutantData({'PollutantData':tempArray,'ServiceType':3,'tag':item.tag,
                                        'PollutantCode':code});
            let {chartData:CompareData,chartDomain:compareDomain,validDataCount:validCompareDataCount,} 
                = handlePollutantData({'PollutantData':compareListArray,'ServiceType':3,'tag':compareItem.tag,
                                        'PollutantCode':code});
            if (chartDomain[0]>compareDomain[0]) {
                chartDomain[0] = compareDomain[0]
            }
            if (chartDomain[1]<compareDomain[1]) {
                chartDomain[1] = compareDomain[1]
            }
            let bothList = getComparePollutantDataList({'listArray':listArray,
                'compareListArray':compareListArray,});
            yield update (
                {'PollutantData':bothList,ticks,chartData,
                CompareData,chartDomain,validDataCount,
                validCompareDataCount,isRefreshing:false,}
            );
        },

        *refresh({ payload }, { update, call, put,select,take }) {
            let { ServiceType,item,
                searchType,selectDate, } = yield select(state => state.pointdetail);
            //生成时间
            let dateObj;
            if (selectDate){
                let tempArray = selectDate.split(' ');
                let dateArray = tempArray[0].split('-');
                let timeArray = tempArray[1].split(':'); 
                dateObj = moment({ years:dateArray[0], months:(dateArray[1]-1), date:dateArray[2], hours:timeArray[0],}).toDate();
            } else {
                dateObj = new Date();
                if (ServiceType == xiaoshi) {
                    dateObj.setTime(dateObj.getTime()-60*60*1000);
                } 
            }
            if (ServiceType == shishi) {
                if (item.tag == '国控') {
                    dateObj = new Date();
                    let timexiaoshi = getHourTime(dateObj);
                    let time = getGKRealTime();
                    yield update({'timeSpan':time});
                    yield put('GetRealTimeData',{
                        item,'time':timexiaoshi,
                    })
                    yield take('GetRealTimeData/@@end');
                } else {
                    let time = getRealTime();
                    yield update({'timeSpan':time});
                    yield put('GetRealTimeData',{
                        item,'time':time,
                    })
                    yield take('GetRealTimeData/@@end');
                }
            } else if (ServiceType == fenzhong) {
                let time = getMinuteTime();
                yield update({'timeSpan':time});
                if (item.tag == '国控') {
                    dateObj = new Date();
                    let timexiaoshi = getHourTime(dateObj);
                    yield put('GetMinuteData',{
                        item,'time':timexiaoshi,
                    })
                    yield take('GetMinuteData/@@end');
                } else {
                    yield put('GetMinuteData',{
                        item,'time':time,
                    })
                    yield take('GetMinuteData/@@end');
                }
            } else if (ServiceType == xiaoshi) {
                let time = getHourTime(dateObj);
                yield update({'timeSpan':time,searchType:'xiaoshi'});
                yield put('getHourSinglePollutantData',{
                    item,'time':time,
                })
                yield take('getHourSinglePollutantData/@@end');
            } else if (ServiceType == ri) {
                let time = getDayTime(dateObj);
                yield update({'timeSpan':time,searchType:'ri'});
                yield put('GetDayDatas',{
                    item,'time':time,
                })
                yield take('GetDayDatas/@@end');
            } else if (ServiceType == 8) {
                // 状态8为对比状态
                if (searchType == 'xiaoshi') {
                    let time = getHourTime(dateObj);
                    yield update({'timeSpan':time});
                    yield put('getHourBdData',{
                        item,'time':time,
                    })
                    yield take('getHourBdData/@@end');
                } else if (searchType == 'ri') {
                    let time = getDayTime(dateObj);
                    yield update({'timeSpan':time});
                    yield put('getDayBdData',{
                        item,'time':time,
                    })
                    yield take('getDayBdData/@@end');
                }
            }
        },
    }
});