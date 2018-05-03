//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,FlatList,TouchableWithoutFeedback,Animated, Button, } from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import globalcolor from '../../config/globalcolor';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../config/globalsize';

/**
 * 污染物类型选择dialog
*/
// create a component
@connect()
class LogoutDialog extends PureComponent {

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
                        <View style={{height:32,width:32,marginLeft:4,}}></View>            
                        <Text style={[styles.titleText,{fontSize:16}]}>注销登录</Text>
                        <TouchableOpacity style={[styles.closeIconTouchable]}
                            onPress={()=>{this.props.hideDialog();}}>
                            <Icon name={'md-close-circle'} size={32} style={{color:'white'}}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={[{fontSize:18,marginTop:16,marginBottom:16,}]}>
                        {'您是否确认注销登录'}
                    </Text>
                    <View style={[{flexDirection:'row',width:SCREEN_WIDTH*3/4-1,justifyContent:'flex-end'}]}>
                        <Button type={'default'} onPress={()=>{this.props.hideDialog();}} title={'取消'}></Button>
                        <Button type={'default'} 
                            onPress={()=>{this.props.doLogout();this.props.hideDialog();}} 
                            style={{marginLeft:8,marginRight:8,}}
                            title={'确定'}></Button>
                        <View style={{width:8,}}></View>
                    </View>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        height:130,
        width:SCREEN_WIDTH*3/4,
        borderRadius:8,
        borderWidth:0.5,
        borderColor:'white',
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
        fontWeight:'bold',
    },
    closeIconTouchable:{
        height:32,
        width:32,
        justifyContent:'center',
        alignItems:'center',
        marginRight:4,
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

export default LogoutDialog;
