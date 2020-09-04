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


interface LinksChartCardProps {
    loading?: boolean;
    visitData?: Partial<VisitDataType>;
}

const LinksChartCard: React.FC<LinksChartCardProps> = ({ loading = true , visitData = {} }) => {

    const intl = useIntl();

    const { total, num } = visitData;

    const linksChartRef = createRef<any>();

    const [linksChart, setLinksChart] = useState<ECharts>();

    const initChart = (): void => {
        if (!linksChart) { 
          return ;
        }       
        const linksOption: EChartOption  = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
                left: '0',
                right: '0',
                top: '0',
                bottom: '0'
            },
            xAxis: {
                show: false,
                data: [/* '2019-04', '2019-05', '2019-06','2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12', '2020-01', '2020-02', '2020-03' */]
            },
            yAxis: {
                show: false
            },
            series: [{
                name: '新增',
                type: 'bar',
                data: [/* 5888, 3838, 15880, 12888, 18888, 16888,5888, 3838, 15880, 12888, 18888, 16888 */],
                itemStyle: {
                  color: '#1890ff'
                }
            }]
        };        
        linksChart.setOption(linksOption);    
    }

    const setData = (): void => {
        if (!linksChart || Object.keys(visitData).length < 1) { 
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
        linksChart.setOption(option);

    }

        

    const resizeHandler = debounce(() => {
        if (linksChart) {
          linksChart.resize();
        }
    },100);

    useEffect(()=>{
        setLinksChart(echarts.init(linksChartRef.current));
    },[1])


    useEffect(() => {     
        initChart();

        window.addEventListener('resize', resizeHandler);
    
        return () => {
          window.removeEventListener('resize', resizeHandler);
        }
    },[linksChart])
    

    useEffect(()=> {
      setData();
    },[linksChart, visitData])
          

    return (
        <Spin spinning={loading} size="large" >
          <Card className={styles.homeBoxCard} title={intl.formatMessage({id: 'app.home.statisticaloverviewrow.linkschartcard.card-title'})} extra={<Tag color="error">{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-years'})}</Tag>}>
              <div className={styles.num}>{num?.toLocaleString()}</div>
              <div className={styles.height40} ref={linksChartRef} />
              <Divider />
              <Row>
                <Col span={12}>{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-total'})}</Col>
                <Col className="text-right" span={12}>{total?.toLocaleString()}</Col>
              </Row>
          </Card>
        </Spin>
      );
      



}

export default LinksChartCard;