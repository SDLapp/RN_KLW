//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,StatusBar, } from 'react-native';
import { connect } from 'react-redux';

import {SCREEN_WIDTH,} from '../config/globalsize';
import {app_name,} from '../config/globalconst';
import globalcolor from '../config/globalcolor'
import {createAction} from '../utils'

/**
 * 站点类型 （颗粒物、标准站）
*/

@connect(({app,})=>({PolluntTypes:app.PolluntTypes,}))
class PolluntTypeSelect extends Component {
    
    selectPolluntType = () =>{}

    render() {
        return (
            <View style={styles.container}>
                {/*<StatusHeader />*/}
                <StatusBar
                    barStyle="light-content"
                />
                <Image style={[{width:SCREEN_WIDTH,height:SCREEN_WIDTH*747/1080,},]}
                        source={require('../images/bg_sys_group.png')}/>
                <View style={[{marginTop:20,width:SCREEN_WIDTH,
                                height:SCREEN_WIDTH*747/1080,
                                position:'absolute',alignItems:'center'
                                ,justifyContent:'center',},]}>
                    <Image  style={[{width:SCREEN_WIDTH/4,height:SCREEN_WIDTH*(89)/(265*4),},]}
                            source={require('../images/logo_sys_group.png')}/>
                    <Text style={[{backgroundColor:'#00000000',color:globalcolor.white,
                                    marginTop:30,fontSize:24,},]}>{app_name}</Text>
                </View>
                <View style={[{width:SCREEN_WIDTH,flex:1,backgroundColor:globalcolor.white,justifyContent:'center',flexDirection:'row',padding:16,},]}>
                    {this.props.PolluntTypes.length<5?
                        this.props.PolluntTypes.map((item,key)=>{
                            return <TouchableOpacity key={item.ID} 
                                        onPress={()=>{
                                            this.props.dispatch(createAction('app/selectPolluntType')({PolluntType:item.ID}));
                                        }}>
                                <View style={[{width:(SCREEN_WIDTH-96)/2,height:(SCREEN_WIDTH-96)*7/18,
                                                backgroundColor:'grey',margin:16,backgroundColor:globalcolor.white,
                                            borderColor:globalcolor.borderLightGreyColor,borderWidth:0.5,borderRadius:8,
                                            alignItems:'center'},styles.shadowStyle,]}>
                                        <Image
                                            style={[{width:(SCREEN_WIDTH-96)*3/16,height:(SCREEN_WIDTH-96)*3/16,
                                                marginTop:(SCREEN_WIDTH-96)/40,marginBottom:(SCREEN_WIDTH-96)/40,},]} 
                                            source={item.ID==36?require('../images/ic_air.png')
                                                        :item.ID==18?require('../images/ic_particulate.png')
                                                            :require('../images/ic_air.png')}/>
                                        <Text style={[{},]}>{item.Name}</Text>
                                        <View style={[{width:(SCREEN_WIDTH-96)*3/10,height:4,
                                            position:'absolute',bottom:0,left:(SCREEN_WIDTH-96)/10,
                                            backgroundColor:item.ID==36?globalcolor.air_quality_color
                                                                :item.ID==18?globalcolor.PM_color:globalcolor.air_quality_color,},]}></View>
                                </View>
                            </TouchableOpacity>
                        })
                        :<View></View>}
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
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
export default PolluntTypeSelect;
