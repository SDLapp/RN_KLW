//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,FlatList,Image, } from 'react-native';
import { connect } from 'react-redux';

import {SCREEN_WIDTH, SCREEN_HEIGHT,normal_font_size,} from '../../config/globalsize'
import globalcolor from '../../config/globalcolor'
import {createAction,} from '../../utils';

const contentHeight = SCREEN_HEIGHT-148;

// create a component
@connect(({pointdetail,})=>({
    PollutantData:pointdetail.PollutantData,
    isRefreshing:pointdetail.isRefreshing,
    Pollutants:pointdetail.Pollutants,
    PollutantSelect:pointdetail.PollutantSelect,
    compareItem:pointdetail.compareItem,
    item:pointdetail.item,
}))
class DetailList extends PureComponent {

    /**
     * 显然底部list的item
    */
    _renderItem = ({item,index},key) => {
        let tag = 2;
        if (this.props._getTagview()
            &&this.props._getTagview()!=undefined) {
            tag = this.props._getTagview().getTag();
        }
        return <View style={[{flexDirection:'row',borderBottomColor:globalcolor.borderLightGreyColor,borderBottomWidth:0.5,
                            justifyContent:'center',alignItems:'center',height:40,},]}>
                    <Text style={[{flex:8,fontSize:13,textAlign:'center',fontWeight:index==0?'bold':'normal',}]}>{item._MonitorTime}</Text>
                    <View style={[{flex:5,justifyContent:'center',flexDirection:'row',alignItems:'flex-end'}]}>
                        <Text style={[{fontSize:16,textAlign:'center',fontWeight:index==0?'bold':'normal',}]}>{(
                            (item.chartValue==null?'--':item.chartValue.toFixed(1)))}</Text>
                        <Text style={[{fontSize:12,fontWeight:index==0?'bold':'normal',textAlign:'center'}]}>{
                            item.chartValue==null?'':tag==8?
                            '':this.props.Pollutants&&this.props.Pollutants[this.props.PollutantSelect]?
                        this.props.Pollutants[this.props.PollutantSelect].Unit:''}</Text>
                    </View>
                    
                    {tag==8?
                    <Text style={[{flex:6,fontSize:16,textAlign:'center',fontWeight:index==0?'bold':'normal',}]}>{
                        (item.CompareValue==null?'--':item.CompareValue.toFixed(1))
                        +(tag!=8&&this.props.Pollutants
                        &&this.props.Pollutants[this.props.PollutantSelect]?
                        this.props.Pollutants[this.props.PollutantSelect].Unit:'')}</Text>
                    :<Text style={[{flex:4,fontSize:12,textAlign:'center',fontWeight:index==0?'bold':'normal',}]}>
                    {item.chartValue==null?'--':item.IsException==0?'数据正常':
                        item.IsException==1?'0值异常':item.IsException==2?'连续值异常':
                        item.IsException==3?'超限异常':item.IsException==5?'人工挑选异常':'数据正常'}</Text>}
                </View>
    }
    /**
     * 对列表进行下拉刷新，获取最新数据
    */
    _refresh = () => {
        this.props.dispatch(createAction('pointdetail/updateState')({isRefreshing:true}));
        this.props.dispatch(createAction('pointdetail/refresh')());
    }

    render() {
        let tag = 2;
        
        if (this.props._getTagview()
            &&this.props._getTagview()!=undefined) {
            tag = this.props._getTagview().getTag();
        }
        let listHeight = tag==8?(contentHeight-16)/2:(contentHeight-16)*3/5;
        return (
        <View style={[styles.listTitle1,styles.shadowStyle,{height:listHeight,}]}>
                <View style={[{width:SCREEN_WIDTH-48,height:40,flexDirection:'row',justifyContent:'center',alignItems:'center',},]}>
                    <View style={[{flexDirection:'row',flex:3,justifyContent:'center',alignItems:'center',},]}>
                        <Image style={[{width:15,height:13.5,marginRight:4,}]} source={require('../../images/ic_time_listtop.png')}/>
                        <Text style={[{fontSize:normal_font_size,}]}>监测时间</Text>
                    </View>
                    <View style={[{flexDirection:'row',flex:2,justifyContent:'center',alignItems:'center',},]}>
                        <Image source={require('../../images/ic_value_listtop.png')} style={[{width:15,height:13.5,marginRight:4,}]}/>
                        {tag==8?
                        <Text numberOfLines={1} style={{fontSize:normal_font_size,}}>{this.props.item.text}</Text>
                        :<Text style={{fontSize:normal_font_size,}}>监测值</Text>}
                        
                    </View>
                    <View style={[{flexDirection:'row',flex:2,justifyContent:'center',alignItems:'center',},]}>
                        <Image source={require('../../images/ic_des_listtop.png')} style={[{width:15,height:13.5,marginRight:4,}]}/>
                        {tag==8?
                        <Text numberOfLines={1} style={{fontSize:normal_font_size,}}>{this.props.compareItem?this.props.compareItem.text:'--'}</Text>
                        :<Text style={{fontSize:normal_font_size,}}>状态描述</Text>}
                        
                    </View>
                </View>
                <FlatList
                    refreshing={this.props.isRefreshing}
                    onRefresh={()=>{
                        this._refresh();
                    }}
                    style={[{width:SCREEN_WIDTH-48,height:listHeight-16,},]}
                    data={this.props.PollutantData}
                    keyExtractor={(item,index)=>{return index}}
                    renderItem={this._renderItem}
                />
            </View>
            
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    listTitle1:{
        width:SCREEN_WIDTH-32,
        marginBottom:8,
        borderColor:globalcolor.borderGreyColor,
        borderWidth:0.5,borderRadius:8,
        borderBottomWidth:1 ,
        paddingLeft:2,
        paddingRight:2,
        paddingTop:8,
        paddingBottom:8,
        backgroundColor:globalcolor.white,
    },
    shadowStyle: {
        //以下是阴影属性：  
        shadowOffset: {width: 0, height: 5},  
        shadowOpacity: 0.5,  
        shadowRadius: 5,  
        shadowColor: globalcolor.borderGreyColor,  
        //注意：这一句是可以让安卓拥有灰色阴影  
        //elevation: 4,  
    },
});

//make this component available to the app
export default DetailList;
