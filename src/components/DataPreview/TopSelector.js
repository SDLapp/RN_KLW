//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';

import { connect } from 'react-redux';

import globalcolor from '../../config/globalcolor';
import {SCREEN_WIDTH,normal_font_size} from '../../config/globalsize';
import {createAction,} from '../../utils';
import DateTitle from '../../components/DataPreview/DateTitle'

/**
 * 数据一览顶部的控制器，显示时间，切换查询条件
*/
@connect(({datapreview})=>({
    selectOption:datapreview.selectOption,}),null,null,{withRef:true})
class TopSelector extends PureComponent {

    constructor(props){
        super(props);
        this.state={
            datePickerVisible:false,
        };
    }
    getSelectOption = ()=>{
        return this.props.selectOption;
    }
    _changeMTag(index,searchTime){
        //更新数据
        this.props.dispatch(createAction('datapreview/updateState')({textDate:searchTime,selectOption:index}));
        this.props.dispatch(createAction('datapreview/loadPointWithData')({}));
    }

    _search = () =>{
        this.props.showDatePicker();
    }

    render() {
        return (
            <View style={[{height:81,marginBottom:2,width:SCREEN_WIDTH,alignItems:'center',}]}>
                <DateTitle />
                <View style={[{width:SCREEN_WIDTH,flexDirection:'row',justifyContent:'space-around',
                    borderBottomColor:globalcolor.borderGreyColor,borderTopColor:globalcolor.borderGreyColor,
                    borderTopWidth:1,borderBottomWidth:2,height:44},]}>
                    <TouchableOpacity style={[styles.optionStyle,]} onPress={()=>{this._changeMTag(0,-1)}}>
                    <View style={[styles.optionStyle,{backgroundColor:'white'}]}>
                        <Text style={[{color:this.props.selectOption==0?globalcolor.titleBlue:globalcolor.textBlack,height:40,
                            lineHeight:40,fontSize:normal_font_size,},]}>实时</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionStyle,]} onPress={()=>{this._changeMTag(1,-1);}}>
                    <Text style={[{color:this.props.selectOption==1?globalcolor.titleBlue:globalcolor.textBlack,height:40,
                        lineHeight:40,fontSize:normal_font_size,},]}>分钟</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionStyle,]} onPress={()=>{this._changeMTag(2,-1);}}>
                    <Text style={[{color:this.props.selectOption==2?globalcolor.titleBlue:globalcolor.textBlack,height:40,
                        lineHeight:40,fontSize:normal_font_size,},]}>小时</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionStyle,]} onPress={()=>{this._changeMTag(3,-1);}}>
                    <Text style={[{color:this.props.selectOption==3?globalcolor.titleBlue:globalcolor.textBlack,height:40,
                        lineHeight:40,fontSize:normal_font_size,},]}>日均</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionStyle,]} onPress={()=>{
                    this._search();
                    }}>
                    <Text style={[{marginTop:4,marginBottom:4,height:40,
                        lineHeight:40,fontSize:normal_font_size,},]}>查询</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    optionStyle:{flex:1,alignItems:'center',justifyContent:'center',height:40,},
});

//make this component available to the app
export default TopSelector;
