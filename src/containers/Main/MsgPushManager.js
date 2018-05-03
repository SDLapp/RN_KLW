//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import {List,Switch } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';

/**
 * 消息管理
 * HelenChen
 * @class MsgPustManager
 * @extends {Component}
 */
@connect()
class MsgPushManager extends Component {
    static navigationOptions = {
        title: '消息管理',
        headerTintColor: '#fff',
        headerBackTitle: null,
        headerStyle: { backgroundColor: '#4f6aea' },
      }

    render() {
        const { getFieldProps } = this.props.form;
        return (
            <View style={styles.container}>
                <List>
                <View style={styles.itemViewStyle}>
                    <Text style={styles.textStyle}>声音提醒</Text>
                    <Switch style={{marginRight:10}} 
                        {...getFieldProps('Switch1', {initialValue: false,valuePropName: 'checked'})}
                        onClick={(checked) => {

                        }} />
                </View>
                <View style={styles.itemViewStyle}>
                <Text style={styles.textStyle}>震动提醒</Text>
                <Switch style={{marginRight:10}} 
                    {...getFieldProps('Switch2', {initialValue: false,valuePropName: 'checked'})}
                    onClick={(checked) => {

                    }} />
                </View>
                <View style={styles.itemViewStyle}>
                <Text style={styles.textStyle}>呼吸灯提醒</Text>
                <Switch style={{marginRight:10}} 
                    {...getFieldProps('Switch3', {initialValue: true,valuePropName: 'checked'})}
                    onClick={(checked) => {

                    }} 
                />
                </View>
                </List>   
            </View>
           
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column',
        backgroundColor: '#efefef',
    },
    itemViewStyle:{
        flexDirection:'row',
        height:50,
        alignItems:'center',
        marginTop:2
    },
    textStyle:{
        fontSize:16,
        color:'gray',
        marginLeft:10,
        marginRight:10,
        flex:1
    }
});

//make this component available to the app

export default createForm()(MsgPushManager);
