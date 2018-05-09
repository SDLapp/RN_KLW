//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Image,Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import CodePush from "react-native-code-push";


import { clearToken,  } from '../../../dvapack/storage';
import { NavigationActions,createAction } from '../../../utils';
import globalcolor from '../../../config/globalcolor';
import {doUpdate} from '../../../utils/CodePushUtil';
import LogoutDialog from '../../../components/Me/LogoutDialog';
import ModalParent from '../../../components/common/ModalParent';
import { saveStorage, loadStorage } from '../../../dvapack/storage';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 
 * HelenChen
 * @class 个人中心
 * @extends {Component}
 */ 
@connect(({app})=>({user:app.user}))
class MySelf extends PureComponent {

    constructor(props){
        super(props)
        this.state={
            syncMessage:null,
        }
    }

    componentDidMount() {
        this.props.dispatch(NavigationActions.init());
    }

    static navigationOptions={
        title: '我的信息',
        tabBarLable: '我的信息',
        headerBackTitle: null,
        header: null,
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#4f6aea' },
        tabBarIcon: ({ focused, tintColor }) =>
          <Image style={{width:24,height:24}} source={focused?require('../../../images/tab_wo_hover.png'):require('../../../images/tab_wo.png')} />
      }
      //退出
      doLogout = async () => {
          //清除记录
        clearToken();
        this.props.dispatch(createAction('datapreview/updateState')({groupItems:[]}));
        const loginmsg = await loadStorage('loginmsg');
        if (!loginmsg.isremenber) {
            loginmsg.password = '';
        }
        await saveStorage('loginmsg', loginmsg);
        this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
      }
      //通讯录
      phoneList = () =>{
          this.props.dispatch(NavigationActions.navigate({routeName:'MyPhoneList'}));
      }
      //系统设置
      setting = () =>{
        this.props.dispatch(NavigationActions.navigate({routeName:'MySetting'}));
      }
      //版本更新
      update = () =>{
        doUpdate(this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this),);
      }
      //显示系统简介
      showSystemDescription = ()=>{
        this.props.dispatch(NavigationActions.navigate({routeName:'SystemDescription'}));
      }   
    /**
     * 热更新返回值处理方法
    */
      codePushStatusDidChange(syncStatus) {
        switch(syncStatus) {
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            this.setState({ syncMessage: "正在检测更新内容." });
            break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.setState({ syncMessage: "正在下载更新包." });
            break;
          case CodePush.SyncStatus.AWAITING_USER_ACTION:
            // this.setState({ syncMessage: "Awaiting user action." });
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            this.setState({ syncMessage: "正在安装更新包." });
            break;
          case CodePush.SyncStatus.UP_TO_DATE:
            this.setState({ syncMessage: "当前版本为最新版本.", progress: false });
            
            break;
          case CodePush.SyncStatus.UPDATE_IGNORED:
            this.setState({ syncMessage: "Update cancelled by user.", progress: false });
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
            break;
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            this.setState({ syncMessage: "An unknown error occurred.", progress: false });
            break;
        }
      }
    
      codePushDownloadDidProgress(progress) {
          
      }
      
      _hideDialog = () => {
        this._modalParent.hideModal();
      }

    render() { 
        return (
            <View style={{flexDirection:'column',backgroundColor:globalcolor.lightGreyBackground,flex:1,}}>
                <View style={[{backgroundColor:globalcolor.titleBlue,flexDirection:'row',justifyContent:'center',
                                    width:SCREEN_WIDTH,height:69,marginBottom:16,},]} >
                                    <Text style={[{color:globalcolor.white,fontSize:20,marginTop:30,}]}>{'我的'}</Text>
                </View>
                <Image source={require('../../../images/msg_bk.png')} style={{height:SCREEN_WIDTH/2-30}}></Image>
                <View style={{marginTop:94, flexDirection:'column',alignItems:'center',height:SCREEN_WIDTH/2-30,backgroundColor:'#00000000',justifyContent:'center',...StyleSheet.absoluteFillObject}}>
                     <Image source={require('../../../images/userlogo.png')} style={{width:70,height:70}}></Image>
                     <Text style={{fontSize:17,color:'#ffffff',marginTop:10}}>{this.props.user&&this.props.user.User_Name?this.props.user.User_Name:'用户名'}</Text>
                </View>
                <TouchableOpacity style={[styles.itemViewStyle,{marginTop:16,marginBottom:16,},]} onPress={()=>{
                    this.phoneList()
                }}>
                    <Image source={require('../../../images/address_icon.png')} style={styles.itemImageStyle}></Image>
                    <Text style={styles.itemTextView}>通讯录</Text>
                    <Image source={require('../../../images/arr_right_icon.png')} style={styles.itemRightStyle}></Image>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemViewStyle} onPress={()=>{
                    this.update()
                }}>
                    <Image source={require('../../../images/updata_icon.png')} style={styles.itemImageStyle}></Image>
                    <Text style={styles.itemTextView}>版本更新</Text>
                    <Text style={styles.itemTextView}>{this.state.syncMessage}</Text>
                    <Image source={require('../../../images/arr_right_icon.png')} style={styles.itemRightStyle}></Image>
                </TouchableOpacity>  
                <TouchableOpacity style={styles.itemViewStyle} onPress={()=>{
                    this.showSystemDescription();
                }}>
                    <Image source={require('../../../images/patrol_detail_select.png')} style={styles.itemImageStyle}></Image>
                    <Text style={styles.itemTextView}>系统说明</Text>
                    <Image source={require('../../../images/arr_right_icon.png')} style={styles.itemRightStyle}></Image>
                </TouchableOpacity>

                <TouchableOpacity style={{flexDirection:'row',height:40,
                                            backgroundColor:'#ffffff',alignItems:'center',
                                            marginTop:20,borderBottomColor:globalcolor.borderLightGreyColor,
                                            borderBottomWidth:1,}} 
                onPress={()=>{
                    this._modalParent.showModal();
                }}>
                    <Image source={require('../../../images/myself_exit.png')} style={styles.itemImageStyle}></Image>
                    <Text style={styles.itemTextView}>退出登录</Text>
                </TouchableOpacity> 
                <ModalParent ref={ref=>this._modalParent=ref}>
                    <LogoutDialog hideDialog={()=>{this._hideDialog();}} doLogout={()=>{this.doLogout();}}/>
                </ModalParent>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    itemViewStyle:{
        flexDirection:'row',
        height:40,
        backgroundColor:'#ffffff',
        alignItems:'center',
        marginBottom:1,
        borderBottomColor:globalcolor.borderLightGreyColor,
        borderBottomWidth:1,
    },
    itemImageStyle:{
        width:15,
        height:15,
        marginLeft:10
    },
    itemRightStyle:{
        width:15,
        height:15,
        marginRight:10
    },
    itemTextView:{
        fontSize:13,
        color:"#222222",
        marginLeft:10,
        flex:1
    }

});

//make this component available to the app
export default MySelf;
