'use strict';
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux'
import DefinedDatePicker from './DefinedDatePicker'
import {Button} from 'antd-mobile'

import { SCREEN_WIDTH, WINDOW_HEIGHT } from '../../config/globalsize';
import { hours } from '../../config/globalconst';
import globalcolor from '../../config/globalcolor';
import {xiaoshi,ri,POINT_DETAIL,DATA_PREVIEW,} from '../../config/globalconst';

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, WINDOW_HEIGHT*2/5];//[300, 214];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

const styles = StyleSheet.create({
  container: {
    position:"absolute",
    width:width,
    height:height,
    left:left,
    top:top,
  },
  mask: {
    justifyContent:"center",
    backgroundColor:"#383838",
    opacity:0.8,
    position:"absolute",
    width:width,
    height:height,
    left:left,
    top:top,
  },
  tip: {
    width:aWidth,
    height:aHeight,
    left:middleLeft,
    backgroundColor:"#fff",
    alignItems:"center",
    justifyContent:"space-between",
  },
});

/**
 * 自定义时间选择器，日期、小时两种模式
*/
@connect(({datapreview,pointdetail})=>({
  seasons:datapreview.seasons,
  value:datapreview.searchDateValue,
  pSearchType:pointdetail.searchType,
  dSearchType:datapreview.searchType,
}))
export default class Alert extends PureComponent {
  parent ={};

  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      opacity: new Animated.Value(0),
      title: "",
      choose1: "",
      choose2: "",
      hide: true,
      riButtonColor:'default',
      xiaoshiButtonColor:'default',
    };
    let parentView = this.props.mGetParentView();
    let searchType = props.dSearchType;
    if (parentView == DATA_PREVIEW) {
      searchType = props.dSearchType;
    } else if (parentView == POINT_DETAIL) {
      searchType = props.pSearchType;
    }
    if (searchType=='ri'){
      this.state = {
        offset: new Animated.Value(0),
        opacity: new Animated.Value(0),
        title: "",
        choose1: "",
        choose2: "",
        hide: true,
        riButtonColor:'primary',
        xiaoshiButtonColor:'default',
      };
    } else{
      this.state = {
        offset: new Animated.Value(0),
        opacity: new Animated.Value(0),
        title: "",
        choose1: "",
        choose2: "",
        hide: true,
        riButtonColor:'default',
        xiaoshiButtonColor:'primary',
      };
    }
  }
  getSearchType = ()=>{
    let parentView = this.props.mGetParentView();
    let searchType = this.props.dSearchType;
    if (parentView == DATA_PREVIEW) {
      searchType = this.props.dSearchType;
    } else if (parentView == POINT_DETAIL) {
      searchType = this.props.pSearchType;
    }
    return searchType;
  }

  render() {
    if(this.state.hide){
      return (<View />)
    } else {
      return (
            <View style={[styles.container,]} >
              <TouchableWithoutFeedback onPress={()=>{
              this.props.mCancelcallback();
              }}>
              <Animated.View style={ styles.mask } >
              </Animated.View>
              </TouchableWithoutFeedback>
              <Animated.View style={[styles.tip,{marginTop:15,} , {transform: [{
                  translateY: this.state.offset.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, (height-aHeight -34)]
                  }),
              }]
              }]}>
                <View style={{backgroundColor:'white',height:WINDOW_HEIGHT,width:SCREEN_WIDTH,}}>
                  <View style={{width:SCREEN_WIDTH,flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:64,backgroundColor:globalcolor.datepickerTitleColor,
                                borderBottomColor:globalcolor.datepickerTitleBorderColor,borderBottomWidth:1,borderTopColor:globalcolor.datepickerTitleBorderColor,borderTopWidth:3,}}>
                    <TouchableOpacity style={[{height:60,width:128,justifyContent:'center',alignItems:'flex-start',}]} onPress={this.iknow.bind(this)} >
                      <Text style={{color:globalcolor.datepickerGreyText,marginLeft:8,fontSize:16,}}>取消</Text></TouchableOpacity>
                    <Text style={{color:globalcolor.datepickerGreyText,fontSize:20,}}>选择时间</Text>
                    <TouchableOpacity style={[{height:60,width:128,justifyContent:'center',alignItems:'flex-end',}]} onPress={this.choose.bind(this)}>
                      <Text style={{color:globalcolor.datepickerBlueText,marginRight:8,fontSize:16,}}>确定</Text></TouchableOpacity>
                  </View>
                  <View  style={{width:SCREEN_WIDTH,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',height:64,}}>
                    <Button type={this.state.riButtonColor} onClick={this.riButton.bind(this)}>日均</Button>
                    <Button type={this.state.xiaoshiButtonColor} onClick={this.xiaoshiButton.bind(this)} style={{marginLeft:8,marginRight:8,}}>小时</Button>
                  </View>
                  <DefinedDatePicker  mGetSearchType={()=>{return this.getSearchType();}} ref="definedDatePicker" style={{width:SCREEN_WIDTH,marginTop:64,}}/>
                </View>
              </Animated.View>
            </View>
      );
    }
  }

  componentDidMount() {
      this.show('','','',this);
  }
  /**
   * 切换至日期选择模式
  */
  riButton(){
    this.props.mSetSearchType('ri');
    if (this.props.seasons.length == 4) {
      this.props.seasons.splice(3,1);
    }
    this.setState({
      riButtonColor:'primary',
      xiaoshiButtonColor:'default',
    });
  }
  /**
   * 切换至小时选择模式
  */
  xiaoshiButton(){
    this.props.mSetSearchType('xiaoshi');
    if (this.props.seasons.length == 3) {
      this.props.seasons.splice(3,0,hours);
    }
    this.setState({
      riButtonColor:'default',
      xiaoshiButtonColor:'primary',
    });
  }

  //显示动画
  in() {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          easing: Easing.linear,
          duration: 500,
          toValue: 0.8,
        }
      ),
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.linear,
          duration: 500,
          toValue: 1,
        }
      )
    ]).start();
  }

  //隐藏动画
  out(){
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          easing: Easing.linear,
          duration: 500,
          toValue: 0,
        }
      ),
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.linear,
          duration: 500,
          toValue: 0,
        }
      )
    ]).start();

    setTimeout(
      () => this.setState({hide: true}),
      500
    );
  }

  //取消
  iknow(event) {
    this.props.mCancelcallback();
  }

  //选择
  choose(msg) {
    let searchDate = '2017-12-14 14:00:00';
    if(this.getSearchType() == 'ri'){
      searchDate = this.props.value[0]+'-'
                  +this.props.value[1]+'-'
                  +this.props.value[2]+' '
                  +'00:00:00';
      this.props.mcallback(ri,searchDate);
    } else{
      searchDate = this.props.value[0]+'-'
            +this.props.value[1]+'-'
            +this.props.value[2]+' '
            +this.props.value[3]
            +':00:00';
      this.props.mcallback(xiaoshi,searchDate);
    }
    this.props.mCancelcallback();
  }

  show(title: string, choose1:string,choose2:string ,obj:Object) {
    this.parent = obj;
    if(this.state.hide){
      this.setState({title: title, choose1: choose1, choose2: choose2, hide: false}, this.in);
    }
  }
}
