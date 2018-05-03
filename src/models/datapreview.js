import {Model} from '../dvapack'
import * as datapreviewService  from '../services/datapreviewService'
import {shishi,fenzhong,xiaoshi,ri,klw,} from '../config/globalconst'
import {zeroize} from '../utils/HistoryDataTimeUtils'
import {wgs84togcj02} from '../utils/coordinate'

export default Model.extend({
    namespace:'datapreview',
    state:{
        searchType:'xiaoshi',
        seasons:[],
        searchDateValue:[],
        pollutantBeens:[
            {
                PollutantCode:'0',
                PollutantName:'PM10',
                Unit:'μg/m³',
            },
            {
                PollutantCode:'1',
                PollutantName:'PM2.5',
                Unit:'μg/m³',
            },
        ],
        pointBeens:[
            /**
             * pID : 2dc875e5-d500-4d6a-8f0f-c395a239b2ad
             * pname : 惠冶镁业有限公司
             * status : 0
             * text : 码头二号排口-重
             * tag : 废气
             * DGIMN : fq106
             * type : 2
             * Longitude : 116.217919
             * Latitude : 39.885501
             * Times : 2017/5/8 13:25:08
             * Values : ["179.463","363.079","374.874","","","12.041","400.963","","269.687","361.522","","60.344","110.141","268.211","393.305","68.767","245.988"]
             * Colors : ["#0066FF","#FF0000","","","","","","","","","","","","","","",""]
             */
            // {
            //     pID:'2dc875e5-d500-4d6a-8f0f-c395a239b2ad',
            //     pname:'惠冶镁业有限公司',
            //     status:'0',
            //     text:'码头二号排口-重',
            //     tag:'废气',
            //     DGIMN:'fq106',
            //     type:2,
            //     Longitude:1.1,
            //     Latitude:1.1,
            //     Times:'2017/5/8 13:25:08',
            //     Values:['2','6.8','7.9','8.2'],
            //     Colors:['','','',''],
            // },
        ],
        selectedPollutantIndex:0,
        selectOption:2,
        textDate:'',
        groupItems:[],
        groupSelected:'全部',
    },
    reducers:{
        
    },
    subscriptions:{
        setupSubscriber({ dispatch, listen }) {
            listen({
                DataPreviewAll: () => {
                    dispatch({ type: 'getGroupList',
                        payload:{mTag:xiaoshi,}
                    });
                },
                TabView:() => {
                    dispatch({ type: 'getGroupList',
                        payload:{mTag:xiaoshi,}
                    });
                },
                
            });
          },
    },
    effects:{
        /**
         * 获取指定污染物的因子编码
         * houxiaofeng
         * 
         * @param {any} { payload } 
         * @param {any} { update, call, put,select } 
         */
        *getPollutantCodes({ payload }, { update, call, put,select }){
            const { user,selectedPolluntType } = yield select(state => state.app);
            let pollutantBeens =  yield call(datapreviewService.getPollutantCodes, {type:selectedPolluntType,user});
            if (selectedPolluntType == klw) {
                pollutantBeens = pollutantBeens.filter(todo=>{
                    //a01001"温度"  a01002"湿度"
                    // 过滤污染物类型
                    if (todo['PollutantCode']=='a34004'||todo['PollutantCode']=='a34002') {
                        return true
                    } else {
                        return false;
                    }
                })
            }
            yield update({pollutantBeens})
        },
        *loadPointWithData({ payload }, { update, call, put,select }){
            const start = new Date().getTime();
            let { groupItems,selectOption:mTag,textDate:searchTime,groupSelected:GroupID, } 
            = yield select(state => state.datapreview);
            const { user,selectedPolluntType } = yield select(state => state.app);
            if (!searchTime||searchTime == -1) {
                let myDate = new Date();
                let prefixDate = myDate.getFullYear()+'-'+zeroize(myDate.getMonth()+1)+'-'+zeroize(myDate.getDate());
                switch(mTag){
                    case shishi:
                        searchTime = prefixDate+' '
                            +zeroize(myDate.getHours())+":"
                            +zeroize(myDate.getMinutes())+':'+zeroize(myDate.getSeconds()>30?30:0);
                    break;
                    case fenzhong:
                        let _minute = Math.floor(myDate.getMinutes()/10)*10;
                        searchTime = prefixDate+' '+
                            zeroize(myDate.getHours())+":"
                            +zeroize(_minute)+':'+'00';
                    break;
                    case xiaoshi:
                        myDate.setTime(myDate.getTime()-60*60*1000);
                        searchTime = prefixDate+' '+zeroize((myDate.getHours()))+":00:00";
                    break
                    case ri:
                        let yesterday = (new Date());
                        yesterday.setTime(myDate.getTime()-24*60*60*1000);
                        searchTime = yesterday.getFullYear()+'-'+zeroize(yesterday.getMonth()+1)+'-'+zeroize(yesterday.getDate())+' 00:00:00';
                    break;
                    default:
                        searchTime = prefixDate+' '+zeroize((myDate.getHours()))+":00:00";
                    break;
                }
                // yield update({textDate:searchTime});
            }
            let _searchTime = searchTime.replace(/ /g,'+');
            let pointBeens =  yield call(datapreviewService.loadPointWithData, {type:selectedPolluntType,user,'searchTime':_searchTime,mTag,GroupID});
            //获取国控点的方法
            let GKGroupID = GroupID;
            if (GroupID==''||GroupID == '全部') {
                GKGroupID = '';
                groupItems.map ((item,key)=>{
                    if (key == 0){
                        GKGroupID = '';
                    } else if (key == 1) {
                        GKGroupID = item+'';
                    } else {
                        GKGroupID = GKGroupID + ',' +item;
                    }
                })
            }
            let GKpointBeens = [];
            if (GKGroupID.length>0) {
                if (mTag == ri) {
                    GKpointBeens =  yield call(datapreviewService.getLastDayData, {type:selectedPolluntType,user,searchTime,mTag,GroupID:GKGroupID});
                } else if (mTag == xiaoshi) {
                    GKpointBeens =  yield call(datapreviewService.getLastHourData, {type:selectedPolluntType,user,searchTime,mTag,GroupID:GKGroupID});
                } else if (mTag == fenzhong||mTag == shishi) {
                    GKpointBeens =  yield call(datapreviewService.getLastHourData, {type:selectedPolluntType,user,searchTime,mTag,GroupID:GKGroupID});
                    let tempArray = [];
                    GKpointBeens.map ((item,key)=>{
                        if (item.Times!=undefined&&item.Times!=null&&item.Times!='') {
                            tempArray = item.Times.split(' ');
                            item.tag = item.tag+'('+tempArray[1].split(':')[0]+':00)';
                        }
                    });
                } 
            }
            
            pointBeens = pointBeens.concat(GKpointBeens);
            let newPosition;
            pointBeens.map((item,key)=>{
                newPosition = wgs84togcj02(item.Longitude,item.Latitude);
                item.Longitude = newPosition[0];
                item.Latitude = newPosition[1];
            });
            yield update({textDate:searchTime,pointBeens});
        },
        /**
         * 获取监测点分组，初始化列表
         * houxiaofeng
         * 
         * @param {any} { payload: {mTag} } 
         * @param {any} { update, call, put,select } 
         */
        *getGroupList({ payload: {mTag} }, { update, call, put,select,take, }){
            const { user,selectedPolluntType } = yield select(state => state.app);
            const { groupItems } = yield select(state => state.datapreview);
            yield put('getPollutantCodes',{});
            yield take('getPollutantCodes/@@end');
            //没有分组信息的情况，进行初次加载数据
            if (groupItems.length==0) {
                let myDate = new Date();
                myDate.setTime(myDate.getTime()-60*60*1000);
                let prefixDate = myDate.getFullYear()+'-'+zeroize(myDate.getMonth()+1)+'-'+zeroize(myDate.getDate());
                let searchTime = prefixDate+' '+(myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours())+":00:00";
                yield update({'textDate':searchTime});
                if (searchTime!=-1) {
                    searchTime = searchTime.replace(/ /g,'+');
                }
                let pointBeens =  yield call(datapreviewService.loadPointWithData, 
                    {type:selectedPolluntType,user,
                        searchTime,mTag});
                let groupStrs =''; 
                pointBeens.map((item,key)=>{
                    if (item&&item.GroupID
                        &&groupItems.indexOf(item.GroupID)==-1) {
                        if (groupItems.length==0){
                            groupStrs = item.GroupID;
                        } else{
                            groupStrs = groupStrs+','+item.GroupID;
                        }
                        groupItems.push(item.GroupID);
                    }
                });
                if (groupItems.length == 1){
                    yield update({'groupSelected':groupItems[0]}) 
                } else if (groupItems.indexOf('全部')==-1){
                    groupItems.splice(0,0,'全部')
                }
                yield update({groupItems});
                //获取国控点的方法
                let GKpointBeens
                if (groupStrs.length>0) {
                    GKpointBeens =  yield call(datapreviewService.getLastHourData, {type:selectedPolluntType,user,searchTime,mTag,GroupID:groupStrs});
                    pointBeens = pointBeens.concat(GKpointBeens);
                }
                let newPosition;
                pointBeens.map((item,key)=>{
                    newPosition = wgs84togcj02(item.Longitude,item.Latitude);
                    item.Longitude = newPosition[0];
                    item.Latitude = newPosition[1];
                });
                yield update({pointBeens})
            }
        },
    }
});