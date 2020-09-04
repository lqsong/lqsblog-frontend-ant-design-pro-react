import React, { createRef, useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { Spin, Card, Divider, Row, Col, Tag } from 'antd';
import { debounce } from 'lodash';
import echarts, { ECharts, EChartOption } from 'echarts';
import styles from '../../style.less';

export interface ChartDataType {
    day: string[];
    num: number[];
}
  
export interface VisitDataType {
    total: number;
    num: number;
    chart: ChartDataType;
}

interface TopicsChartCardProps {
  loading?: boolean;
  visitData?: Partial<VisitDataType>;
}

const TopicsChartCard: React.FC<TopicsChartCardProps> = ({ loading = true , visitData = {} }) => {

    const intl = useIntl();

    const { total, num } = visitData;

    const topicsChartRef = createRef<any>();

    const [topicsChart, setTopicsChart] = useState<ECharts>();

    const initChart = (): void => {
        if (!topicsChart) { 
          return ;
        }       
        const topicsOption: EChartOption  = {
          tooltip: {
              trigger: 'axis'
          },
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0'
          },
          xAxis: {
            show: false,
            data: [/* '03-01','03-02','03-03','03-04','03-05','03-06','03-07','03-08','03-09','03-10','03-11','03-12','03-13','03-15','03-15','03-16','03-17','03-18','03-19','03-20','03-21','03-22','03-23','03-24','03-25','03-26','03-27','03-28','03-29','03-30' */]
        },
          yAxis: {
              show: false
          },
          series: [{
              name: '新增',
              type: 'line',
              data: [/* 23,60,20,36,23,85,23,60,20,36,23,85,23,60,20,36,23,85,23,60,20,36,23,85,23,60,20,36,23,85 */],
              lineStyle: {
                    width: 3,
                    color: {
                        type: 'linear',
                        colorStops: [{
                            offset: 0,
                            color: '#1890ff' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#F5222D' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    } as any,
                    shadowColor: 'rgba(72,216,191, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 20
            },
            itemStyle: {
                    borderWidth: 6,
                    borderColor: "#1890ff",
                    color: '#1890ff'
            },
            smooth: true
          }]
        };        
        topicsChart.setOption(topicsOption);    
    }

    const setData = (): void => {
        if (!topicsChart || Object.keys(visitData).length < 1) { 
          return ;
        } 
        const { chart } = visitData
        const option: EChartOption = {
          xAxis: {
            // data: ["03-01", "03-01", "03-01", "03-01", "03-01", "03-01", "03-01"]
            data: chart?.day
          },
          series: [{
              name: '新增',
              // data: [3, 1, 1, 2, 2, 2, 2]
              data: chart?.num
          }]
        };
        topicsChart.setOption(option);

    }

        

    const resizeHandler = debounce(() => {
        if (topicsChart) {
            topicsChart.resize();
        }
    },100);

    useEffect(()=>{
        setTopicsChart(echarts.init(topicsChartRef.current));
    },[1])


    useEffect(() => {     
        initChart();

        window.addEventListener('resize', resizeHandler);
    
        return () => {
          window.removeEventListener('resize', resizeHandler);
        }
    },[topicsChart])
    

    useEffect(()=> {
      setData();
    },[topicsChart, visitData])


    return (
        <Spin spinning={loading} size="large" >
          <Card className={styles.homeBoxCard} title={intl.formatMessage({id: 'app.home.statisticaloverviewrow.topicschartcard.card-title'})} extra={<Tag color="warning">{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-month'})}</Tag>} >
              <div className={styles.num}>{num?.toLocaleString()}</div>
              <div className={styles.height40} ref={topicsChartRef} />
              <Divider />
              <Row>
                <Col span={12}>{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-total'})}</Col>
                <Col className="text-right" span={12}>{total?.toLocaleString()}</Col>
              </Row>
          </Card>
        </Spin>
      );
            

}

export default TopicsChartCard;