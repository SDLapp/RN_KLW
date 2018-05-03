import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import TabView from './TabView'
import PointDetail from './PointDetail'
import MySetting from '../Main/MySetting';
import MyChangePsw from '../Main/MyChangePsw';
import MsgPushManager from '../Main/MsgPushManager';
import MyPhoneList from '../Main/MyPhoneList';
import PersonalMsg from '../Main/PersonalMsg';
import SystemDescription from './SystemDescription'
import AxisLineChartScreen from '../../components/PointDetail/AxisLineChartScreen'

export default StackNavigator(
  {
    TabView:{
      screen:()=><TabView/>,
      navigationOptions: {
        header:null
      },
    },
    PointDetail: { screen: PointDetail },
    MyPhoneList:{screen : MyPhoneList},
    MySetting:{screen : MySetting },
    MyChangePsw:{screen :MyChangePsw},
    MsgPushManager:{screen:MsgPushManager},
    PersonalMsg:{screen:PersonalMsg},
    SystemDescription:{screen:SystemDescription},
    AxisLineChartScreen:{screen:AxisLineChartScreen},
    },
    {
      headerMode: 'screen'
    }
);