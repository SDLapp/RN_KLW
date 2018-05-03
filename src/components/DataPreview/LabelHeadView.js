//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { connect } from 'react-redux';

import {SCREEN_WIDTH,little_font_size,little_font_size2} from '../../config/globalsize'
import globalcolor from '../../config/globalcolor'

/**
 * 数据一览表格，表头
*/
@connect(({datapreview})=>({pollutantBeens:datapreview.pollutantBeens,}))
class LabelHeadView extends PureComponent {
    render() {
        return (
            <View style={[styles.container,{flexDirection:'row',borderBottomColor:globalcolor.borderLightGreyColor,
                        borderBottomWidth:1,},{width:this.props.pollutantBeens?this.props.pollutantBeens.length*SCREEN_WIDTH/3:0,height:46,},]}>
                {this.props.pollutantBeens!=null?this.props.pollutantBeens.map((item,key)=>{
                    return<View key={key} style={[styles.oneLabel,]}>
                            <View style={[{height:28,width:1,backgroundColor:globalcolor.borderGreyColor,}]}></View>
                            <View style={[{flex:1,justifyContent:'center',alignItems:'center',},]}>
                                <Text style={[{fontSize:little_font_size,}]}>{item.PollutantName}</Text>
                                <Text style={[{fontSize:little_font_size2,}]}>{item.Unit}</Text>
                            </View>  
                          </View>
                }):<Text>empty</Text>}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    oneLabel:{
        width:SCREEN_WIDTH/3,
        height:46,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
});

//make this component available to the app
export default LabelHeadView;
