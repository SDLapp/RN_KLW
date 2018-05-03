//import liraries
import React, { PureComponent } from 'react';
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

import {SCREEN_WIDTH,SCREEN_HEIGHT,} from '../../config/globalsize'
import globalcolor from '../../config/globalcolor'
/**
 * 单一监控点图表
*/

const contentHeight = SCREEN_HEIGHT-148;
const chartHeight = (contentHeight-16)/2;

@connect(({pointdetail})=>({PollutantData:pointdetail.PollutantData,
                            chartData:pointdetail.chartData,
                            ServiceType:pointdetail.ServiceType,
                            ticks:pointdetail.ticks,
                            chartDomain:pointdetail.chartDomain,
                            Pollutants:pointdetail.Pollutants,
                            PollutantSelect:pointdetail.PollutantSelect,
                            validDataCount:pointdetail.validDataCount,
                        }))
class ChartView extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
          'flag':false,
          showChart:false,
        }
      }
    _setState = (obj)=>{
      this.setState(previousState => {
        return obj;
      });
    }
    componentWillMount(){
    }
    componentDidMount() {
      this.setState({showChart:true});
    }

    render() {
        return (
          <VictoryChart
            padding={{left:36,right:30,top:45,bottom:50}}
            style={{
              parent: {
                justifyContent:'center',
                alignItems:'center',
              },
              borderColor:'red',
              borderWidth:1,
            }}
            height={chartHeight}
            // animate={{ duration: 100, onLoad: { duration: 500 } }}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension="x"
                labels={(d) => { 
                  return `时间    :${d.chartTime}\n值    :${(d.chartValue==null?' --':d.chartValue)+' ('
                  +(this.props.Pollutants[this.props.PollutantSelect]?
                    this.props.Pollutants[this.props.PollutantSelect].Unit=='μg/m³'?
                      'μ  g /m³':this.props.Pollutants[this.props.PollutantSelect].Unit=='摄氏度'?
                          '摄氏度    ':this.props.Pollutants[this.props.PollutantSelect].Unit=='%'?
                            '  %':this.props.Pollutants[this.props.PollutantSelect].Unit
                  :'')+'  )'}`;}}
                labelComponent={
                  <VictoryTooltip
                    cornerRadius={0}
                    flyoutStyle={{ fill: "white" }}
                  />}
              />}
            width={SCREEN_WIDTH-32}
          >
          <VictoryAxis
            offsetY={50}
            x={(d) => d.chartTime}
            theme={VictoryTheme.material}
            axisLabelComponent={<VictoryLabel />}
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
              axisLabel: { fontSize: 12, padding: -25 ,},
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
          height={chartHeight}
          theme={VictoryTheme.material}
          domain={this.props.chartDomain}
          axisLabelComponent={<VictoryLabel angle={360} dy={-70} 
          dx={this.props.Pollutants&&this.props.Pollutants[this.props.PollutantSelect]?
            this.props.Pollutants[this.props.PollutantSelect].PollutantCode=='a34002'
            ||this.props.Pollutants[this.props.PollutantSelect].PollutantCode=='a34004'?80:56:56}  />}
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
        {this.props.validDataCount>=2?
              <VictoryLine 
                style={{
                  data: { stroke: globalcolor.base_point_line },
                }}
                data={this.props.chartData}
                x={(d) => d.chartTime}
                y={(d) => d.chartValue}/>
              :<VictoryScatter
                style={{ data: { fill: globalcolor.base_point_line } }}
                size={(datum) => {if (datum.chartValue) {return 2;} else{return 0;}}}
                data={this.props.chartData}
                x={(d) => d.chartTime}
                y={(d) => d.chartValue}
              />}
        </VictoryChart>
      ); 
    }
}

//make this component available to the app
export default ChartView;
