//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,TouchableWithoutFeedback,StatusBar, } from 'react-native';
import {connect} from 'react-redux'

import globalcolor from '../../../config/globalcolor';
import {SCREEN_WIDTH,big_font_size} from '../../../config/globalsize';
import DataPreview from './Home/DataPreview'
import Map from './Home/Map'
import HomeTabView from './Home'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

/**
 * 主页 数据一览和地图的父布局，用以切换控制
*/
let a = true;
@connect()
class DataPreviewAll extends Component {

    static navigationOptions={
        title: '数据一览',
        tabBarLable: '数据一览',
        headerBackTitle: null,
        header: null, 
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#4f6aea' },
        tabBarIcon: ({ focused, tintColor }) =>
          <Image style={{width:24,height:24}} source={focused?require('../../../images/tab_jc_hover.png'):require('../../../images/tab_jc.png')} />
      }
    constructor(props){
        super(props)
        this.state={
            dataPreviewSelected:true,
            mapSelected:false,
        }
    }
    
    componentWillMount(){
        a = this.state.dataPreviewSelected;
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={[styles.radioButtonContent,]} >
                    <View style={[{height: 36, width: SCREEN_WIDTH*0.8,backgroundColor:'#ffffff00',flexDirection:'row',marginTop:16,},]}>
                        <TouchableWithoutFeedback style={[{flex:1,height:36,borderTopLeftRadius:4,borderBottomLeftRadius:4,},]}
                            onPress={()=>{  
                                            this.setState({dataPreviewSelected:true,});
                                            this._ScrollableTabView.goToPage(0);
                                        }}>
                            <View style={[styles.leftStyle,{backgroundColor:this.state.dataPreviewSelected?'#ffffffdd':'#ffffff00',}]}>
                                <Text style={[{color:this.state.dataPreviewSelected?globalcolor.titleTextBlue:'white',fontSize:big_font_size,},]}>监测数据列表</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback style={[{flex:1,height:36,borderTopLeftRadius:4,borderBottomLeftRadius:4,},]}
                            onPress={()=>{
                                this.setState({dataPreviewSelected:false,});
                                this._ScrollableTabView.goToPage(1);
                        }}>
                            <View style={[styles.rightStyle,{backgroundColor:this.state.dataPreviewSelected?'#ffffff00':'#ffffffdd',}]}>
                                <Text style={[{color:this.state.dataPreviewSelected?'white':globalcolor.titleTextBlue,fontSize:big_font_size,},]}>监测数据地图</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                {
                    /*a?<DataPreview style={{width:SCREEN_WIDTH,}} />: <Map />*/
                }
                <ScrollableTabView
                    ref={ref=>this._ScrollableTabView=ref}
                    style={{marginTop: 0, }}
                    initialPage={0}
                    renderTab = {false}
                    renderTabBar={() => <DefaultTabBar style={{height:0,borderWidth: 0}} tabsContainerStyle={{height:0}}
                    textStyle={{height:0,}} inactiveTextColor={'red'}/>}
                    tabBarUnderlineStyle={{height:0,}}
                    locked={true}
                >
                    <DataPreview tabLabel='DataPreview' style={{width:SCREEN_WIDTH,}} />
                    <Map tabLabel='Map' />
                </ScrollableTabView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.white,
        
    },
    radioButtonContent:{
        backgroundColor:globalcolor.titleBlue,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:SCREEN_WIDTH,height:69,
    },
    leftStyle:{
        flex:1,height:36,
        borderTopLeftRadius:4,borderBottomLeftRadius:4,
        borderColor:'white',borderWidth:1,
        justifyContent:'center',alignItems:'center',
    },
    rightStyle:{
        flex:1,height:36,
        borderTopRightRadius:4,
        borderBottomRightRadius:4,borderColor:'white',borderWidth:1,
        justifyContent:'center',alignItems:'center',
    },
});

//make this component available to the app
export default DataPreviewAll;
