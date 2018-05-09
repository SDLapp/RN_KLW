//import liraries
import React, { Component } from 'react';
import { View,StyleSheet,Dimensions, Text } from 'react-native';
import { connect } from 'react-redux';

import globalcolor from '../../config/globalcolor'
import {SCREEN_WIDTH, SCREEN_HEIGHT,} from '../../config/globalsize'
import {POINT_DETAIL,} from '../../config/globalconst';
import {createAction,} from '../../utils';
import ChartView from '../../components/PointDetail/ChartView'
import ChartCompareView from '../../components/PointDetail/ChartCompareView'
import TagView from '../../components/PointDetail/TagView'
import LoadingComponent from '../../components/common/LoadingComponent'
import NoDataComponent from '../../components/common/NoDataComponent'
import Alert from '../../components/DataPreview/Alert'
import ComparePointsList from '../../components/PointDetail/ComparePointsList'
import PollutantTypeList from '../../components/PointDetail/PollutantTypeList'
import DetailList from '../../components/PointDetail/DetailList'
import AxisLineChartScreen from '../../components/PointDetail/AxisLineChartScreen'
import ModalParent from '../../components/common/ModalParent'


/**
 * 详情界面
*/
const contentHeight = SCREEN_HEIGHT-148;

const compareDialogModalSelected = 2,pollutantTypeDialogModalSelected=1,datePickerSelected=0;
// create a component
@connect(({pointdetail,loading,})=>({
    PollutantData:pointdetail.PollutantData,
    refresh:loading.effects['pointdetail/refresh'],
    // firstLoading:pointdetail.firstLoading,
    getPollutantRelated:loading.effects['pointdetail/getPollutantRelated'],
}))
class PointDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectTag:2,
            modalType:0,
        };
    }

    /**
     * 设置路由的title属性，控制详情页title变化
    */
    static navigationOptions =({router,navigation})=>{
        return{
            title: navigation.state.params.item.text,
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: globalcolor.titleBlue },
        }
    }
    /**
     * 对比用dialog的item点击事件
    */
    compareListItemClick = (item,key) => {
        let tabTag = this._tagview.wrappedInstance.getTag();
        this.props.dispatch(createAction('pointdetail/updateState')(
            {searchType:'xiaoshi',ServiceType:8,'compareItem':item,}));
        this.props.dispatch(createAction('pointdetail/refresh')());
        this._hideCompareDialog();
        this._tagview.wrappedInstance.setTag(8);
    }
    /**
     * 污染物列表的item点击事件
    */
    pollutantTypeListItemClick = (item,key) => {
        this.props.dispatch(createAction('pointdetail/updateState')(
            {PollutantSelect:key,})); 
        this.props.dispatch(createAction('pointdetail/refresh')());
        this._hidePollutantTypeDialog();
        this.props.dispatch(createAction('pointdetail/getBdPoints')({
            item:this.props.navigation.state.params.item,
            Pollutant:item 
        }));
    }
    _callBackSetTag = (key)=> {
        this._tagview.wrappedInstance.setTag(8);
    }
    _showCompareDialog = ()=> {
        this.setState({'modalType':compareDialogModalSelected});
        this._modalParent.showModal();
    }
    /**
     * 隐藏对比点选择dialog
    */
    _hideCompareDialog = () =>{
        this._modalParent.hideModal();
    }
    _showPollutantTypeDialog = ()=> {
        this.setState({'modalType':pollutantTypeDialogModalSelected});
        this._modalParent.showModal();
    }
    /**
     * 隐藏污染物选择dialog
    */
    _hidePollutantTypeDialog = () =>{
        this._modalParent.hideModal();
    }
    _showDatePicker = ()=> {
        this.setState({'modalType':datePickerSelected});
        this._modalParent.showModal();
    }
    _hideDatePicker = ()=> {
        this._modalParent.hideModal();
    }
    /**
     * 选择时间进行查询的回调
    */
    _changeMTag = (index,date) =>{
        let tabTag = this._tagview.wrappedInstance.getTag();
        if (tabTag == 8) {
            if (index == 2){
                this.props.dispatch(createAction('pointdetail/updateState')(
                    {selectDate:date,searchType:'xiaoshi',ServiceType:8,}));
            } else if (index == 3) {
                this.props.dispatch(createAction('pointdetail/updateState')(
                    {selectDate:date,searchType:'ri',ServiceType:8,}));
            }
            this.props.dispatch(createAction('pointdetail/updateState')({selectDate:date,ServiceType:8,}));
        } else {
            if (index == 2){
                this.props.dispatch(createAction('pointdetail/updateState')({selectDate:date,ServiceType:2,}));
            } else if (index == 3) {
                this.props.dispatch(createAction('pointdetail/updateState')({selectDate:date,ServiceType:3,}));
            }
        }
        this.props.dispatch(createAction('pointdetail/refresh')());
    }
    

    render() {
        let chartHeight = this._tagview&&this._tagview.wrappedInstance
                            && this._tagview.wrappedInstance!= undefined
                             &&this._tagview.wrappedInstance.getTag()==8?(contentHeight-16)/2:(contentHeight-16)*2/5;
        let listHeight = this._tagview&&this._tagview.wrappedInstance
                            && this._tagview.wrappedInstance!= undefined
                            &&this._tagview.wrappedInstance.getTag()==8?(contentHeight-16)/2:(contentHeight-16)*3/5;
        
        return (
            <View style={styles.container}>
                <TagView 
                _showCompareDialog={this._showCompareDialog}
                _showPollutantTypeDialog={this._showPollutantTypeDialog}
                _showDatePicker={this._showDatePicker}
                ref={ref => this._tagview = ref} 
                    item = {this.props.navigation.state.params.item}/>
                    {
                        this.props.refresh
                        ||this.props.getPollutantRelated?
                        <LoadingComponent Message={'正在努力加载数据'}/>
                        :this.props.PollutantData.length!=0?
                        <View 
                            style={[{flex:1,paddingLeft:8,paddingRight:8,width:SCREEN_WIDTH-16,},]}>
                            <View style={[styles.cardStyle,styles.shadowStyle,{height:chartHeight,}]}>
                                {this._tagview&&this._tagview.wrappedInstance
                                    && this._tagview.wrappedInstance!= undefined
                                    &&this._tagview.wrappedInstance.getTag()==8?
                                    <AxisLineChartScreen
                                        isCompare={true}
                                        item={this.props.navigation.state.params.item}/>
                                    :<AxisLineChartScreen
                                        isCompare={false}
                                        item={this.props.navigation.state.params.item} />}
                            </View>
                            
                            {<DetailList _getTagview={()=>{
                            return this._tagview&&this._tagview.wrappedInstance?this._tagview.wrappedInstance:undefined}}/>}
                        </View>
                        : <NoDataComponent Message={'当前站点'+(this._tagview&&this._tagview.wrappedInstance?
                            this._tagview.wrappedInstance.getTag() == 0?'实时数据不存在':
                            this._tagview.wrappedInstance.getTag() == 1?'分钟数据不存在':
                            this._tagview.wrappedInstance.getTag() == 2?'小时数据不存在':
                            this._tagview.wrappedInstance.getTag() == 3?'日均数据不存在':'数据不存在'
                            :'数据不存在')}/>
                    }
                    
                <ModalParent ref={ref=>this._modalParent=ref}>
                    {
                        this.state.modalType==compareDialogModalSelected
                        ?<ComparePointsList hideCompareDialog={this._hideCompareDialog} itemClick={this.compareListItemClick}/>
                        :this.state.modalType==pollutantTypeDialogModalSelected
                        ?<PollutantTypeList hidePollutantTypeDialog={this._hidePollutantTypeDialog} itemClick={this.pollutantTypeListItemClick}/>
                        :this.state.modalType==datePickerSelected
                        ?<Alert 
                            mSetSearchType ={(searchType)=>{ this.props.dispatch(createAction('pointdetail/updateState')({searchType}))}}
                            mGetParentView={()=>{return POINT_DETAIL}}
                            mCancelcallback={()=>{this._hideDatePicker();}} 
                            mcallback={(index,date)=>{this._changeMTag(index,date)}} />
                        :<Alert 
                            mSetSearchType ={(searchType)=>{ this.props.dispatch(createAction('pointdetail/updateState')({searchType}))}}
                            mGetParentView={()=>{return POINT_DETAIL}}
                            mCancelcallback={()=>{this._hideDatePicker();}} 
                            mcallback={(index,date)=>{this._changeMTag(index,date)}} />
                    }
                    
                </ModalParent>
            </View>
        );
    }
}
const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, height];//[300, 214];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey,
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
    cardStyle:{
        width:SCREEN_WIDTH-32,
        marginBottom:8,
        borderColor:globalcolor.borderGreyColor,
        borderWidth:0.5,
        borderBottomWidth:1 ,
        borderRadius:8,
        backgroundColor:globalcolor.white 
    },
});

//make this component available to the app
export default PointDetail;
