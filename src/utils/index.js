
import { Toast, Modal } from 'antd-mobile';

const alert = Modal.alert;

export { NavigationActions } from 'react-navigation';

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const createAction = type => payload => ({ type, payload });

export const ShowToast = (msg) => {
  Toast.info(msg, 1);
};
export const ShowAlert = (title, msg, timeout, config) => {
  let cfg = [{ text: '关闭', onPress: () => console.log('cancel') }];
  if (config && config.length > 0) {
    cfg = config;
  }
  const alertInstance = alert(title, msg, cfg);
  if (timeout) {
    setTimeout(() => {
      alertInstance.close();
    }, timeout);
  }
};
export const ShowResult = (type, msg) => {
  if (type) {
    Toast.success(msg, 1);
  } else {
    Toast.fail(msg, 1);
  }
};
export const ShowLoadingToast = (msg) => {
  Toast.loading(msg, 10000, () => {

  });
};
export const CloseToast = () => {
  Toast.hide();
};
export const GetPointsCenter = (corrdinateset) => {
  if (corrdinateset.length !== 0) {
    let maxX = corrdinateset[0].longitude;
    let maxY = corrdinateset[0].latitude;
    let minX = corrdinateset[0].longitude;
    let minY = corrdinateset[0].latitude;
    corrdinateset.map((item, key) => {
      minY = minY > item.latitude ? item.latitude : minY;
      maxY = maxY < item.latitude ? item.latitude : maxY;
      minX = minX > item.longitude ? item.longitude : minX;
      maxX = maxX > item.longitude ? item.longitude : maxX;
    });
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return {
      latitude: centerY,
      longitude: centerX,
    };
  }

  return null;
};
export const FindMapImg = (imgName) => {
  switch (imgName) {
    default:
  }
};
export const parseDate = (date) => {
  let isoExp,
    parts;
  isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s(\d\d):(\d\d):(\d\d)\s*$/;
  try {
    parts = isoExp.exec(date);
  } catch (e) {
    return null;
  }
  if (parts) {
    date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
  } else {
    return null;
  }
  return date;
};
export const Event = {
  // 通过on接口监听事件eventName 如果事件eventName被触发，则执行callback回调函数
  on(eventName, callback) {
    // 你的代码
    if (!this.handles) {
      // this.handles={};
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false,
        configurable: true,
        writable: true
      });
    }

    if (!this.handles[eventName]) {
      this.handles[eventName] = [];
    }
    this
      .handles[eventName]
      .push(callback);
  },
  // 触发事件 eventName
  emit(eventName) {
    // 你的代码
    if (this.handles[arguments[0]]) {
      for (let i = 0; i < this.handles[arguments[0]].length; i++) {
        this.handles[arguments[0]][i](arguments[1]);
      }
    }
  }
};
export const getCurrentScreen = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentScreen(route);
  }
  return route.routeName;
};
export const getCurrentParams = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentParams(route);
  }
  return route.params;
};
export const Format = function (date,fmt) { //author: meizz 
  var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": date.getHours(), //小时 
      "H+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds(), //毫秒
      "0+":0 ,
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}