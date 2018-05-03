//import liraries
import React, { Component } from 'react';
import { StyleSheet, WebView, } from 'react-native';
import LoadingComponent from '../../components/common/LoadingComponent'
import globalcolor from '../../config/globalcolor'

// create a component
class SystemDescription extends Component {
    static navigationOptions =({router,navigation})=>{
        return{
            title: '系统说明',
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: globalcolor.titleBlue },
        }
    }
    render() {
        return (
            <WebView style={styles.container}
            source={{uri:'https://api.chsdl.cn/PMS15/AppConfig/system_des_files/temp.html'}}
            startInLoadingState={true}
            renderLoading={() => {
                return <LoadingComponent Message={'正在努力加载数据'}/>
            }}>
            </WebView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

//make this component available to the app
export default SystemDescription;
