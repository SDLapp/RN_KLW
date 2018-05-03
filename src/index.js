import { AppRegistry, AsyncStorage } from 'react-native';
import React from 'react';

import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';

import dva from './utils/dva';
import { ShowToast } from './utils';
import storage from './config/globalstorage';
import { registerModels } from './models';
import { getNetConfig, saveNetConfig, getUseNetConfig } from './dvapack/storage';
import { test } from './dvapack/request';
import createLoading from 'dva-loading';
import NetConfigJSON from './config/NetConfig.json';
import Router, { routerMiddleware, screenTracking } from './router';
import api from './config/globalapi';

const logger = createLogger();

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  };
}
const dvaEnhancer = {
  onEffect: (effect, sagaEffects, model) => function * effectEnhancer(...args) {
    let config = getUseNetConfig();
    let httpsNetUrl = 'https://api.chsdl.cn/PMS15';
    let url = `${httpsNetUrl + api.system.nettest}`;
    let result = yield test(url, {}).then(async data => true, json => false);
    const CNConfig = [];
    const NetConfig = getNetConfig();
    if (result) {
      yield effect(...args);
    } else {
      let newconfig = [];
      NetConfigJSON.Config.map((item, key) => {
        let netitem = {};
        netitem.neturl = `http://${item.configIp}:${item.configPort}`;
        netitem.isuse = true;
        
        if (config.neturl != netitem.neturl) {
          newconfig.push(netitem);
        }
      });
      yield saveNetConfig(newconfig);
      config = getUseNetConfig();
      url = `${config.neturl + api.system.nettest}`;
      result = yield test(url, {}).then(async data => true, json => false);
        if (result) {
          yield effect(...args);
        } else {
          // ShowToast('网络断开，请重试');
        }
  }
  }
};
const app = dva({
  initialState: {},
  models: [],
  ...createLoading({ effects: true }),
  onAction: [routerMiddleware, screenTracking, logger],
});
app.use(dvaEnhancer);
registerModels(app);
const App = app.start(<Router />);
persistStore(app.getStore(), {
  storage: AsyncStorage,
  blacklist: ['router']
});


// eslint-disable-next-line no-underscore-dangle
AppRegistry.registerComponent('RN_KLW', () => App);