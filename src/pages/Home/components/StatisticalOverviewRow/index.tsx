import React from 'react';
import { Col, Row } from 'antd';

import ArticleChartCard, { VisitDataType as ArticleVisitDataType } from './ArticleChartCard';
import WorksChartCard, { VisitDataType as WorksVisitDataType } from './WorksChartCard';
import TopicsChartCard, { VisitDataType as TopicsVisitDataType } from './TopicsChartCard';
import LinksChartCard, { VisitDataType as LinksVisitDataType } from './LinksChartCard';


const ColProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
}

interface StatisticalOverviewRowProps {
    ArticleChartCardLoading: boolean;
    ArticleChartCardData: ArticleVisitDataType;
    WorksChartCardLoading: boolean;
    WorksChartCardData: WorksVisitDataType;
    TopicsChartCardLoading: boolean;
    TopicsChartCardData: TopicsVisitDataType;
    LinksChartCardLoading: boolean;
    LinksChartCardData: LinksVisitDataType;
}
const StatisticalOverviewRow: React.FC<StatisticalOverviewRowProps> = ({
    ArticleChartCardLoading,
    ArticleChartCardData,
    WorksChartCardLoading,
    WorksChartCardData,
    TopicsChartCardLoading,
    TopicsChartCardData,
    LinksChartCardLoading,
    LinksChartCardData,
}) => {

    return (
        <Row gutter={24}>
            <Col {...ColProps}>
                <ArticleChartCard loading={ArticleChartCardLoading} visitData={ArticleChartCardData} />
            </Col>
            <Col {...ColProps}>
                <WorksChartCard loading={WorksChartCardLoading} visitData={WorksChartCardData} />
            </Col>
            <Col {...ColProps}>
                <TopicsChartCard loading={TopicsChartCardLoading} visitData={TopicsChartCardData} />
            </Col>
            <Col {...ColProps}>
                <LinksChartCard loading={LinksChartCardLoading} visitData={LinksChartCardData} />
            </Col>
        </Row>
    );

}

export default StatisticalOverviewRow;