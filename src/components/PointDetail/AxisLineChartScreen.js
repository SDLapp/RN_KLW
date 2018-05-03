import React, { PureComponent } from 'react';
import {
  Text,
  View,
  processColor,
  TouchableWithoutFeedback
} from 'react-native';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import {SCREEN_WIDTH,little_font_size,SCREEN_HEIGHT, little_font_size2,} from '../../config/globalsize';
import globalcolor from '../../config/globalcolor'
import {createAction,} from '../../utils';
import {LineChart} from 'react-native-charts-wrapper';
import { lang } from 'moment';

const COLOR_PURPLE = processColor(globalcolor.base_point_line);
const COLOR_PURPLE2 = processColor(globalcolor.bd_point_line);
const transparency = processColor('#ffffff00');
const contentHeight = SCREEN_HEIGHT-148;


@connect(({pointdetail})=>({
  chartData:pointdetail.chartData,
  CompareData:pointdetail.CompareData,
  compareItem:pointdetail.compareItem,
  Pollutants:pointdetail.Pollutants,
  PollutantSelect:pointdetail.PollutantSelect,
  searchType:pointdetail.searchType,
  chartDomain:pointdetail.chartDomain,
}))
class AxisLineChartScreen extends PureComponent {

  constructor() {
    super();

    this.state = {
      duration:0,
      data: {},
      xAxis: {},
      yAxis: {},
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('#FF0000'),
        // markerColor: processColor('#FAFAFA'),
        markerColor: processColor('#7fa7fa'),
        textColor: processColor('white'),
        form: "SQUARE",
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
      }
    };
  }

  componentWillMount(){
    let yArray = [],valueFormatter=[],
    axisMaximum =this.props.chartData.length,
    compareY = [] ,duration = this.props.chartData.length*40;
    this.setState({'duration':duration,});
    let colors = [],compareColors = [],pointColors=[],comparePointColors=[],
    max=0,min=10;
    if (this.props.isCompare) {
      if (this.props.chartDomain[1]-this.props.chartDomain[0]<108) {
        max = this.props.chartDomain[1]+108;
      } else {
        max = Math.round(this.props.chartDomain[1]*1.1);
      }
      min = Math.round(this.props.chartDomain[0]-this.props.chartDomain[0]*0.1);
      let chartDataLength = this.props.chartData.length;
      this.props.chartData.map(
        (item,key)=>{
          if (item.chartValue&&item.chartValue!=0&&item.chartValue!=0.0) {
            yArray.push({y:item.chartValue,marker:`时间:${item._MonitorTime}\n值:${item.chartValue}`});
            colors.push(COLOR_PURPLE);
            pointColors[pointColors.length-1] = transparency;
            if (colors[colors.length-2] == transparency) {
              if (key!=chartDataLength-1) {
                  pointColors.push(COLOR_PURPLE);
              } else {
                pointColors.push(transparency);
              }
            } else{
              pointColors.push(transparency);
            }
            
          } else {
            yArray.push({y:0,marker:`时间:${item._MonitorTime}\n值:--`});
            colors[colors.length-1] = transparency;
            colors.push(transparency);
            pointColors.push(transparency);
          }
          valueFormatter.push(item.chartTime);
        }
      );
      let compareDataLength = this.props.CompareData.length;
      this.props.CompareData.map(
        (item,key)=>{
          if (item.chartValue&&item.chartValue!=0&&item.chartValue!=0.0) {
            compareY.push({y:item.chartValue,marker:`时间:${item._MonitorTime}\n值:${item.chartValue}`});
            compareColors.push(COLOR_PURPLE2);
            comparePointColors[comparePointColors.length-1] = transparency;
            if (compareColors[compareColors.length-2] == transparency) {
              if (key!=compareDataLength-1) {
                comparePointColors.push(COLOR_PURPLE2);
              } else {
                comparePointColors.push(transparency);
              }
            } else {
              comparePointColors.push(transparency);
            }
          } else {
            compareY.push({y:0,marker:`时间:${item._MonitorTime}\n值:--`});
            compareColors[compareColors.length-1] = transparency;
            compareColors.push(transparency);
            comparePointColors.push(transparency);
          }
        }
      );
      
      this.setState(
        update(this.state, {
          xAxis: {
            $set: {
              textColor: processColor('black'),
              textSize: 12,
              gridColor: processColor('#bfbfbf'),
              gridLineWidth: 1,
              axisLineColor: processColor('darkgray'),
              axisLineWidth: 1.5,
              avoidFirstLastClipping: false,
              position: 'BOTTOM',
              'valueFormatter':valueFormatter,
              'axisMaximum':valueFormatter.length,
            }
          },
          yAxis: {
            $set: {
              gridColor: processColor('#bfbfbf'),
              gridLineWidth: 1,
              left: {
                drawGridLines: true,
                axisMaximum: max,
                axisMinimum: min,
              },
              right: {
                enabled: false
              }
            }
          },
          data: {
            $set: {
              dataSets: [{
                values: compareY,
                label: this.props.compareItem.text,
                config: {
                  drawValues: false,
                  lineWidth: 1.5,
                  drawCircles: true,
                  circleRadius: 1.5,
                  circleColors: comparePointColors,
                  drawCubicIntensity: 0.3,
                  drawCubic: true,
                  drawHighlightIndicators: true,
                  colors: compareColors,
                }
              },{
                values: yArray,
                label: this.props.item.text,
                config: {
                  drawValues: false,
                  lineWidth: 1.5,
                  drawCircles: true,
                  circleRadius: 1.5,
                  circleColors: pointColors,
                  drawCubicIntensity: 0.3,
                  drawCubic: true,
                  drawHighlightIndicators: true,
                  colors: colors,
                }
              }],
            }
          }
        })
      );
    } else {
      max = this.props.chartDomain[1]+30;
      min =min>0?1:this.props.chartDomain[0];
      let colors = [],pointColors=[];
      this.props.chartData.map(
        (item,key)=>{
          if (item.chartValue&&item.chartValue!=0) {
            yArray.push({y:item.chartValue,marker:`时间:${item._MonitorTime}\n值:${item.chartValue}`});
            colors.push(COLOR_PURPLE);
            pointColors.push(COLOR_PURPLE);
          } else {
            yArray.push({y:0,marker:`时间:${item._MonitorTime}\n值:--`});
            colors[colors.length-1] = transparency;
            colors.push(transparency);
            pointColors.push(transparency);
          }
          valueFormatter.push(item.chartTime);
        }
      );
      this.setState(
        update(this.state, {
          xAxis: {
            $set: {
              textSize: 12,
              gridColor: processColor('#bfbfbf'),
              gridLineWidth: 1,
              axisLineColor: processColor('darkgray'),
              axisLineWidth: 1.5,
              avoidFirstLastClipping: false,
              position: 'BOTTOM',
              'valueFormatter':valueFormatter,
              'axisMaximum':valueFormatter.length,
            }
          },
          yAxis: {
            $set: {
              gridColor: processColor('#bfbfbf'),
              gridLineWidth: 1,
              left: {
                drawGridLines: true,
                axisMaximum: max,
                axisMinimum: min,
              },
              right: {
                enabled: false
              }
            }
          },
          data: {
            $set: {
              dataSets: [{
                values: yArray,
                label: this.props.item.text,
                config: {
                  drawValues: false,
                  lineWidth: 1.5,
                  drawCircles: true,
                  circleRadius: 1.5,
                  circleColors:pointColors,
                  drawCubicIntensity: 0.3,
                  drawCubic: true,
                  drawHighlightIndicators: true,
                  colors: colors,
                }
              }],
            }
          }
        })
      );
    }
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    // console.log(entry);
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: entry})
    }
  }

  render() {
    let chartHeight = this.props.isCompare?(contentHeight-16)/2:(contentHeight-16)*2/5;
    return (
      <View>
        {this.props.isCompare?
          <View style={[{width:SCREEN_WIDTH-60,height:32,flexDirection:'row',marginLeft:14,justifyContent:'space-between',},]}>
              <TouchableWithoutFeedback onPress={()=>{
                  if (this.props.searchType!='xiaoshi') {
                      this.props.dispatch(createAction('pointdetail/updateState')({searchType:'xiaoshi'}));
                      this.props.dispatch(createAction('pointdetail/refresh')());
                  }
              }}>
                  <View style={[{width:(SCREEN_WIDTH-72)/2,height:24,backgroundColor:this.props.searchType=='xiaoshi'?globalcolor.titleBlue:globalcolor.borderLightGreyColor,
                      alignItems:'center',justifyContent:'center',marginTop:6,marginBottom:6,},]}>
                      <Text style={[{fontSize:14,color:this.props.searchType=='xiaoshi'?'white':'black'},]}>小时</Text>
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
                      <Text style={[{fontSize:14,color:this.props.searchType=='ri'?'white':'black'},]}>日均</Text>
                  </View>
              </TouchableWithoutFeedback>
            </View>
            :(null)
        }
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:20}}>
          <Text style={{marginLeft:8,fontSize:10,}}>{this.props.Pollutants&&this.props.Pollutants[this.props.PollutantSelect]?
            this.props.Pollutants[this.props.PollutantSelect].PollutantName:''}</Text>
          <Text style={{marginRight:8,fontSize:10,}}>{this.props.Pollutants[this.props.PollutantSelect]?
            this.props.Pollutants[this.props.PollutantSelect].Unit=='μg/m³'?
            'μ g /m³':this.props.Pollutants[this.props.PollutantSelect].Unit=='摄氏度'?
            '摄氏度    ':this.props.Pollutants[this.props.PollutantSelect].Unit=='%'?
            '  %':this.props.Pollutants[this.props.PollutantSelect].Unit
            :''}</Text>
        </View>
        <LineChart
          animation={{durationX: 1000}}
          gridBackgroundColor={processColor('#ffffff')}
          drawGridBackground={true}
          style={{
            height:this.props.isCompare?chartHeight-84:chartHeight-28,
            marginBottom:this.props.isCompare?0:8,
          }}
          data={this.state.data}
          chartDescription={{text: ''}}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          marker={this.state.marker}
          legend={{enabled: false,}}
          onSelect={this.handleSelect.bind(this)}
          onChange={(event) => {
            // console.log(event.nativeEvent)
          }}
          drawBorders={false}
          touchEnabled={true}
          dragEnabled={true}
          scaleEnabled={true}
          scaleXEnabled={true}
          scaleYEnabled={true}
          pinchZoom={false}
          doubleTapToZoomEnabled={false}
          dragDecelerationEnabled={true}
          dragDecelerationFrictionCoef={0.99}
        />
        {this.props.isCompare?
          <View style={[{flexDirection:'row',alignItems:'center',height:24,width:SCREEN_WIDTH-60,marginBottom:16,},]}>
          <View style={[{borderBottomColor:globalcolor.base_point_line,borderBottomWidth:2,width:32,marginLeft:16,},]}></View>
          <Text style={{fontSize:little_font_size2,}}>{this.props.item.text}</Text>
          <View style={[{borderBottomColor:globalcolor.bd_point_line,borderBottomWidth:2,width:32,marginLeft:16,},]}></View>
          <Text style={{fontSize:little_font_size2,}}>{this.props.compareItem?this.props.compareItem.text:'--'}</Text>
          </View>
          :(null)
        }
      </View>
      
    );
  }
}

export default AxisLineChartScreen;
