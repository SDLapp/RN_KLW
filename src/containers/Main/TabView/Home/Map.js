//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Modal,TouchableOpacity,Image,} from 'react-native';

import { connect } from 'react-redux';
import {MapView, Marker,} from 'react-native-amap3d'

import {createAction,NavigationActions} from '../../../../utils';
import {SCREEN_WIDTH,} from '../../../../config/globalsize'
import TopSelector from '../../../../components/DataPreview/TopSelector';
import Alert from '../../../../components/DataPreview/Alert';
import ModalParent from '../../../../components/common/ModalParent';
import {DATA_PREVIEW,} from '../../../../config/globalconst';
import MyMapView from '../../../../components/DataPreview/MyMapView';
import LoadingComponent from '../../../../components/common/LoadingComponent'

/**
 * 地图
*/
// create a component
const rtnVal=[];
@connect(({datapreview,loading,})=>({
    pollutantBeens:datapreview.pollutantBeens,
    selectedPollutantIndex:datapreview.selectedPollutantIndex,
    groupListLoading:loading.effects['datapreview/getGroupList'],
    pointWithDataLoading:loading.effects['datapreview/loadPointWithData'],
    }))
class Map extends PureComponent {

    constructor(props){
        super(props);
        this.state={
            // 站点颜色对应的站点状态
            MapLegendBeans:[
                {
                    color:'#5BC142',
                    name:'在线',
                },
                {
                    color:'#B0B0B1',
                    name:'离线',
                },
                {
                    color:'#E00B0B',
                    name:'超标',
                },
                {
                    color:'#B9C303',
                    name:'异常',
                },
            ],
            latitude: 39.806901,
            longitude: 116.397972,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
            modalType:0,
        }
    }

    /**
     * 点击地图上的点，跳转详情页
    */
    _goToDetail = (item) =>{
        this.props.dispatch(NavigationActions.navigate({
            routeName:'PointDetail',
            params:{item:item}
        }));
    }

    _showDatePicker = () =>{
        this.setState({'modalType':datePickerSelected});
        this._modalParent.showModal();
    }
    _hideDatePicker = () =>{
        this._modalParent.hideModal();
    }

    render() {
        return (
            <View style={[styles.container,]}>
                <TopSelector  ref={ref => this._topSelector = ref} showDatePicker={this._showDatePicker}/>
                {
                // this.props.groupListLoading
                // ||this.props.pointWithDataLoading?
                //     <LoadingComponent Message={'正在努力加载数据'}/>
                //     :
                    <MyMapView />
                }
                <View style={[styles.filterWidth,{position:'absolute',height:10,backgroundColor:'red',top:100,right:10,},]}>
                    <View style={[styles.filterWidth,styles.filterHeight,styles.filterTitle,{},]}>
                        <Text style={[styles.filterTitleTextColor,]}>监测点</Text>
                    </View>
                    {this.props.pollutantBeens.map((item,key)=>{
                        return <TouchableWithoutFeedback
                            onPress={
                                ()=>{
                                    this.props.dispatch(createAction('datapreview/updateState')({selectedPollutantIndex:key}));
                                }
                            } 
                            key={key} 
                            style={[styles.filterWidth,styles.filterHeight,
                                this.props.selectedPollutantIndex==key?styles.filterItem:styles.filterItemUnselected,]}
                            >
                            <View style={[styles.filterWidth,styles.filterHeight,
                                this.props.selectedPollutantIndex==key?styles.filterItem:styles.filterItemUnselected,]}>
                                <Text style={[styles.filterItemTextColor,]}>{item.PollutantName}</Text>
                            </View>
                            
                        </TouchableWithoutFeedback>
                    })}
                </View>
                <View style={[{position:'absolute',left:2,bottom:2,flexDirection:'row'
                            ,minHeight:24,minWidth:72,}]}>
                            <View style={[{height:24,width:56,alignItems:'center',
                                    justifyContent:'center',backgroundColor:'#f6f6f6',},]}>
                                <Text>图例：</Text></View>
                            {this.state.MapLegendBeans.map((item,key)=>{
                                return(
                                <View key={item.name} style={[{height:24,width:56,alignItems:'center',
                                    justifyContent:'center',backgroundColor:item.color,},]}>
                                <Text>{item.name}</Text></View>)
                            })}
                </View>
                <ModalParent ref={ref=>this._modalParent=ref}>
                    {
                        <Alert 
                            mSetSearchType ={(searchType)=>{ this.props.dispatch(createAction('datapreview/updateState')({searchType}))}}
                            mGetParentView={()=>{return DATA_PREVIEW}}
                            mCancelcallback={()=>{this._hideDatePicker();}} 
                            mcallback={(index,date)=>{this._topSelector.wrappedInstance._changeMTag(index,date)}} />
                    }
                </ModalParent> 
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:SCREEN_WIDTH,
    },
    filterWidth:{
        width:60,
    },
    filterHeight:{
        height:24,
    },
    filterTitle:{
        backgroundColor:'#EFFFFFFF',
        alignItems:'center',justifyContent:'center',
    },
    filterItem:{
        backgroundColor:'#2E993F',
        alignItems:'center',justifyContent:'center',
    },
    filterItemUnselected:{
        backgroundColor:"#383838",
        opacity:0.8,
        alignItems:'center',justifyContent:'center',
    },
    filterTitleTextColor:{
        color:'#2E993F',
    },
    filterItemTextColor:{
        color:'#FFF',
    },
});

//make this component available to the app
export default Map;
