import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import { NavigationActions, ShowToast, delay } from '../utils';
import * as authService from '../services/authService';
import * as systemConfig from '../services/systemService';
import { clearToken, saveToken, saveStorage, loadStorage } from '../dvapack/storage';
import { Model } from '../dvapack';

export default Model.extend({
  namespace: 'app',
  state: {
    user: null,
    contactlist: [],
    globalConfig: {},
    PolluntTypes:[],
    selectedPolluntType:-1,
  },
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        MyPhoneList: ({ params }) => {  
          dispatch({
            type: 'loadcontactlist',
            payload: {
            }
          });
        },
      });
    },
    
  },
  reducers: {
  },
  effects: {
    /**
     * 获取全局变量
     * liz 2017.11.11
     * @param {any} { payload } 
     * @param {any} { call, put, update } 
     */
    * loadglobalvariable({ payload }, { call, put, update,take }) {
      const { user } = payload;
      let globalConfig = yield loadStorage('globalconfig');
      
      if (user && user != null) {
        yield put('GetPolluntType', { });
        yield take('GetPolluntType/@@end');
      } 
      if (SplashScreen) {
        SplashScreen.hide();
      }
      yield update({ globalConfig, user });
    },
  
    /**
     * HelenChen 
     * 通讯录
     * @param {any} {payload} 
     * @param {any} {update,callWithLoading} 
     */
    * loadcontactlist({payload},{update,callWithLoading}){  
      const {data:contactlist}=yield callWithLoading(authService.getcontactlist,{}); 
      yield update({contactlist});
    },
    
    /**
     * 登录
     * liz 2017.11.11
     * @param {any} { payload: { username, password } } 
     * @param {any} { update, call, put } 
     */
    * login({ payload: { username, password } }, { update, call, put,take }) {
      if (username === '' || password === '') {
        ShowToast('用户名，密码不能为空');
      } else {
        let result = yield call(authService.login, { username, password });
        if (result==null) {
          ShowToast('登录失败');
        } else if (result!=null&&result.requstresult==1) {
          let user = result.data;
          if (user !== null) {
            yield saveToken(user);
            yield put('loadglobalvariable', { user });
            yield take('loadglobalvariable/@@end');
          }
        } else if (result!=null&&result.requstresult==0)  {
          ShowToast('用户名或密码错误');
        } else {
          ShowToast('登录失败');
        }
        
      }
    },
   
    /**
     * 修改密码
     * HelenChen
     * @param {any} {payload:{authorCode,userPwdOld,userPwdNew,userPwdTwo}} 
     * @param {any} {call,put} 
     */
    * ChangePsw({payload:{authorCode,userPwdOld,userPwdNew,userPwdTwo}}, {call,put}){
      const{data:result} = yield call(authService.resetPwd,{authorCode,userPwdOld,userPwdNew,userPwdTwo});
      if(result.substring(0,4)!=='修改成功'){
        ShowToast(result,2);
      }else{
        clearToken();
        yield put(NavigationActions.navigate({routeName:'Login'}));
      }
    },
    /**
     * 获取污染物类型（颗粒物、标准站）
     * houxiaofeng
     * @param {any} {payload:{authorCode,userPwdOld,userPwdNew,userPwdTwo}} 
     * @param {any} { update, call, put,select} 
     */
    * GetPolluntType({payload}, { update, call, put,select}){
      let {data} = yield call(authService.getPolluntType,{});
      data = data.filter((item,key)=>{
        return item.ID!=23
        &&item.ID!=24
        &&item.ID!=25?true:false;
      });
      yield update({ PolluntTypes:data});
      const PolluntTypes = yield select(state => state.PolluntTypes);
      if (data.length==1) {
        //只有一种站点直接进入
        yield update({selectedPolluntType:data[0].ID});
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ 
              routeName: 'MainNavigator', params: { } 
            })],
            key: null,
          }),
        );
      } else {
        //大于中站点类型进入选择页面
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'PolluntTypeSelect', params: { } })],
            key: null,
          }),
        );
      }
      //等到添加闪屏之后再使用
      if (SplashScreen) {
        SplashScreen.hide();
      }
    },
    /**
     * 选择站点类型，进入数据一览
     * houxiaofeng
     * 
     * @param {any} {payload:{PolluntType}} 
     * @param {any} { update, call, put,select} 
     */
    * selectPolluntType({payload:{PolluntType}}, { update, call, put,select}){
      yield update({selectedPolluntType:PolluntType});
      yield put(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'MainNavigator', params: { } })],
          key: null,
        }),
      )
    },
  }, 
});