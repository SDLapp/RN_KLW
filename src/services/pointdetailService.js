import { post, get } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';

export const GetPollutantRelated = async (param) => {
    const body = {
        type:param.type,
        DGIMN:param.DGIMN,
    };
    const result = await get(api.monitordata.GetPollutantRelated, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
};

let GetClassifyData = async (param,url) => {
    const body = {
        DGIMN:param.DGIMN,
        BeginTime:param.BeginTime,
        EndTime:param.EndTime,
        PollutantCode:param.PollutantCode,
        pageIndex:1,
        pageSize:240,
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

export const GetRealTimeData = async (param) => {
    return GetClassifyData(param,api.monitorpoint.GetRealTimeData);
};

export const GetMinuteData = async (param) => {
    return GetClassifyData(param,api.monitorpoint.GetMinuteData);
};

export const GetHourDatas = async (param) => {
    return GetClassifyData(param,api.monitorpoint.GetHourDatas);
};

export const GetDayDatas = async (param) => {
    return GetClassifyData(param,api.monitorpoint.GetDayDatas);
};

export const GetBdPoints = async (param) => {
    
};
export const GetSystemPoints = async (param) => {
    const body = {
        pollutantType:param.pollutantType,
        searchTime:param.searchTime,
        GroupID:param.GroupID,
    };
    const result = await get(api.monitorpoint.GetPointNewRealTimeDataByPollutantType, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
};
export const GetGKPoints = async (param) => {
    const body = {
        maxLon:param.maxLon,
        maxLat:param.maxLat,
        minLon:param.minLon,
        minLat:param.minLat,
    };
    const result = await get(api.monitorpoint.GetPoint, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    //转换格式
    let i = 0;
    let array = [];
    for (i=0;i<result.length;i++) {
        array.push({
            DGIMN:result.data[i].getDGIMN(),
            text:result.data[i].getSiteName(),
            Longitude:result.data[i].getLongitude(),
            Latitude:result.data[i].getLatitude(),
        });
    }
    return array;
};

export const getZQDayData = async (param) => {
    const body = {
        DGIMN:param.DGIMN,
        BeginTime:param.BeginTime,
        EndTime:param.EndTime,
        New:'New',
    };
    const result = await get(api.monitorpoint.GetZQDayData, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
};
export const getZQHourData = async (param) => {
    const body = {
        DGIMN:param.DGIMN,
        BeginTime:param.BeginTime,
        EndTime:param.EndTime,
        New:'New',
    };
    const result = await get(api.monitorpoint.GetZQHourData, body, null);
    if (typeof(result) =='undifined'||result == null) {
        return [];
    }
    if (typeof(result.data) =='undifined'||result.data == null){
        return [];
    }
    return result.data;
};

