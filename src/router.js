import React, { PureComponent } from 'react';
import { BackHandler, Platform, View, StatusBar, Text,Modal } from 'react-native';
import {
  addNavigationHelpers
} from 'react-navigation';
import { connect } from 'react-redux';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import CodePush from "react-native-code-push";
import { loadToken, saveNetConfig, loadNetConfig } from './dvapack/storage';
import { delay,createAction, NavigationActions, getCurrentScreen,Event,getCurrentParams } from './utils';
import NetConfig from './config/NetConfig.json';
import api from './config/globalapi';
import AppNavigator from './containers/';
import DataPreview from './containers/Main/TabView/Home/DataPreview'
import Alert from './components/DataPreview/Alert'
import {doUpdate} from './utils/CodePushUtil'
export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
);
export const screenTracking = ({getState}) => next => async (action) => {
  if (action.type !== NavigationActions.NAVIGATE && action.type !== NavigationActions.BACK&& action.type !== NavigationActions.RESET) {
    return next(action);
  }
  if(!action.routeName)
  {
    const navigateInfo = routerReducer(getState().router, action);
          const currentScreen = getCurrentScreen(navigateInfo);
          const params = getCurrentParams(navigateInfo);
          action.routeName=currentScreen;
          action.params=params;
  }  
  // routeName, params, type 
  await Event.emit('RouterChange', action); 
  //lizheng solve detail page flash before loading data.
  const result = next(action); 
  return result;
};

const addListener = createReduxBoundAddListener('root');

@connect(({ router }) => ({ router }))
class Router extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      configload: true
    };
  }
  async componentWillMount() {
    let netconfig =await loadNetConfig();
    if (!netconfig && !netconfig != null) {
      if (NetConfig.isAutoLoad) {
        let newconfig = [];
        let item = NetConfig.Config[0];
        let netitem = {};
        netitem.neturl = `http://${item.configIp}:${item.configPort}`;
        netitem.isuse = true;
        newconfig.push(netitem);

        await saveNetConfig(newconfig);
      } else {
        this.setState({ configload: false });
      }
    }
    BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    
  }
  async componentDidMount() {
    CodePush.notifyAppReady();
    doUpdate((syncStatus)=>{},(progress)=>{});
    const user = await loadToken();
    if (user&&Modal!=undefined&&Modal) {
      this.props.dispatch(createAction('app/loadglobalvariable')({ user }));
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
      JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
      JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
      JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
      JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
      JPushModule.clearAllNotifications();
    } else {
      DeviceEventEmitter.removeAllListeners();
      NativeAppEventEmitter.removeAllListeners();
    }
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router);
    //登录
    if (currentScreen === 'Login') {
      return true;
    }
   
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back());
      return true;
    }
  
    return false;
  }
  render() {
    if (!this.state.configload) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />
          <Text>ScanNetConfig</Text>
        </View>
      );
    }
    const { dispatch, router } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: router,
      addListener,
    });
    return (
      <View style={{ flex: 1 }}>
        <AppNavigator navigation={navigation} />
      </View>
    );
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state);
}

export default Router;
