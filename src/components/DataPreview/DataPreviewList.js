//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,ScrollView,RefreshControl,Image, } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import LoadingComponent from '../common/LoadingComponent'
import {SCREEN_WIDTH,little_font_size,SCREEN_HEIGHT, little_font_size2,} from '../../config/globalsize';
import globalcolor from '../../config/globalcolor';
import LabelHeadView from '../DataPreview/LabelHeadView';
import NoDataComponent from '../common/NoDataComponent';
import {createAction,NavigationActions} from '../../utils';
import SuspensionLoadingComponent from '../common/SuspensionLoadingComponent'

const listHeight = SCREEN_HEIGHT - 125 - 88;
// create a component
@connect(({datapreview,loading,})=>({
    pollutantBeens:datapreview.pollutantBeens,
    pointBeens:datapreview.pointBeens,
    groupSelected:datapreview.groupSelected,
    groupItems:datapreview.groupItems,
    groupListLoading:loading.effects['datapreview/getGroupList'],
    pointWithDataLoading:loading.effects['datapreview/loadPointWithData'],}))
class DataPreviewList extends PureComponent {
    
    constructor(props){
        super(props);
        this.state={
            isDisable:false,//是否被禁用
            pullToRefreshing:false
        };
    }

    /**
     * 跳转至详情页
    */
    _goToDetail = async(item) =>{
        requestAnimationFrame (()=>{
            this.props.dispatch(NavigationActions.navigate({
                routeName:'PointDetail',
                params:{item:item},
            }));
        });
    }

    _onRefresh = ()=>{
        this.setState({pullToRefreshing:true});
        //刷新到当前时间
        this.props.getTopSelector()._changeMTag(
            this.props.getTopSelector().getSelectOption(),-1);
        this.setState({pullToRefreshing:false});
    }

    componentDidMount() {
        // console.log('componentDidMount');
    }

    render() {
        // console.log('render');
        return (
            <View>
            {
                this.props.groupListLoading
                    ||this.props.pointWithDataLoading?
                    <SuspensionLoadingComponent />:(null)
            }
            {
                // this.props.groupListLoading
                //     ||this.props.pointWithDataLoading?
                //         <LoadingComponent Message={'正在努力加载数据'}/>
                //         :
                        this.props.pointBeens&&this.props.pointBeens.length>0?
                        <View style={[{width:SCREEN_WIDTH,height:listHeight,marginTop:4},]}>
                            {/* 表头*/}
                            <View style={[{width:SCREEN_WIDTH,height:48,flexDirection:'row',},]}>
                                    <TouchableOpacity style={[styles.oneLabel,styles.myBorderBottom,{marginLeft:4,justifyContent:'center'}]} onPress={()=>{
                                        if (this.props.groupItems.length>1) {
                                            this.props.showGroupSelector();
                                        }
                                    }}>
                                            <View style={[{justifyContent:'center',alignItems:'center',},]}>
                                                <Text style={[{fontSize:little_font_size,}]}>
                                                {this.props.groupItems.length==1?'监测点'
                                                    :this.props.groupSelected=='全部'?
                                                    '监测点':this.props.groupSelected}</Text>
                                            </View>
                                                {this.props.groupItems.length>1?
                                                    <Icon name={'md-arrow-dropdown'} size={24} style={[{color:globalcolor.titleBlue,marginLeft:4,}]} />
                                                    :<View></View>
                                                }
                                            
                                    </TouchableOpacity>
                                <ScrollView ref={ref => this.titleScrollView = ref} style={[{width:SCREEN_WIDTH*2/3,height:48,},]} horizontal={true}
                                showsHorizontalScrollIndicator={false} scrollEnabled={false}> 
                                    <LabelHeadView />
                                </ScrollView>
                            </View>
                            {/* 表头结束*/}

                        <ScrollView style={[{flex:1,width:SCREEN_WIDTH,}]} 
                            keyboardShouldPersistTaps={ 'always' }
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.pullToRefreshing}
                                    onRefresh={this._onRefresh}
                                    tintColor="#716b6a"
                                    title="下拉刷新..."
                                    titleColor="#716b6a"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#ffff00"
                                />
                            }
                            onMomentumScrollEnd={this._contentViewScroll} showsVerticalScrollIndicator={false}>
                                {/* 列表最外层*/}
                                <View style={[styles.listContent,{}]}>
                                    {/* 左侧表头*/}
                                    <View style={[{height:(this.props.pointBeens?this.props.pointBeens.length*52:0),width:SCREEN_WIDTH/3,}]}>
                                        {
                                            this.props.pointBeens?this.props.pointBeens.map((item,key)=>{
                                                return <TouchableOpacity 
                                                            disabled={this.state.isDisable}
                                                            onPress={()=>{
                                                                            this._goToDetail(item);}}
                                                            key={key} style={[{width:SCREEN_WIDTH/3,
                                                                        height:52,
                                                                        justifyContent:'center',
                                                                        alignItems:'flex-start',paddingLeft:16,},styles.myBorderBottom,]}>
            
                                                    <Text style={[{fontSize:little_font_size}]}>{item.tag=='国控'?item.tag:item.pname}</Text>
                                                    <View style={{flexDirection:'row',alignItems:'center',marginTop:4,}}>
                                                        <View style={[{width:little_font_size2,height:little_font_size2,borderRadius:5,
                                                            backgroundColor:item.status==0?"#B0B0B1":item.status==1?"#5BC142":item.status==2?"#E00B0B":
                                                                item.status==3||item.status==4||item.status==5?"#B9C303":"#B0B0B1",
                                                            marginRight:2,}]}></View>
                                                        <Text style={[{fontSize:little_font_size2,}]} numberOfLines={1}>{item.text}</Text>        
                                                    </View>        
                                                </TouchableOpacity>
                                            }):<View style={[{height:0,width:0,},]}></View>
                                        }
                                    </View>
                                    {/* 左侧表头 结束*/}
                                    {/* 数据表横向滑动组件*/}
                                    <ScrollView 
                                        keyboardShouldPersistTaps={ 'always' }
                                        onScroll={(event)=>{
                                            this.titleScrollView.scrollTo({x:event.nativeEvent.contentOffset.x,animated:false}, );
                                         }}
                                        scrollEventThrottle={10} 
                                        showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true} style={[styles.HorizontalList,{height:this.props.pointBeens?(this.props.pointBeens.length)*52:0,}]}>
                                        {/* 数据表 开始*/}
                                        <View style={[{height:this.props.pointBeens?this.props.pointBeens.length*52:0,
                                                        width:this.props.pollutantBeens?SCREEN_WIDTH/3*this.props.pollutantBeens.length:0,}]}>
                                            {/* 生成航 开始*/}
                                            {
                                                this.props.pointBeens?this.props.pointBeens.map((item,key)=>{
                                                    return <TouchableOpacity disabled={this.state.isDisable} key={key} style={[{height:52,width:SCREEN_WIDTH/3*this.props.pollutantBeens.length,flexDirection:'row',},styles.myBorderBottom,]}
                                                                onPress={()=>{this._goToDetail(item)}}>
                                                            {
                                                                this.props.pollutantBeens.map((pollutantItem,_key)=>{
                                                                    
                                                                    
                                                                    if ((typeof item[pollutantItem.PollutantCode])=='object'&&item[pollutantItem.PollutantCode]==null) {
                                                                        return<Text key={_key} style={[{width:SCREEN_WIDTH/3,height:51,textAlign:'center',lineHeight:52,}]}>
                                                                            --
                                                                        </Text>
                                                                    } else if ((typeof item[pollutantItem.PollutantCode])=='undefined'&&item[pollutantItem.PollutantCode]==undefined) {
                                                                        return <View key={_key} style={[{width:SCREEN_WIDTH/3,height:51,alignItems:'center',justifyContent:'center',}]}>
                                                                            <Image source={require('../../images/ic_not_has.png')} style={[{width:24,height:24,}]}  />
                                                                        </View>
                                                                    } else if(item[pollutantItem.PollutantCode]=='') {
                                                                        return<Text key={_key} style={[{width:SCREEN_WIDTH/3,height:51,textAlign:'center',lineHeight:52,}]}>
                                                                            --
                                                                        </Text>
                                                                    } else {
                                                                        if (item.status==0) {
                                                                            return<Text key={_key} style={[{width:SCREEN_WIDTH/3,height:51,textAlign:'center',lineHeight:52,color:item.Colors&&item.Colors[_key]?item.Colors[_key]:'black'}]}>
                                                                                --
                                                                            </Text>
                                                                        } else {
                                                                            return<Text key={_key} style={[{width:SCREEN_WIDTH/3,height:51,textAlign:'center',lineHeight:52,color:item.Colors&&item.Colors[_key]?item.Colors[_key]:'black'}]}>
                                                                                {item[pollutantItem.PollutantCode]}
                                                                            </Text>
                                                                        }
                                                                        
                                                                    }
                                                                }) 
                                                            }
                                                    </TouchableOpacity>
                                                    {/* 生成航 结束*/}
                                                }):<View style={[{height:0,width:0,},]}></View>
                                            }
                                        </View>
                                        {/* 数据表 结束*/}
                                    </ScrollView>
                            </View>
        
                        </ScrollView>
                    </View>
                    :<NoDataComponent />
            }
            </View>
            
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    listContent:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
    },
    oneLabel:{
        width:SCREEN_WIDTH/3,
        height:46,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    HorizontalList:{
        width:SCREEN_WIDTH*2/3,
    },
    myBorderBottom:{
        borderBottomColor:globalcolor.borderLightGreyColor,
        borderBottomWidth:1,
    },
});

//make this component available to the app
export default DataPreviewList;
