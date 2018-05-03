//import liraries
import React, { PureComponent } from 'react';
import { View, Text,TouchableWithoutFeedback, } from 'react-native';
import { connect } from 'react-redux';
import { 
    VictoryChart,
    VictoryTheme,
    VictoryLine,
    VictoryAxis,
    VictoryLabel,
    VictoryScatter,
    VictoryTooltip,
    VictoryVoronoiContainer,
  } from "victory-native";

import {SCREEN_WIDTH,little_font_size2,SCREEN_HEIGHT,} from '../../config/globalsize'
import globalcolor from '../../config/globalcolor'
import {createAction,} from '../../utils';

const contentHeight = SCREEN_HEIGHT-148;
const chartHeight = (contentHeight-16)/2;

@connect(({pointdetail})=>({chartData:pointdetail.chartData,
                            searchType:pointdetail.searchType,
                            ticks:pointdetail.ticks,
                            chartDomain:pointdetail.chartDomain,
                            Pollutants:pointdetail.Pollutants,
                            PollutantSelect:pointdetail.PollutantSelect,
                            CompareData:pointdetail.CompareData,
                            validDataCount:pointdetail.validDataCount,
                            validCompareDataCount:pointdetail.validCompareDataCount,
                            compareItem:pointdetail.compareItem,
                        }))
/**
 * 显示对比信息的图表
 * 
 * 图表需要污染物作为坐标轴标题，所以不做移除操作
*/
class ChartCompareView extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
        }
      }

      getServiceType (){
        return this.props.searchType;
      }

    render() {
        return (
          <View>
            <View style={[{width:SCREEN_WIDTH-60,height:32,flexDirection:'row',marginLeft:14,justifyContent:'space-between',},]}>
              <TouchableWithoutFeedback onPress={()=>{
                  if (this.props.searchType!='xiaoshi') {
                      this.props.dispatch(createAction('pointdetail/updateState')({searchType:'xiaoshi'}));
                      this.props.dispatch(createAction('pointdetail/refresh')());
                  }
              }}>
                  <View style={[{width:(SCREEN_WIDTH-72)/2,height:24,backgroundColor:this.props.searchType=='xiaoshi'?globalcolor.titleBlue:globalcolor.borderLightGreyColor,
                      alignItems:'center',justifyContent:'center',marginTop:6,marginBottom:6,},]}>
                      <Text style={[{fontSize:10,},]}>小时</Text>
                  </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{
                    if (this.props.searchType!='ri') {
                        this.props.dispatch(createAction('pointdetail/updateState')({searchType:'ri'}));
                        this.props.dispatch(createAction('pointdetail/refresh')());
                    }
                }}>
                  <View style={[{width:(SCREEN_WIDTH-72)/2,height:24,backgroundColor:this.props.searchType=='ri'?globalcolor.titleBlue:globalcolor.borderLightGreyColor,
                      alignItems:'center',justifyContent:'center',marginTop:6,},]}>
                      <Text style={[{fontSize:10,},]}>日均</Text>
                  </View>
              </TouchableWithoutFeedback>
            </View>

            <VictoryChart
              style={{
                parent: {
                  justifyContent:'center',
                  alignItems:'center',
                }
              }}
              height={chartHeight-56}
              animate={{ duration: 100, onLoad: { duration: 500 } }}
              containerComponent={
                <VictoryVoronoiContainer
                  voronoiDimension="x"
                  labels={(d) => {
                    return `时间    :${d.chartTime}\n值    :${(d.chartValue==null?' --':d.chartValue)+' ('+(this.props.Pollutants[this.props.PollutantSelect].Unit=='μg/m³'?'μ  g /m³':'')+'  )'}`;
                  }}
                  labelComponent={
                    <VictoryTooltip
                      cornerRadius={0}
                      flyoutStyle={{ fill: "white" }}
                    />}
                />}
              width={SCREEN_WIDTH-32}
              padding={{left:30,right:30,top:16+(56/8),bottom:32,}}
            >
              <VictoryAxis
                x={(d) => d.chartTime}
                theme={VictoryTheme.material}
                axisLabelComponent={<VictoryLabel angle={360} dy={-90} dx={30} />}
                tickFormat={
                  (x) => {
                    const index = this.props.ticks.indexOf(x);
                    if (index !== -1) {
                      return x;
                    }
                  }
                }
                style={{
                  axis: { stroke: '#756f6a' },
                  axisLabel: { fontSize: 12, padding: 25 ,},
                  ticks: {
                    size: (tick, index) => {
                      let tickSize = 5;
                      if (this.props.ServiceType == 0) {
                        tickSize =
                            (index) % 4 === 0 ? 10 : 5;
                      } else {
                        tickSize =
                            (index) % 6 === 0 ? 10 : 5;
                      }
                      if (index === 0) {
                        tickSize = 10;
                      }
                      return tickSize;
                    },
                    stroke: 'black',
                    strokeWidth: 1,
                  },
                  tickLabels: {
                    fill: 'black',
                    fontFamily: 'inherit',
                    fontSize: 10,
                    padding:2,
                  },
                }}
              />
              <VictoryAxis
                y={(d) => d.chartValue}
                dependentAxis
                theme={VictoryTheme.material}
                domain={this.props.chartDomain}
                axisLabelComponent={<VictoryLabel angle={360} dy={-80+(56/2)} dx={56}  />}
                label={` ${this.props.Pollutants&&this.props.Pollutants[this.props.PollutantSelect]?
                            this.props.Pollutants[this.props.PollutantSelect].PollutantName:''
                          } ${this.props.Pollutants&&this.props.Pollutants[this.props.PollutantSelect]?
                              this.props.Pollutants[this.props.PollutantSelect].PollutantCode=='a34002'
                              ||this.props.Pollutants[this.props.PollutantSelect].PollutantCode=='a34004'?
                              '浓度':this.props.Pollutants[this.props.PollutantSelect].PollutantCode=='a01001'?
                              '':this.props.Pollutants[this.props.PollutantSelect].PollutantCode=='a01002'?
                              '':''
                            :''}     ${'('+(this.props.Pollutants[this.props.PollutantSelect]?
                                        this.props.Pollutants[this.props.PollutantSelect].Unit=='μg/m³'?
                                        'μ  g /m³':this.props.Pollutants[this.props.PollutantSelect].Unit=='摄氏度'?
                                        '摄氏度    ':this.props.Pollutants[this.props.PollutantSelect].Unit=='%'?
                                        '  %':this.props.Pollutants[this.props.PollutantSelect].Unit
                                        :'')+'  )'}`}
                style={{
                  axis: { stroke: '#756f6a' },
                  tickLabels: {
                    fill: 'black',
                    fontFamily: 'inherit',
                    fontSize: 10,
                    padding:4,
                  },
                  axisLabel:{
                    fontSize: 10,
                  }
                }}
              />
              {this.props.validDataCount>=2?<VictoryLine 
                style={{
                  data: { stroke: globalcolor.base_point_line },
                }}
                data={this.props.chartData}
                x={(d) => { 
                return d.chartTime}}
                y={(d) => d.chartValue}/>
                :<VictoryScatter
                style={{ data: { fill: globalcolor.base_point_line } }}
                size={(datum) => {if (datum.chartValue) {return 2;} else{return 0;}}}
                data={this.props.chartData}
                x={(d) => d.chartTime}
                y={(d) => d.chartValue}
              />}
            
              {this.props.validCompareDataCount>=2?<VictoryLine 
                style={{
                  data: { stroke: globalcolor.bd_point_line },
                }}
                data={this.props.CompareData}
                x={(d) => { 
                return d.chartTime}}
                y={(d) => d.chartValue}/>
                :<VictoryScatter
                style={{ data: { fill: globalcolor.bd_point_line } }}
                size={(datum) => {if (datum.chartValue) {return 2;} else{return 0;}}}
                data={this.props.CompareData}
                x={(d) => d.chartTime}
                y={(d) => d.chartValue}
              />}
            
            </VictoryChart>
            <View style={[{flexDirection:'row',alignItems:'center',height:24,width:SCREEN_WIDTH-60,marginBottom:16,},]}>
              <View style={[{borderBottomColor:globalcolor.base_point_line,borderBottomWidth:1,width:20,marginLeft:16,},]}></View>
              <Text style={{fontSize:little_font_size2,}}>{this.props.item.text}</Text>
              <View style={[{borderBottomColor:globalcolor.bd_point_line,borderBottomWidth:1,width:20,marginLeft:16,},]}></View>
              <Text style={{fontSize:little_font_size2,}}>{this.props.compareItem?this.props.compareItem.text:'--'}</Text>
            </View>
          </View>
        ); 
      }
}

//make this component available to the app
export default ChartCompareView;
