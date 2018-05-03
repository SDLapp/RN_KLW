//import liraries
import React, { PureComponent } from 'react';
import { View, StyleSheet,Dimensions,ScrollView,ListView,} from 'react-native';
import { connect } from 'react-redux';
import Head from '../../components/common/alphabetaList/head'
import MainList from '../../components/common/alphabetaList/mainList';
import AlphabetaList from '../../components/common/alphabetaList/alphabetaList';
import py from '../../components/common/alphabetaList/py';
import LoadingComponent from '../../components/common/LoadingComponent';
import NoDataComponent from '../../components/common/NoDataComponent'
import pinyin from 'pinyin';

const SCREEN_WIDTH=Dimensions.get('window').width;
/**
 * 我的通讯录
 * 
 * @class MyClass
 * @extends {Component}
 */
@connect(({app,loading,}) => ({
    contactlist:app.contactlist,
    loadcontactlist:loading.effects['app/loadcontactlist'],}))
class MyPhoneList extends PureComponent { 
    static navigationOptions = ({router,navigation})=>{
        return{
        title: '通讯录',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#4f6aea' },
        }
      }
      
      constructor(props){
        super(props);
        this.state={
            dataSource:this.ds.cloneWithRows([]),
            headHeight:0,
            functionHeight:0
        };
    } 
    getScroll=()=>this.refs.myScroll;
    changeFunctionHeight = (h) => {
        this.setState({ functionHeight: h });
      };
    changeHeadHeight=(h) => {
        this.setState({
          headHeight: h
        });
      };

 
      JsonSort=(array, key) => array.sort((a, b) => {
        if (a && b && a[key] && b[key]) {
          const x = pinyin(a[key].toLowerCase());
          const y = pinyin(b[key].toLowerCase());
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
      })    
        ds=new ListView.DataSource({ rowHasChanged:(v1,v2) => v1 !== v2});
        render() {  
 
            const temp=this.JsonSort(this.props.contactlist,'User_Name'); 
            const data=py(temp);
            return ( 
                <View style={styles.layout}>
                    {
                        
                        this.props.loadcontactlist ?
                        <LoadingComponent Message={'正在加载数据'}/> :
                        this.props.contactlist.length===0 ?
                        <NoDataComponent Message={'没有数据'}/> :
                        <View style={styles.layout}>
                            <Head headHeight={46} changeHeadHeight={e=>this.changeHeadHeight(e)}/>
                            <ScrollView bounces={false} ref="myScroll">
                                 <MainList dataSource={this.ds.cloneWithRows(data)} />
                            </ScrollView>
                            <AlphabetaList scroll={()=>this.getScroll()} 
                            headHeight={this.state.headHeight}
                            functionHeight={this.state.functionHeight}/>
                        </View>
                    }
                   
                </View>
            );
        }
    }    

// define your styles
const styles = StyleSheet.create({
    layout: {
        flex: 1
      }

    
});

//make this component available to the app
export default MyPhoneList;
