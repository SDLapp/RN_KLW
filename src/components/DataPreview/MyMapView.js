//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback,Image,} from 'react-native';

import { connect } from 'react-redux';
import {MapView, Marker,} from 'react-native-amap3d'

import {NavigationActions} from '../../utils';
import {SCREEN_WIDTH,} from '../../config/globalsize'

/**
 * 地图
*/
const rtnVal=[];
@connect(({datapreview,})=>({
    pollutantBeens:datapreview.pollutantBeens,
    pointBeens:datapreview.pointBeens,
    selectedPollutantIndex:datapreview.selectedPollutantIndex,
    }))
class MyMapView extends PureComponent {

    constructor(props){
        super(props);
        this.state={
            // 站点颜色对应的站点状态
            MapLegendBeans:[
                {
                    color:'#5BC142',
                    name:'在线',
                },
                {
                    color:'#B0B0B1',
                    name:'离线',
                },
                {
                    color:'#E00B0B',
                    name:'超标',
                },
                {
                    color:'#B9C303',
                    name:'异常',
                },
            ],
            latitude: 39.806901,
            longitude: 116.397972,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
            modalType:0,
        }
    }

    /**
     * 点击地图上的点，跳转详情页
    */
    _goToDetail = (item) =>{
        this.props.dispatch(NavigationActions.navigate({
            routeName:'PointDetail',
            params:{item:item}
        }));
    }
    /**
     * 站点渲染方法
    */
    renderMarker=()=>{
        console.log('renderMarker');
        rtnVal.length=0;
        let pollutantBeenCode;
        this.props.pointBeens.map((item,key)=>{
            if (item&&item.Latitude&&item.Longitude) {
                pollutantBeenCode = this.props.pollutantBeens[this.props.selectedPollutantIndex].PollutantCode;
                
                    if (item[pollutantBeenCode]==undefined) {
                       
                    }  else {
                        console.log(item);
                        if (item.tag == '国控'){
                            rtnVal.push(
                                <Marker
                                    key={key} 
                                    active={false}
                                    infoWindowDisabled={true}
                                    title={`${item[pollutantBeenCode]!=''?item[pollutantBeenCode]:'--'}`}
                                    coordinate={{
                                        latitude: item.Latitude,
                                        longitude: item.Longitude,
                                    }} 
                                    onPress={()=>{this._goToDetail(item);}}
                                    icon={() =><TouchableWithoutFeedback 
                                        // onPress={()=>{this._goToDetail(item);}}
                                        ><View style={[{alignItems:'center',}]} >
                                        <View style={[{height:40,width:40}]}>
                                            <Image style={[{height:40,width:40}]} source={require('../../images/cgkqz_l003.png')}/>
                                            <View style={{marginTop:16, flexDirection:'column',alignItems:'center',height:22,backgroundColor:'#00000000',justifyContent:'center',...StyleSheet.absoluteFillObject}}>
                                                <Text style={[{borderRadius:8,backgroundColor:'#00000000',}]}>
                                                    {item[pollutantBeenCode]!=''?item[pollutantBeenCode]:'--'}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text>{item.text}</Text>
                                    </View></TouchableWithoutFeedback>}
                                >
                                </Marker>
                            );
                        } else {
                            rtnVal.push(
                                <Marker
                                    key={key} 
                                    active={false}
                                    infoWindowDisabled={true}
                                    title={`${item[pollutantBeenCode]!=''?item[pollutantBeenCode]:'--'}`}
                                    coordinate={{
                                        latitude: item.Latitude,
                                        longitude: item.Longitude,
                                    }} 
                                    onPress={()=>{this._goToDetail(item);}}
                                    icon={() =><TouchableWithoutFeedback 
                                        // onPress={()=>{this._goToDetail(item);}}
                                        ><View style={[{alignItems:'center',}]} >
                                        <View style={[{borderRadius:4,backgroundColor:item.status==0?"#B0B0B1":item.status==1?"#5BC142":item.status==2?"#E00B0B":item.status==3||item.status==4||item.status==5?"#B9C303":"#B0B0B1",
                                                    alignItems:'center',justifyContent:'center',minHeight:24,minWidth:40,borderColor:item.status==0?"#B0B0B1":item.status==1?"#5BC142":item.status==2?"#E00B0B":
                                                    item.status==3||item.status==4||item.status==5?"#B9C303":"#B0B0B1",}]}>
                                            <Text style={[{borderRadius:8,backgroundColor:item.status==0?"#B0B0B1":item.status==1?"#5BC142":item.status==2?"#E00B0B":item.status==3||item.status==4||item.status==5?"#B9C303":"#B0B0B1",}]}>
                                            {item[pollutantBeenCode]!=''?item[pollutantBeenCode]:'--'}</Text>
                                        </View>
                                        <View style={[{width: 0,
                                            height: 0,
                                            backgroundColor: 'transparent',
                                            borderStyle: 'solid',
                                            borderLeftWidth: 8,
                                            borderRightWidth: 8,
                                            borderBottomWidth: 8,
                                            borderTopWidth: 8,
                                            borderLeftColor: 'transparent',
                                            borderRightColor: 'transparent',
                                            borderTopColor: item.status==0?"#B0B0B1":item.status==1?"#5BC142":item.status==2?"#E00B0B":item.status==3||item.status==4||item.status==5?"#B9C303":"#B0B0B1",
                                            borderBottomColor: 'transparent',
                                        }]}>
                                        </View>
                                        <Text>{item.text}</Text>
                                    </View></TouchableWithoutFeedback>}
                                >
                                </Marker>
                            );
                        }
                        
                    }
            }
        })
        return rtnVal;
    }
    /**
     * 初始化镜头定位
    */
    componentWillMount (){
        console.log('componentWillMount');
        let latitude=0,longitude=0,latitudeDelta=0,longitudeDelta=0;
        this.props.pointBeens.map((item,key)=>{
            if (item&&item.Latitude&&item.Longitude) {
                if(latitudeDelta<item.Latitude){
                    latitudeDelta = item.Latitude;
                }
                if (longitudeDelta<item.Longitude) {
                    longitudeDelta = item.Longitude;
                }
                if (latitude==0) {
                    latitude = item.Latitude;
                } else if (latitude>item.Latitude) {
                    latitude = item.Latitude;
                }
                if (longitude==0) {
                    longitude = item.Longitude;
                } else if (longitude>item.Longitude) {
                    longitude = item.Longitude;
                }
            }
        });
        if (latitude<latitudeDelta&&longitude<longitudeDelta) {
            let temp = 0.1;
            if ((latitude==0||latitudeDelta==0)&&(longitude==0||longitudeDelta==0)) {

            } else if (latitude==0||latitudeDelta==0){
                temp = longitudeDelta-longitude;
            } else if (longitude==0||longitudeDelta==0) {
                temp = latitudeDelta-latitude;
            } else {
                if ((latitudeDelta-latitude)>(longitudeDelta-longitude)){
                    temp = latitudeDelta-latitude;
                } else {
                    temp = longitudeDelta-longitude;
                }
            }
            
            let regionLatitude = (latitude+latitudeDelta)/2,
            regionLongitude = (longitude+longitudeDelta)/2,
            amplification = temp*1.2;
            if (this.state.latitude!=regionLatitude
            ||this.state.longitude!=regionLongitude
            ||this.state.latitudeDelta!=amplification
            ||this.state.longitudeDelta!=amplification) {
                this.setState({
                    'latitude': regionLatitude,
                    'longitude': regionLongitude,
                    'latitudeDelta': amplification,
                    'longitudeDelta': amplification,
                });
            }
        }
    }

    componentWillReceiveProps (nextProps){
        console.log('componentWillMount');
        let latitude=0,longitude=0,latitudeDelta=0,longitudeDelta=0;
        nextProps.pointBeens.map((item,key)=>{
            if (item&&item.Latitude&&item.Longitude) {
                if(latitudeDelta<item.Latitude){
                    latitudeDelta = item.Latitude;
                }
                if (longitudeDelta<item.Longitude) {
                    longitudeDelta = item.Longitude;
                }
                if (latitude==0) {
                    latitude = item.Latitude;
                } else if (latitude>item.Latitude) {
                    latitude = item.Latitude;
                }
                if (longitude==0) {
                    longitude = item.Longitude;
                } else if (longitude>item.Longitude) {
                    longitude = item.Longitude;
                }
            }
        });
        if (latitude<latitudeDelta&&longitude<longitudeDelta) {
            let temp = 0.1;
            if ((latitude==0||latitudeDelta==0)&&(longitude==0||longitudeDelta==0)) {

            } else if (latitude==0||latitudeDelta==0){
                temp = longitudeDelta-longitude;
            } else if (longitude==0||longitudeDelta==0) {
                temp = latitudeDelta-latitude;
            } else {
                if ((latitudeDelta-latitude)>(longitudeDelta-longitude)){
                    temp = latitudeDelta-latitude;
                } else {
                    temp = longitudeDelta-longitude;
                }
            }
            
            let regionLatitude = (latitude+latitudeDelta)/2,
            regionLongitude = (longitude+longitudeDelta)/2,
            amplification = temp*1.2;
            if (this.state.latitude!=regionLatitude
            ||this.state.longitude!=regionLongitude
            ||this.state.latitudeDelta!=amplification
            ||this.state.longitudeDelta!=amplification) {
                this.setState({
                    'latitude': regionLatitude,
                    'longitude': regionLongitude,
                    'latitudeDelta': amplification,
                    'longitudeDelta': amplification,
                });
            }
        }
    }

    render() {
        return (
            <MapView style={[styles.container,]} 
                region={
                    {latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: this.state.latitudeDelta,
                    longitudeDelta: this.state.longitudeDelta,}
                }
                tiltEnabled={false}
                rotateEnabled={false}
                showsCompass={false}
                showsScale={false}
            >
                {this.props.pointBeens?
                    this.renderMarker()
                    :<Marker 
                        coordinate={{
                            latitude: 39.806901,
                            longitude: 116.397972,
                        }} 
                        icon={() =><View >
                            <Text>{123}</Text>      
                        </View>}
                    />
                }
            </MapView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:SCREEN_WIDTH,
    },
});

//make this component available to the app
export default MyMapView;
