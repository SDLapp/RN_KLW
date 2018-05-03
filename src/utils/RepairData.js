import moment from 'moment';
import {shishi,fenzhong,xiaoshi,ri,klw} from '../config/globalconst'

export const repairDataOfGK = ({data,ServiceType,searchType,tag,timeSpan,code,timeFun}) => {
    let BeginTimeMoment = moment(timeSpan.BeginTime.replace('+', ' ').replace(/%3A/g, ':'),'YYYY-MM-DD HH:mm:ss');
    let EndTimeMoment = moment(timeSpan.EndTime.replace('+', ' ').replace(/%3A/g, ':'),'YYYY-MM-DD HH:mm:ss');
    let itemMoment,itemStartDate,itemStartMoment,pollutantDataItem,i=0,tempArray=[],listArray = [],tempItem;
    while (!EndTimeMoment.isBefore(BeginTimeMoment)) {
        if (i<data.length) {
            pollutantDataItem = data[i];
            itemMoment = moment(pollutantDataItem.MonitorTime,'YYYY-MM-DD HH:mm:ss');
            itemStartMoment = moment(pollutantDataItem.MonitorTime,'YYYY-MM-DD HH:mm:ss');
            itemStartMoment.add(-1,'hours');
            if ((BeginTimeMoment.isAfter(itemStartMoment)
                &&BeginTimeMoment.isBefore(itemMoment))
                ||BeginTimeMoment.isSame(itemMoment)) {
                    tempItem = {
                    'MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),
                    '_MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),};
                    tempItem[code] = pollutantDataItem[code]
                timeFun(tempItem);
                tempArray.push(tempItem); 
                listArray.push(tempItem);
                moveIndexTime(BeginTimeMoment,ServiceType,searchType);
            } else if (BeginTimeMoment.isAfter(itemMoment)) {
                i++;
            } else {
                pollutantDataItem = {code:null,
                    'MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),
                    '_MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),};
                timeFun(pollutantDataItem);
                moveIndexTime(BeginTimeMoment,ServiceType,searchType);
            }
        } else {
            pollutantDataItem = {code:null,
                'MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),
                '_MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),};
            timeFun(pollutantDataItem);
            tempArray.push(pollutantDataItem);
            moveIndexTime(BeginTimeMoment,ServiceType,searchType);
        }
        
        
    }
    return {tempArray,listArray};
}

export const doRepairData = ({data,ServiceType,searchType,tag,timeSpan,code,timeFun}) =>{
    //补充数据
    let BeginTimeMoment = moment(timeSpan.BeginTime.replace('+', ' ').replace(/%3A/g, ':'),'YYYY-MM-DD HH:mm:ss');
    let EndTimeMoment = moment(timeSpan.EndTime.replace('+', ' ').replace(/%3A/g, ':'),'YYYY-MM-DD HH:mm:ss');
    let itemMoment,pollutantDataItem,i=0,tempArray=[],listArray = [];
    while (!EndTimeMoment.isBefore(BeginTimeMoment)) {
        if (i<data.length) {
            pollutantDataItem = data[i]
            itemMoment = moment(pollutantDataItem.MonitorTime,'YYYY-MM-DD HH:mm:ss')
            if (BeginTimeMoment.isSame(itemMoment)) {
                timeFun(pollutantDataItem);
                tempArray.push(pollutantDataItem);
                listArray.push(pollutantDataItem);
                i++;
                moveIndexTime(BeginTimeMoment,ServiceType,searchType);
            } else if (BeginTimeMoment.isAfter(itemMoment)) {
                i++;
            }else {
                if (tag == '国控') {
                    pollutantDataItem = {code:null,
                        'MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),
                        '_MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),};
                    timeFun(pollutantDataItem);
                    tempArray.push(pollutantDataItem);
                    listArray.push(pollutantDataItem);
                } else {
                    pushEmptyData(tempArray,BeginTimeMoment,ServiceType,timeFun);
                    pushEmptyData(listArray,BeginTimeMoment,ServiceType,timeFun);
                }
                moveIndexTime(BeginTimeMoment,ServiceType,searchType);
            }
        } else {
            if (tag == '国控') {
                pollutantDataItem = {code:null,
                    'MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),
                    '_MonitorTime':BeginTimeMoment.format('YYYY-MM-DD HH:mm:ss'),};
                timeFun(pollutantDataItem);
                tempArray.push(pollutantDataItem);
            } else {
                pushEmptyData(tempArray,BeginTimeMoment,ServiceType,timeFun);
                
            }
            moveIndexTime(BeginTimeMoment,ServiceType,searchType);
        }
        
        
    }
    return {tempArray,listArray};
    // return tempArray;
    //补充数据 结束
}

let pushEmptyData = (array,currentmoment,ServiceType,timeFun) =>{
    let pollutantDataItem;
    if (ServiceType == shishi) {
        pollutantDataItem = {'MonitorValue':null,
            'MonitorTime':currentmoment.format('YYYY-MM-DD HH:mm:ss'),
            '_MonitorTime':currentmoment.format('YYYY-MM-DD HH:mm:ss'),};
        timeFun(pollutantDataItem);
        array.push(pollutantDataItem);
    } else {
        pollutantDataItem = {'AvgValue':null,
            'MonitorTime':currentmoment.format('YYYY-MM-DD HH:mm:ss'),
            '_MonitorTime':currentmoment.format('YYYY-MM-DD HH:mm:ss'),};
        timeFun(pollutantDataItem);
        array.push(pollutantDataItem);
    }
}
let moveIndexTime = (currentmoment,ServiceType,searchType) =>{
    if (ServiceType== shishi) {
        currentmoment.add(30,'seconds');
    } else if (ServiceType== fenzhong) {
        currentmoment.add(10,'minutes');
    }  else if (ServiceType== xiaoshi||(ServiceType== 8&&searchType=='xiaoshi')) {
        currentmoment.add(1,'hours');
    }  else {
        //ri
        currentmoment.add(1,'days');
    } 
}