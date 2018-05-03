//import liraries
import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import {SCREEN_WIDTH,normal_font_size,} from '../../config/globalsize';
import globalcolor from '../../config/globalcolor'

/**
 * TopSelector中的组件，处理日期显示，将日期事件处理成中文格式
*/
@connect(({datapreview})=>({
    selectOption:datapreview.selectOption,
    textDate:datapreview.textDate,
    }))
class DateTitle extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            'textDate':'',
        }
    }
    componentDidMount(){
        if (!this.props.textDate||this.props.textDate==-1||this.props.textDate.length<0) {
        } else {
            this.setState({'textDate':this.props.textDate});
        }
    }
    componentDidUpdate(){
        if (!this.props.textDate||this.props.textDate==-1||this.props.textDate.length<0) {
        } else {
            this.setState({'textDate':this.props.textDate});
        }
    }
    render() {
        if (this.state.textDate == '') {
            return(<View style={[{
                width:SCREEN_WIDTH,
                flexDirection:'row',justifyContent:'center',alignItems:'center',height:42,},]}>
            </View>);
        } else {
            let temp = this.state.textDate.split(' ');
            let dateArray = temp[0].split('-');
            let timeArray;
            let prefix,suffix,heightLight;
            if (this.props.selectOption == 1) {
                dateStr = dateArray[0]+'年'+dateArray[1]+'月'+dateArray[2]+'日';
                timeArray = temp[1].split(':');
                prefix = dateStr+timeArray[0]+':';
                heightLight = timeArray[1];
                suffix = ':00';
                return (
                    <View style={[{
                        width:SCREEN_WIDTH,
                        flexDirection:'row',justifyContent:'center',alignItems:'center',height:42,},]}>
                        <Text style={{height:34,lineHeight:30,fontSize:normal_font_size,marginTop:4,}}>
                        {prefix}</Text>
                        <Text style={{height:34,lineHeight:30,fontSize:normal_font_size,marginTop:4,color:globalcolor.datepickerBlueText}}>
                        {heightLight}</Text>
                        <Text style={{height:34,lineHeight:30,fontSize:normal_font_size,marginTop:4,}}>
                        {suffix}</Text>
                    </View>
                );
            } else if (this.props.selectOption == 2) {
                dateStr = dateArray[0]+'年'+dateArray[1]+'月'+dateArray[2]+'日';
                timeArray = temp[1].split(':');
                prefix = dateStr;
                heightLight = timeArray[0];
                suffix = ':'+timeArray[1]+':00';
                return (
                    <View style={[{
                        width:SCREEN_WIDTH,
                        flexDirection:'row',justifyContent:'center',alignItems:'center',height:42,},]}>
                        <Text style={{height:34,lineHeight:34,fontSize:normal_font_size,}}>
                        {prefix}</Text>
                        <Text style={{height:34,lineHeight:34,fontSize:normal_font_size,color:globalcolor.datepickerBlueText}}>
                        {heightLight}</Text>
                        <Text style={{height:34,lineHeight:34,fontSize:normal_font_size,}}>
                        {suffix}</Text>
                    </View>
                );
            } else if (this.props.selectOption == 3) {
                prefix = dateArray[0]+'年'+dateArray[1]+'月';
                heightLight = dateArray[2];
                suffix = '日';
                return (
                    <View style={[{
                        width:SCREEN_WIDTH,
                        flexDirection:'row',justifyContent:'center',alignItems:'center',height:42,},]}>
                        <Text style={{height:34,lineHeight:34,fontSize:normal_font_size,}}>
                        {prefix}</Text>
                        <Text style={{height:34,lineHeight:34,fontSize:normal_font_size,color:globalcolor.datepickerBlueText}}>
                        {heightLight}</Text>
                        <Text style={{height:34,lineHeight:30,fontSize:normal_font_size,}}>
                        {suffix}</Text>
                    </View>
                );
            } else {
                timeArray = temp[1].split(':');
                dateStr = dateArray[0]+'年'+dateArray[1]+'月'+dateArray[2]+'日'
                    +timeArray[0]+':'+timeArray[1]+':'+timeArray[2];
                return (
                    <View style={[{
                        width:SCREEN_WIDTH,
                        flexDirection:'row',justifyContent:'center',alignItems:'center',height:42,},]}>
                        <Text style={{height:34,lineHeight:34,fontSize:normal_font_size,}}>
                        {dateStr}</Text>
                    </View>
                );
            } 
        }
        
        
    }
}

//make this component available to the app
export default DateTitle;
