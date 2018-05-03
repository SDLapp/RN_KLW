//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,TouchableWithoutFeedback, } from 'react-native';

import { connect } from 'react-redux';

import {createAction,} from '../../utils';
import globalcolor from '../../config/globalcolor'
import {SCREEN_WIDTH,} from '../../config/globalsize'
/**
 * 详情页顶部控制控件
*/
// create a component
@connect(({pointdetail})=>({ServiceType:pointdetail.ServiceType,}),null,null,{withRef:true})
class TagView extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            tags:[
                {
                    text:'实时',
                    id:0,
                },
                {
                    text:'分钟',
                    id:1,
                },
                {
                    text:'小时',
                    id:2,
                },
                {
                    text:'日均',
                    id:3,
                },
                {
                    text:'查询',
                    id:4,
                },
                {
                    text:'污染物',
                    id:5,
                },
                // {
                //     text:'超标',
                //     id:6,
                // },
                // {
                //     text:'报警',
                //     id:7,
                // },
                {
                    text:'对比',
                    id:8,
                },
            ],
            selectTag:2,
            contentHeight:0,
        };
    }
    render() {
        
        let tagSizeOneLine = 5;
        let tagWidth = (SCREEN_WIDTH-8*2-4*(tagSizeOneLine-1))/tagSizeOneLine;
        let lineSize = parseInt(this.state.tags.length/5)+(this.state.tags.length%5>0?1:0);
        let tagSumHeight = 8*2+32*lineSize+4*(lineSize-1);
        return (
            <View style={[{width:SCREEN_WIDTH,height:tagSumHeight,flexWrap:'wrap',flexDirection:'row',
                                padding:8,},]}>
                    {this.state.tags.map((item,key)=>{
                        return(
                            <TouchableWithoutFeedback 
                                key={item.id}
                                onPress={()=>{
                                    if (item.id == 4) {
                                        this.props._showDatePicker();
                                    } else if (item.id == 5) {
                                        this.props._showPollutantTypeDialog();
                                    } else if (item.id == 8) {
                                        this.props._showCompareDialog();
                                    } else {
                                        this.props.dispatch(createAction('pointdetail/updateState')(
                                            {ServiceType:item.id,selectDate:null,}));
                                        this.props.dispatch(createAction('pointdetail/refresh')());
                                    }
                                    if (item.id!=4&&item.id!=5&&item.id!=8) {
                                        this.setState({
                                            selectTag:item.id,
                                        });
                                    }
                                }}
                                    style={[{width:tagWidth,height:32,
                                            marginRight:key%5==4?0:4,
                                            backgroundColor:'blue',},]}>
                                    <View style={[{
                                            width:tagWidth,height:32,
                                            marginRight:key%5==4?0:4,
                                            backgroundColor:(item.id==this.props.ServiceType)?globalcolor.titleBlue:'white',
                                            borderRadius:16,
                                            borderColor:globalcolor.borderLightGreyColor,
                                            borderWidth:0.5,
                                            marginBottom:4,
                                            justifyContent:'center',alignItems:'center',
                                        },styles.shadowStyle,]}>
                                        <Text style={[{color:item.id==this.props.ServiceType?'white':'black'},]}>{item.text}</Text>
                                    </View>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View>
        );
    }
    setTag(id){
        this.state.tags.map((item,key)=>{
            if (item.id == id) {
                this.setState({
                    selectTag:key,
                });
            }
        })
        
    }
    getTag(){
        return this.state.tags[this.state.selectTag].id;
    }
}

// define your styles
const styles = StyleSheet.create({
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
export default TagView;
