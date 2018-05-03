//import liraries
import React, { PureComponent } from 'react';
import { View,Platform } from 'react-native';

import {SCREEN_WIDTH} from '../config/globalsize'
import globalcolor from '../config/globalcolor'
/**
 * ios用顶部状态栏控件
*/
// create a component
class MyStatusHeader extends PureComponent {
    render() {
        return (
            <View style={{width:SCREEN_WIDTH,height:Platform.OS==='ios'?20:0,backgroundColor:globalcolor.titleBlue,}} ></View>
        );
    }
}

//make this component available to the app
export default MyStatusHeader;
