import React from 'react';
import { useIntl } from 'umi';
import { Spin, Card, Divider, Row, Col, Tag } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import styles from '../../style.less';


export interface VisitDataType {
    total: number;
    num: number;
    week: number;
    day: number
  }

interface ArticleChartCardProps {
    loading: boolean;
    visitData: VisitDataType;
}



const ArticleChartCard: React.FC<ArticleChartCardProps> = ({ loading, visitData }) => {

    const intl = useIntl();

    const { total, num, week, day } = visitData;

    return (
        <Spin spinning={loading} size="large" >
            <Card className={styles.homeBoxCard} title={intl.formatMessage({id: 'app.home.statisticaloverviewrow.articlechartcard.card-title'})} extra={<Tag color="processing">{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-day'})}</Tag>}>

                <div className={styles.num}>{num.toLocaleString()}</div>
                <div className={styles.height40}>
                <div className={styles.articleText}>
                <span>
                    {intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-daycompare'})} {Math.abs(day)}% 
                    {day > 0 ?<CaretUpOutlined className={styles.colored4014}/> : <CaretDownOutlined className={styles.color19be6b} />}                    
                </span>
                    <span className="margin-l10">
                        {intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-weekcompare'})} {Math.abs(week)}% 
                        {week > 0 ? <CaretUpOutlined className={styles.colored4014}/> : <CaretDownOutlined className={styles.color19be6b} />}
                    </span>
                </div>
                </div>
                <Divider />
                <Row>
                <Col span={12}>{intl.formatMessage({id: 'app.home.statisticaloverviewrow.text-total'})}</Col>
                        <Col className="text-right" span={12}>{total.toLocaleString()}</Col>
                </Row>
            </Card>
        </Spin>
    );

}

export default ArticleChartCard;