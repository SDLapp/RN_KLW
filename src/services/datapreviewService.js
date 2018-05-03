import { post, get } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';
import { getToken, saveStorage, loadStorage } from '../dvapack/storage';
import {shishi,fenzhong,xiaoshi,ri} from '../config/globalconst'
import {Format} from '../utils/index'
/**
 * 获取指定污染物的因子编码
 * houxiaofeng
 * @param {*} param 
 */
export const getPollutantCodes = async (param) => {
    const body = {
        pollutantType:param.type,
    };
    const result = await get(api.monitordata.pollutantCodes, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
};

export const loadPointWithData = async (param) => {
    let searchTime = param.searchTime;
    let date = new Date();
    let url = api.monitorpoint.GetPointNewRealTimeDataByPollutantType;
    if (typeof(param.searchTime) =='undifined'||param.searchTime == null
        ||param.searchTime==0||param.searchTime==-1 ){
        searchTime = Format(date,"yyyy-MM-dd HH:mm:ss");
        switch (param.mTag) {
            case xiaoshi:
                searchTime = Format(date,"yyyy-MM-dd HH:00:00")
                break;
            case ri:
                break;
                searchTime = Format(date,"yyyy-MM-dd 00:00:00")
            default:
                break;
        }
    }
    switch (param.mTag) {
        case shishi:
            url = api.monitorpoint.GetPointNewRealTimeDataByPollutantType;
            break;
        case fenzhong:
            url = api.monitorpoint.GetPointNewMinuteDataByPollutantType;
            break;
        case xiaoshi:
            url = api.monitorpoint.GetPointNewHourDataByPollutantType;
            break;
        case ri:
            url = api.monitorpoint.GetPointNewDayDataByPollutantType;
            break;
        default:
            break;
    }
    const body = {
        authorCode:param.user.User_ID,
        pollutantType:param.type,
        searchTime:searchTime,
        GroupID:param.GroupID=='全部'||param.GroupID==''||param.GroupID==undefined?'':param.GroupID,
        AQI:'',
        PrimaryPollutantCode:'',
    };
    const result = await get(url, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
};

export const getLastHourData = async (param) => {
    let searchTime = param.searchTime;
    let showSearchTime = param.searchTime;
    let date = new Date();
    date = new Date(date.getTime() - 1000*60*60);
    let url = api.monitorpoint.GetLastHourData;
    if (typeof(param.searchTime) =='undifined'||param.searchTime == null
        ||param.searchTime==0||param.searchTime==-1 ){
        searchTime = Format(date,"yyyy-MM-dd HH:00:00");
        switch (param.mTag) {
            case xiaoshi:
                searchTime = Format(date,"yyyy-MM-dd HH:00:00");
                break;
            case ri:
                break;
                searchTime = Format(date,"yyyy-MM-dd 00:00:00");
            default:
                searchTime = Format(date,"yyyy-MM-dd HH:00:00")
                break;
        }
        showSearchTime = searchTime;
    } else {

    }
    const body = {
        pollutantType:param.type,
        searchTime:searchTime,
        GroupID:param.GroupID,
        AQI:'',
        PrimaryPollutantCode:'',
    };
    const result = await get(url, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
}

export const getLastDayData = async (param) => {
    let searchTime = param.searchTime;
    let showSearchTime = param.searchTime;
    let date = new Date();
    let url = api.monitorpoint.GetLastDayData;
    if (typeof(param.searchTime) =='undifined'||param.searchTime == null
        ||param.searchTime==0||param.searchTime==-1 ){
        searchTime = Format(date,"yyyy-MM-dd HH:mm:ss");
        switch (param.mTag) {
            case xiaoshi:
                searchTime = Format(date,"yyyy-MM-dd HH:00:00")
                break;
            case ri:
                break;
                searchTime = Format(date,"yyyy-MM-dd 00:00:00")
            default:
                searchTime = Format(date,"yyyy-MM-dd HH:00:00")
                break;
        }
        showSearchTime = searchTime;
    }
    const body = {
        pollutantType:param.type,
        searchTime:searchTime,
        GroupID:param.GroupID,
        AQI:'',
        PrimaryPollutantCode:'',
    };
    const result = await get(url, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
}