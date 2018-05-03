//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,Dimensions } from 'react-native';
import { connect } from 'react-redux';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 个人详情
 * Helenchen
 * @class MyClass
 * @extends {Component}
 */
@connect()
class PersonalMsg extends Component {
    constructor(props){
        super(props);
    }
    static navigationOptions = {
        title: '人员信息',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#4f6aea' }
      }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Image source={require('../../images/msg_bk.png')} style={{height:SCREEN_WIDTH/2-30}}></Image>
                    <View style={{flexDirection:'column',alignItems:'center',height:SCREEN_WIDTH/2-30,backgroundColor:'#00000000',justifyContent:'center',...StyleSheet.absoluteFillObject}}>
                        <Image source={require('../../images/ueser_icon.png')} style={{width:70,height:70}}></Image>
                        <Text style={{fontSize:17,color:'#ffffff',marginTop:10}}>
                            {
                                this.props.navigation.state.params.personalInfo?
                                this.props.navigation.state.params.personalInfo.name?
                                this.props.navigation.state.params.personalInfo.name:'用户名':'用户名'
                            }
                        </Text>
                    </View>
                </View>
                <View style={styles.itemStyle}>
                    <Text style={{fontSize:17,color:'#333333',marginLeft:10,marginRight:10}}>
                        {
                            this.props.navigation.state.params.personalInfo?
                            this.props.navigation.state.params.personalInfo.phone?
                            this.props.navigation.state.params.personalInfo.phone:'未填写电话':'未填写电话'
                        }
                    </Text>
                    <Text style={{fontSize:14,color:'#909090',marginLeft:10,marginRight:10,marginTop:10}}>电话</Text>
                </View>
                <View style={styles.itemStyle}>
                    <Text style={{fontSize:17,color:'#333333',marginLeft:10,marginRight:10}}>
                        {
                            this.props.navigation.state.params.personalInfo?
                            this.props.navigation.state.params.personalInfo.email?
                            this.props.navigation.state.params.personalInfo.email:'未填写邮箱':'未填写邮箱'
                        }
                    </Text>
                    <Text style={{fontSize:14,color:'#909090',marginLeft:10,marginRight:10,marginTop:10}}>邮箱</Text>
                </View>
                <View style={styles.itemStyle}>
                    <Text style={{fontSize:17,color:'#333333',marginLeft:10,marginRight:10}}>
                        {
                            this.props.navigation.state.params.personalInfo?
                            this.props.navigation.state.params.personalInfo.gropname?
                            this.props.navigation.state.params.personalInfo.gropname:'未填写单位':'未填写单位'
                        }
                    </Text>
                    <Text style={{fontSize:14,color:'#909090',marginLeft:10,marginRight:10,marginTop:10}}>单位</Text>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        flex: 1,
        backgroundColor: '#efefef',
    },
    itemStyle:{
        flexDirection:'column',
        height:60,
        justifyContent:'center',
        marginTop:1
    }
});

//make this component available to the app
export default PersonalMsg;
