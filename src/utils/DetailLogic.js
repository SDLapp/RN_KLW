import {userHandleTime} from '../utils/HistoryDataTimeUtils'
import moment from 'moment';

export const handlePollutantData = ({PollutantData,ServiceType,tag,PollutantCode}) =>{
    let ticks = [];
    let max=0,min=1;
    let chartData = [];
    let validDataCount = 0,tempValidDataCount = 0;
    let length = PollutantData.length;

    PollutantData.map((item,key)=>{
        //生成x轴数值
        item.chartTime = userHandleTime(item,key,length,ServiceType);
        if (ServiceType== 0) {
            if (length<5) {
                ticks.push(item.chartTime);
            }else {
                if (key%4==0) {
                    ticks.push(item.chartTime);
                } 
            }
        } else {
            if (length<7) {
                ticks.push(item.chartTime);
            } else if (key%6==0) {
                ticks.push(item.chartTime);
            } 
            
        } 
        if (tag == '国控') {
            item.chartValue = 
            (item[PollutantCode]==undefined?null:item[PollutantCode]);

            if (item[PollutantCode]!=undefined
                &&item[PollutantCode]!=null
                &&item[PollutantCode]!='') {
                    // 连续计数
                    tempValidDataCount++;
            } else {
                if (tempValidDataCount>validDataCount) {
                    //如果不连续，就记录，清零
                    validDataCount = tempValidDataCount;
                }
                tempValidDataCount = 0;
            }
        } else {
            if (ServiceType== 0) {
                item.chartValue = item.MonitorValue;
            } else {
                item.chartValue = item.AvgValue;
            }
            if (item.chartValue!=undefined
                &&item.chartValue!=null
                &&item.chartValue!='') {
                    // 连续计数
                    tempValidDataCount++;
            } else {
                //如果不连续，就记录，清零
                if (tempValidDataCount>validDataCount) {
                    validDataCount = tempValidDataCount;
                }
                tempValidDataCount = 0;
            }
        }
        if (key == 0) {
            max = item.chartValue;
            min = item.chartValue;
        }
        if (item.chartValue>max) {
            max = item.chartValue;
        }
        if (item.chartValue<min) {
            min = item.chartValue;
        }
        //接口没有值就返回0，需要转换
        if (item.chartValue == 0) {
            item.chartValue = null;
        }
        
        chartData.push(item);
    });
    // 一直连续，最后更新一次
    if (tempValidDataCount>validDataCount) {
        validDataCount = tempValidDataCount;
    }

    // max = Math.ceil(max/10+1)*10; 
    // min = Math.floor(min/10-1)*10;
    // if (min<0) {
    //     min = 0;
    // }
    return {'ticks':ticks,'chartData':chartData,
    'chartDomain':[min,max],'validDataCount':validDataCount,
    };
}

export const getComparePollutantDataList = ({listArray,compareListArray,}) => {
        let i=0,j=0,bothList=[],temp={};
        while (i<listArray.length||j<compareListArray.length) {
            temp = {};
            if (i<listArray.length&&j<compareListArray.length) {
                if (moment(listArray[i].MonitorTime).isSame(compareListArray[j].MonitorTime)) {
                    item = listArray[i];
                    temp.chartValue = listArray[i].chartValue;
                    temp.CompareValue = compareListArray[j].chartValue;
                    temp._MonitorTime = listArray[i]._MonitorTime;
                    i++;j++;
                } else if (moment(listArray[i].MonitorTime).isBefore(compareListArray[j].MonitorTime)) {
                    item = listArray[i];
                    temp.chartValue = listArray[i].chartValue;
                    temp.CompareValue = null;
                    temp._MonitorTime = listArray[i]._MonitorTime;
                    i++;
                } else {
                    item = compareListArray[j];
                    temp.CompareValue = compareListArray[j].chartValue;
                    temp.chartValue = null;
                    temp.AvgValue = null;
                    temp._MonitorTime = compareListArray[j]._MonitorTime;
                    j++;
                }
            } else {
                if (i<listArray.length) {
                    item = listArray[i];
                    temp.chartValue = listArray[i].chartValue;
                    temp.CompareValue = null;
                    temp._MonitorTime = listArray[i]._MonitorTime;
                    i++;
                }
                if (j<compareListArray.length) {
                    item = compareListArray[j];
                    temp.CompareValue = compareListArray[j].chartValue;
                    temp.chartValue = null;
                    temp.AvgValue = null;
                    temp._MonitorTime = compareListArray[j]._MonitorTime;
                    j++;
                }
            }
            
            bothList.push(temp);
        }
        bothList.reverse();
        return bothList;
}


// *handleComparePollutantData({ 
//     payload:{PollutantData,PollutantTag,comparePollutantData,comparePollutantTag
//         ,listArray,compareListArray,}},
//     { update, call, put,select,take }){
//     let {ServiceType,Pollutants,PollutantSelect,searchType,} = yield select(state => state.pointdetail);
//     let i=0,j=0;
//     let item = null;
//     let chartData = [],bothList=[];
//     let max,min;
//     let ticks = [];
//     let validDataCount = 0,tempValidDataCount = 0;
//     let validCompareDataCount = 0;
//     PollutantData.map((item,key)=>{
//         item.chartTime = userHandleTime(item,key,PollutantData.length,ServiceType,searchType);
//         if (key%6==0) {
//             ticks.push(item.chartTime);
//         } 
//         if (PollutantTag == '国控') {
//             item.chartValue = 
//             (item[Pollutants[PollutantSelect].PollutantCode]==undefined?null:item[Pollutants[PollutantSelect].PollutantCode]);
//             if (item[Pollutants[PollutantSelect].PollutantCode]!=undefined
//                 &&item[Pollutants[PollutantSelect].PollutantCode]!=null
//                 &&item[Pollutants[PollutantSelect].PollutantCode]!='') {
//                     // 连续计数
//                     tempValidDataCount++;
//             } else {
//                 //如果不连续，就记录，清零
//                 if (tempValidDataCount > validDataCount) {
//                     validDataCount = tempValidDataCount;
//                 }
//                 tempValidDataCount = 0;
//             }
//             if (key == 0) {
//                 max = item.chartValue;
//                 min = item.chartValue;
//             }
//             if (max<item.chartValue) {
//                 max = item.chartValue;
//             }
//             if (min>item.chartValue) {
//                 min = item.chartValue;
//             }
//         } else {
//             item.chartValue = item.AvgValue;
//             if (item.chartValue!=undefined
//                 &&item.chartValue!=null
//                 &&item.chartValue!='') {
//                     // 连续计数
//                     tempValidDataCount++;
//             } else {
//                 //如果不连续，就记录，清零
//                 if (tempValidDataCount > validDataCount) {
//                     validDataCount = tempValidDataCount;
//                 }
//                 tempValidDataCount = 0;
//             }
//             if (key == 0) {
//                 max = item.AvgValue;
//                 min = item.AvgValue;
//             }
//             if (max<item.AvgValue) {
//                 max = item.AvgValue;
//             }
//             if (min>item.AvgValue) {
//                 min = item.AvgValue;
//             }
//         }

//         if (item.chartValue == 0) {
//             item.chartValue = null;
//         }
//         chartData.push(item);
//     });
//     // 一直连续，最后更新一次
//     if (tempValidDataCount > validDataCount) {
//         validDataCount = tempValidDataCount;
//     }
//     tempValidDataCount = 0;
//     comparePollutantData.map((item,key)=>{
//         item.chartTime = userHandleTime(item,key,PollutantData.length,ServiceType,searchType);
//         if (comparePollutantTag == '国控') {
//             item.chartValue = 
//             (item[Pollutants[PollutantSelect].PollutantCode]==undefined?null:item[Pollutants[PollutantSelect].PollutantCode]);
//             if (item[Pollutants[PollutantSelect].PollutantCode]!=undefined
//                 &&item[Pollutants[PollutantSelect].PollutantCode]!=null
//                 &&item[Pollutants[PollutantSelect].PollutantCode]!='') {
//                     // 连续计数
//                     tempValidDataCount++;
//             } else {
//                 //如果不连续，就记录，清零
//                 if (tempValidDataCount > validCompareDataCount) {
//                     validCompareDataCount = tempValidDataCount;
//                 }
//                 tempValidDataCount = 0;
//             }
//         } else {
//             item.chartValue = item.AvgValue;
//             if (item.chartValue!=undefined
//                 &&item.chartValue!=null
//                 &&item.chartValue!='') {
//                     // 连续计数
//                     tempValidDataCount++;
//             } else {
//                 //如果不连续，就记录，清零
//                 if (tempValidDataCount > validCompareDataCount) {
//                     validCompareDataCount = tempValidDataCount;
//                 }
//                 tempValidDataCount = 0;
//             }
//         }
//         if (max<item.AvgValue) {
//             max = item.AvgValue;
//         }
//         if (min>item.AvgValue) {
//             min = item.AvgValue;
//         }
//         if (item.chartValue == 0) {
//             item.chartValue = null;
//         }
//     });
//     // 一直连续，最后更新一次
//     if (tempValidDataCount > validCompareDataCount) {
//         validCompareDataCount = tempValidDataCount;
//     }
//     //取值范围向两侧浮动
//     max = Math.ceil(max/10+1)*10; 
//     min = Math.floor(min/10-1)*10;
//     if (min<0) {
//         min = 0;
//     }
//     while (i<listArray.length&&j<compareListArray.length) {
//         if (moment(listArray[i].MonitorTime).isSame(compareListArray[j].MonitorTime)) {
//             item = listArray[i];
//             item.chartValue = listArray[i].chartValue;
//             item.CompareValue = compareListArray[j].chartValue;
//             i++;j++;
//         } else if (moment(listArray[i].MonitorTime).isBefore(compareListArray[j].MonitorTime)) {
//             item = listArray[i];
//             item.chartValue = listArray[i].chartValue;
//             item.CompareValue = null;
//             i++;
//         } else {
//             item = compareListArray[j];
//             item.CompareValue = compareListArray[j].chartValue;
//             item.chartValue = null;
//             item.AvgValue = null;
//             j++;
//         }
//         bothList.push(item);
//     }
//     bothList.reverse();
//     yield update({'PollutantData':bothList,ticks,chartData,
//             CompareData:comparePollutantData,
//             chartDomain:[min,max],
//             validDataCount,validCompareDataCount,isRefreshing:false,});
// },