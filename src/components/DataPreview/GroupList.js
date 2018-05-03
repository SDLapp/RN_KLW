import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList,TouchableWithoutFeedback,Animated, } from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import globalcolor from '../../config/globalcolor';
import {SCREEN_WIDTH, SCREEN_HEIGHT, WINDOW_HEIGHT,} from '../../config/globalsize';
import NoDataComponent from '../../components/common/NoDataComponent';
import LoadingComponent from '../../components/common/LoadingComponent';


/**
 * 站点分组选择dialog
*/
@connect(({datapreview,loading,})=>({
    groupItems:datapreview.groupItems,
    groupSelected:datapreview.groupSelected,
    groupListLoading:loading.effects['datapreview/getGroupList'],}))
class GroupList extends PureComponent {

    _renderItem = ({item}) => {
        return <TouchableOpacity style={[{flexDirection:'row',borderBottomColor:globalcolor.borderLightGreyColor,borderBottomWidth:0.5,
                            justifyContent:'center',alignItems:'center',height:48,},]} onPress={()=>{
                                this.props.itemClick(item);
                            }}>
            {this.props.groupSelected==item?<Icon name={'ios-radio-button-on-outline'} size={24} style={[{marginLeft:8,marginRight:8,}]} />
            :<Icon name={'ios-radio-button-off-outline'} size={24} style={[{marginLeft:8,marginRight:8,}]} />}
            <Text style={[{flex:1,textAlign:'center',marginRight:36,}]}>{item}</Text>
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={{height:SCREEN_HEIGHT,width:SCREEN_WIDTH,alignItems:'center',justifyContent:'center',}}>
                <TouchableWithoutFeedback onPress={()=>{
                    this.props.hideDialog();
                }}>
                    <Animated.View style={ styles.mask } >
                    </Animated.View>
                </TouchableWithoutFeedback>
                <View style={[styles.container]}>
                    <View style={[styles.titleContainer]}>
                        <Text style={[styles.titleText,{marginLeft:8,}]}>站点分组</Text>
                        <TouchableOpacity style={[styles.closeIconTouchable]}
                            onPress={()=>{this.props.hideDialog();}}>
                            <Icon name={'md-close-circle'} size={32} style={{color:'white'}}/>
                        </TouchableOpacity>
                    </View>
                    {this.props.groupListLoading
                    ?<LoadingComponent Message={'正在努力加载数据'}/>
                    :this.props.groupItems.length>0?
                    <FlatList style={[styles.flatlist]}
                        data={this.props.groupItems}
                        extraData={this.state}
                        keyExtractor={(item,index)=>{return index}}
                        renderItem={this._renderItem}
                    />
                    :<NoDataComponent style={[styles.noDataComponent]}/>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        height:SCREEN_HEIGHT*4/5,
        width:SCREEN_WIDTH*4/5,
        borderRadius:4,
        borderWidth:0.5,
        borderColor:'white',
        justifyContent:'center',
        alignItems:'center',
    },
    titleContainer:{
        height:40,
        backgroundColor:globalcolor.titleBlue,
        flexDirection:'row',
        width:SCREEN_WIDTH*4/5-1,
        alignItems:'center',
        justifyContent:'space-between',
        borderTopLeftRadius:4,
        borderTopRightRadius:4,
    },
    titleText:{
        color:globalcolor.white,
        fontWeight:'bold',
        fontSize:16
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
        borderBottomLeftRadius:4,
        borderBottomRightRadius:4,
        width:SCREEN_WIDTH*4/5-1,
    },
    noDataComponent:{
        borderBottomLeftRadius:4,
        borderBottomRightRadius:4,
    },
    mask: {
        backgroundColor:"#383838",
        opacity:0.8,
        position:"absolute",
        width:SCREEN_WIDTH,
        height:WINDOW_HEIGHT,
    },
});

//make this component available to the app
export default GroupList;
