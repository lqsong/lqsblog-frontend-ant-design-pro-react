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

interface WorksChartCardProps {
  loading?: boolean;
  visitData?: Partial<VisitDataType>;
}



const WorksChartCard: React.FC<WorksChartCardProps> = ({ loading = true , visitData = {} }) => {

    const intl = useIntl();

    const { total, num } = visitData;

    const worksChartRef = createRef<any>();

    const [worksChart, setWorksChart] = useState<ECharts>();

    const initChart = (): void => {
        // worksChart = echarts.init(worksChartRef.current);
        if (!worksChart) { 
          return ;
        }       
        const worksOption: EChartOption  = {
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
              boundaryGap: false,
              data: [/* '03-01','03-02','03-03','03-04','03-05','03-06','03-07' */]
          },
          yAxis: {
              show: false
          },
          series: [{
              name: '新增',
              type: 'line',
              data: [/* 23,60,20,36,23,85,23 */],
              areaStyle: {
                color: {
                    colorStops: [{
                        offset: 0,
                        color: '#1890ff' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#F5222D' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                } as any,
              },
              lineStyle: {
                  width: 0
              },
              itemStyle: {
                  borderWidth: 2,
                  color: '#1890ff'
              }
          }]
        };        
        worksChart.setOption(worksOption);    
    }

    const setData = (): void => {
        if (!worksChart || Object.keys(visitData).length < 1) { 
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
        worksChart.setOption(option);

    }

        

    const resizeHandler = debounce(() => {
        if (worksChart) {
          worksChart.resize();
        }
    },100);

    useEffect(()=>{
        setWorksChart(echarts.init(worksChartRef.current));
    },[1])


    useEffect(() => {     
        initChart();

        window.addEventListener('resize', resizeHandler);
    
        return () => {
          window.removeEventListener('resize', resizeHandler);
        }
    },[worksChart])
    

    useEffect(()=> {
      setData();
    },[worksChart, visitData])
          

    return (
      <Spin spinning={loading} size="large" >
        <Card className={styles.homeBoxCard} title={intl.formatMessage({id: 'app.home.statisticaloverviewrow.workschartcard.card-title'})} extra={<Tag color="success">{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-week'})}</Tag>}>
            <div className={styles.num}>{num?.toLocaleString()}</div>
            <div className={styles.height40} ref={worksChartRef} />
            <Divider />
            <Row>
              <Col span={12}>{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-total'})}</Col>
              <Col className="text-right" span={12}>{total?.toLocaleString()}</Col>
            </Row>
        </Card>
      </Spin>
    );
}

export default WorksChartCard;