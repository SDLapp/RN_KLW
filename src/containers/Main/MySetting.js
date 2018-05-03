//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,Dimensions,TouchableOpacity } from 'react-native';
import { NavigationActions } from '../../utils';
import { connect } from 'react-redux';

const SCREEN_WIDTH=Dimensions.get('window').width;
/**
 * 我的设置
 * Helenchen
 * @class MySetting
 * @extends {Component}
 */
@connect()
class MySetting extends Component {
    static navigationOptions = ({
        navigation,
        screenProps
      }) => ({
        headerTitle: '我的设置',
        headerBackTitle: null,
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#4f6aea'
        },
      });
       
    constructor(props){
        super(props);
    } 
    //修改密码界面
    changePsw=()=>{
        this.props.dispatch(NavigationActions.navigate({routeName:'MyChangePsw'}));
    }
    //消息推送管理
    msgPustManager=()=>{
        this.props.dispatch(NavigationActions.navigate({routeName:'MsgPushManager'}));
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity  style={styles.viewStyle} 
                                        onPress={()=>this.changePsw() }>
                    <Text style={{fontSize:16,color:'gray',marginLeft:10, marginRight:10,flex:1}}>修改密码</Text>
                    <Image source={require('../../images/arr_right_icon.png')} style={styles.itemRightStyle}></Image>
                </TouchableOpacity>
            </View>
            
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
        flexDirection:'column',
        width:SCREEN_WIDTH,
    },
    viewStyle:{
        flexDirection:'row',
        height:40,
        marginTop:2,
        alignItems:'center',
        backgroundColor:'#ffffff'
    },
    itemRightStyle:{
        width:15,
        height:15,
        marginRight:10,
        alignItems:'center',
    },
});

//make this component available to the app
export default MySetting;
