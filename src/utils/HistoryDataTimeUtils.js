import moment from 'moment';

export const formatDateString = (myDate) =>{
    return myDate.getFullYear()+'-'+((myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1))+'-'
            +(myDate.getDate()<10?'0'+(myDate.getDate()):myDate.getDate())
            +'+'+(myDate.getHours()<10?'0'+(myDate.getHours()):myDate.getHours())           //+ == ' '
            +'%3A'+(myDate.getMinutes()<10?'0'+(myDate.getMinutes()):myDate.getMinutes())  //%3A == :
            +'%3A'+(myDate.getSeconds()<10?'0'+(myDate.getSeconds()):myDate.getSeconds());
}

/**
 * date: 2017/10/13 16:45
 * autour: LSK
 * description: 获取实时数据 10分钟的时间段  21个数
 */

export const getRealTime = () => {
    let myDate = new Date();
    let minute = myDate.getMinutes();     //获取当前分钟数(0-59)
    let remainderMinute = minute%10;
    
    let BeginTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),myDate.getDate()
                                                    ,myDate.getHours(),(myDate.getMinutes()-remainderMinute)));
    let EndTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),myDate.getDate()
                                                ,myDate.getHours(),(myDate.getMinutes()-remainderMinute+10)));
    return {
        BeginTime:BeginTime,
        EndTime:EndTime,
        'myDate':myDate,
        'str':moment(myDate).format('YYYY-MM-DD HH:mm:ss'),
    };
};
export const getGKRealTime = () => {
    let myDate = new Date();
    myDate.setTime(myDate.getTime()-60*60*1000);
    
    let BeginTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),myDate.getDate()
                                                    ,myDate.getHours()-1,50));
    let EndTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),myDate.getDate()
                                                ,myDate.getHours()));
    return {
        BeginTime:BeginTime,
        EndTime:EndTime,
        'myDate':myDate,
        'str':moment(myDate).format('YYYY-MM-DD HH:mm:ss'),
    };
};

/**
 * date: 2017/10/13 16:47
 * autour: LSK
 * description: 分钟数据获取4小时时间段
 */

export const getMinuteTime = () => {
    let myDate = new Date();
    
    let BeginTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),(myDate.getDate())
                                                    ,(myDate.getHours()-3),0));
    let EndTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),myDate.getDate()
                                                ,(myDate.getHours()+1),0));
    return {
        BeginTime:BeginTime,
        EndTime:EndTime,
        'myDate':myDate,
        'str':moment(myDate).format('YYYY-MM-DD HH:mm:ss'),
    };
};

/**
 * date: 2017/10/13 16:47
 * autour: LSK
 * description: 小时数据 获取24小时时间段 25个数
 */

export const getHourTime = (myDate) => {
    
    let BeginTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),(myDate.getDate()-1)
                                                    ,myDate.getHours()));
    let EndTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),myDate.getDate()
                                                ,(myDate.getHours()+1)));
                                                // ,(myDate.getHours()+1)));
    return {
        BeginTime:BeginTime,
        EndTime:EndTime,
        'myDate':myDate,
        'str':moment(myDate).format('YYYY-MM-DD HH:mm:ss'),
    };
};

/**
 * date: 2017/10/13 16:47
 * autour: LSK
 * description: 日数据 获取30天时间段 31个数
 */

export const getDayTime = (myDate) => {
    let beginDay = new Date((myDate.getFullYear()),myDate.getMonth(),0).getDate()-(30-myDate.getDate())
    
    let BeginTime = ''+formatDateString(new Date(myDate.getFullYear(),(myDate.getMonth()-1),beginDay));
    let EndTime = ''+formatDateString(new Date(myDate.getFullYear(),myDate.getMonth(),myDate.getDate()));
    return {
        BeginTime:BeginTime,
        EndTime:EndTime,
        'myDate':myDate,
        'str':moment(myDate).format('YYYY-MM-DD HH:mm:ss'),
    };
};

export const userHandleTime = (item,key,length,ServiceType,searchType) =>{
    let timeTemp = [];
        //生成x轴数值
        if (ServiceType== 0) {
            if (key == 0) {
                timeTemp = item.MonitorTime.substring(5).split(' ');
                return '         '+timeTemp[1].substring(0,5)+'\n'+'         '+timeTemp[0];
            } else {
                //"2017-12-25 16:51:30"
                if (key%4==0) {
                    return item.MonitorTime.substring(11,16);
                } else if(key == length-1){
                    return item.MonitorTime.substring(11,16);
                }else{
                    return item.MonitorTime;
                }
            }
        }if (ServiceType== 1) {
            if (key == 0) {
                timeTemp = item.MonitorTime.substring(5).split(' ');
                return '         '+timeTemp[1].substring(0,5)+'\n'+'         '+timeTemp[0];
            } else {
                //"2017-12-25 16:51:30"
                return item.MonitorTime.substring(11,16);
            }
            
        } else if (ServiceType== 3||(ServiceType== 8&&searchType == 'ri')) {
            return item.MonitorTime.substring(5,10);
        } else if (ServiceType== 2||(ServiceType== 8&&searchType == 'xiaoshi')) {
            timeTemp = item.MonitorTime.substring(5).split(' ');
            // if (key == 0) {
            //     return '         '+timeTemp[1].substring(0,5)+'\n'
            //     +'         '+timeTemp[0];
            // } else {
                return timeTemp[1].substring(0,5)+'\n'+timeTemp[0];
            // }
            
        }
}

export const zeroize = (num) =>{
    if (num<10) {
        return '0'+num;
    } else {
        return num+'';
    }
}
