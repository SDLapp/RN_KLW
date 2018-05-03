//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,FlatList,TouchableWithoutFeedback,Animated, } from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import globalcolor from '../../config/globalcolor';
import {SCREEN_WIDTH, SCREEN_HEIGHT,little_font_size} from '../../config/globalsize';
import NoDataComponent from '../../components/common/NoDataComponent';
import LoadingComponent from '../../components/common/LoadingComponent';
/**
 * 对比点选择dialog
*/
// create a component
@connect(({pointdetail,loading,})=>({
    ComparePointData:pointdetail.ComparePointData,
    getBdPointsLoading:loading.effects['pointdetail/getBdPoints'],}))
class ComparePointsList extends PureComponent {

    _renderCompareItem = ({item},key) => {
        return <TouchableOpacity style={[{flexDirection:'row',borderBottomColor:globalcolor.borderLightGreyColor,borderBottomWidth:0.5,
                            justifyContent:'center',alignItems:'center',height:48,},]} onPress={()=>{
                                this.props.itemClick(item,key);
                            }}>
            <Text style={[{flex:3,fontSize:little_font_size,textAlign:'center',}]}>{item.text}</Text>
            {item.tag == '国控'?<Text style={[{flex:2,textAlign:'center',color:globalcolor.titleBlue,}]}>{'国控点'}</Text>:<Text style={[{flex:2,textAlign:'center',}]}>{item.pname}</Text>}
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={{height:SCREEN_HEIGHT,width:SCREEN_WIDTH,alignItems:'center',justifyContent:'center',}}>
                <TouchableWithoutFeedback onPress={()=>{
                    this.props.hideCompareDialog();
                }}>
                    <Animated.View style={ styles.mask } >
                    </Animated.View>
                </TouchableWithoutFeedback>
                <View style={[styles.container]}>
                    
                    <View style={[styles.titleContainer]}>
                        <View style={{height:32,width:32,marginLeft:4,}}></View>            
                        <Text style={[styles.titleText]}>选择对比点</Text>
                        <TouchableOpacity style={[styles.closeIconTouchable]}
                            onPress={()=>{this.props.hideCompareDialog();}}>
                            <Icon name={'md-close-circle'} size={32} style={{color:'white'}}/>
                        </TouchableOpacity>
                    </View>
                    {this.props.getBdPointsLoading
                    ?<LoadingComponent Message={'正在努力加载数据'}/>:
                    this.props.ComparePointData.length>0?
                    <FlatList style={[styles.flatlist]}
                        data={this.props.ComparePointData}
                        extraData={this.state}
                        keyExtractor={(item,index)=>{return index}}
                        renderItem={this._renderCompareItem.bind(this)}
                    />
                    :<NoDataComponent Message={'没有可对比的站点'} style={[styles.noDataComponent]}/>}
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        height:SCREEN_HEIGHT/2,
        width:SCREEN_WIDTH*3/4,
        borderRadius:8,
        borderWidth:0.5,
        borderColor:'white',
        justifyContent:'center',
        alignItems:'center',
    },
    titleContainer:{
        height:40,
        backgroundColor:globalcolor.titleBlue,
        flexDirection:'row',
        width:SCREEN_WIDTH*3/4-1,
        alignItems:'center',
        justifyContent:'space-between',
        borderTopLeftRadius:8,
        borderTopRightRadius:8,
    },
    titleText:{
        color:globalcolor.white,
        fontWeight:'bold'
    },
    closeIconTouchable:{
        height:32,
        width:32,
        justifyContent:'center',
        alignItems:'center',
        marginRight:4,
    },
    flatlist:{
        flex:1,
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
        width:SCREEN_WIDTH*3/4-1,
    },
    noDataComponent:{
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    },
    mask: {
        backgroundColor:"#383838",
        opacity:0.8,
        position:"absolute",
        width:SCREEN_HEIGHT,
        height:SCREEN_HEIGHT,
        left:0,
        top:0,
    },
});

export default ComparePointsList;
