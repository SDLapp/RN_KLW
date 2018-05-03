//import liraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text,Dimensions } from 'react-native';
import { createAction,} from '../../utils';
import {List,InputItem,Toast,Button} from 'antd-mobile';
import {loadToken} from '../../dvapack/storage';
import { createForm } from 'rc-form';

const SCREEN_WIDTH=Dimensions.get('window').width;
/**
 * 修改密码
 * Helenchen
 * @class MyClass authorCode,userPwdNew,userPwdTwo
 * @extends {Component}
 */
@connect(({ app }) => ({errorMsg: app.errorMsg }))
class MyChangePsw extends Component {
      static navigationOptions = {
        title: '修改密码',
        headerTintColor: '#fff',
        headerBackTitle: null,
        headerStyle: { backgroundColor: '#4f6aea' },
      }

    state={
        hasError1:false,
        passwordOld:'',
        password1:'',
        errorCode:-1,
        hasError2:false,
        password2:'',
    }
    onChange=(value)=>{
        this.setState({
            passwordOld:value
        });
    }
    onChange1=(value)=>{
        if(value.replace(/\s/g,'').length<6){
            this.setState({
                hasError1:true,
                errorCode:1,
            });
        }else{
            this.setState({
                hasError1:false,
                errorCode:-1
            });
        }
        this.setState({
            password1: value
          });
    }
    onChange2=(value)=>{
        if(value.replace(/\s/g,'').length<6){
            this.setState({
                hasError2:true,
                errorCode:1
            });
        }else{
            this.setState({
                hasError2:false,
                errorCode:-1
            });
        }
        if(value!==this.state.password1){
            this.setState({
                hasError2:true,
                errorCode:2
            });
        }else{
            this.setState({
                hasError2:false,
                errorCode:-1
            });
        }
        this.setState({
            password2: value
          });

    }
    onErrorClick=()=>{
        if(this.state.errorCode===1){
            Toast.info('密码不能少于6位！',1);
        }
        if(this.state.errorCode==2){
            Toast.info('两次输入的新密码不一致！',1);
        }
    }
    commitPwd = async() => {
        if(this.state.errorCode !== -1){
            Toast.info('输入内容有错，请检查！',1);
            return false;
        }
        const user=await loadToken();
        this.props.dispatch(createAction('app/ChangePsw')({
            authorCode:user.User_ID,
            userPwdOld:this.state.passwordOld,
            userPwdNew:this.state.password1,
            userPwdTwo:this.state.password2
        }));
    }
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <View>
                 <List>
                    <InputItem
                     type="password"
                     placeholder="请输入原始密码"
                     //动态更新并记住onchange方法里state passwordOld值
                     onChange={this.onChange}
                     value={this.state.passwordOld}>
                     </InputItem>

                     <InputItem
                     {...getFieldProps('password1')}
                        type="password"
                        placeholder="请输入新密码"
                        error={this.state.hasError1}
                        onErrorClick={this.onErrorClick}
                        onChange={this.onChange1}
                        value={this.state.password1}/>

                    <InputItem
                    {...getFieldProps('password2')}
                    type="password"
                    placeholder="重新输入新密码"
                    error={this.state.hasError2}
                    onErrorClick={this.onErrorClick}
                    onChange={this.onChange2}
                    value={this.state.password2}/>
                 </List>
                 <View>
                    <Text>{this.props.errorMsg!==''?null:this.props.errorMsg}</Text>
                 </View>
                 <Button className="btn" style={{width:SCREEN_WIDTH-100,height:50,alignSelf:'center',marginTop:30}} type="primary"
                  onClick={this.commitPwd}>提交</Button>
            </View>
        );
    }
}

//make this component available to the app
export default createForm()(MyChangePsw);
