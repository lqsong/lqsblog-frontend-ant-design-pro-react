import React, { Suspense, useEffect } from 'react';
import { connect, Dispatch } from "umi";
import { Col, Row } from 'antd';
import { StateType } from "./model";
import PageLoading from './components/PageLoading';

const StatisticalOverviewRow = React.lazy(() => import('./components/StatisticalOverviewRow'));
const HotSearchCard = React.lazy(() => import('./components/HotSearchCard'));
const HotTagsCard = React.lazy(() => import('./components/HotTagsCard'));
const ArticleHitCard = React.lazy(()=> import('./components/ArticleHitCard'));
const WorksHitCard = React.lazy(()=> import('./components/WorksHitCard'));

const TableColProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
}

interface HomePageProps {
  state: StateType;
  dispatch: Dispatch;
  ArticleChartCardLoading: boolean;
  WorksChartCardLoading: boolean;
  TopicsChartCardLoading: boolean;
  LinksChartCardLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ 
  state,
  dispatch,
  ArticleChartCardLoading,
  WorksChartCardLoading,
  TopicsChartCardLoading,
  LinksChartCardLoading 
}) => {

  const { articleChartData, worksChartData, topicsChartData, linksChartData } = state;

  useEffect(()=> {

    dispatch({ type: 'Home/queryArticleChartData' });
    dispatch({ type: 'Home/queryWorksChartData' });
    dispatch({ type: 'Home/queryTopicsChartData' });
    dispatch({ type: 'Home/queryLinksChartData' });

  },[1]);

  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <StatisticalOverviewRow 
          ArticleChartCardLoading={ArticleChartCardLoading}
          ArticleChartCardData={articleChartData}
          WorksChartCardLoading={WorksChartCardLoading}
          WorksChartCardData={worksChartData}
          TopicsChartCardLoading={TopicsChartCardLoading}
          TopicsChartCardData={topicsChartData}
          LinksChartCardLoading={LinksChartCardLoading}
          LinksChartCardData={linksChartData}
        />
      </Suspense>
      <Row gutter={24}>
        <Col {...TableColProps}>
          <Suspense fallback={<PageLoading />}>
             <HotSearchCard />
          </Suspense>
        </Col>
        <Col {...TableColProps}>
          <Suspense fallback={<PageLoading />}>
             <HotTagsCard />
          </Suspense>
        </Col>
      </Row>   
      <Row gutter={24}>
        <Col {...TableColProps}>
          <Suspense fallback={<PageLoading />}>
             <ArticleHitCard />
          </Suspense>
        </Col>
        <Col {...TableColProps}>
          <Suspense fallback={<PageLoading />}>
             <WorksHitCard />
          </Suspense>
        </Col>
      </Row>   
    </>
  );
};


export default connect(
  ({
    Home,
    loading,
  }:{
    Home: StateType;
    loading: {
      effects: {
        [key:string]: boolean;
      }
    }
  })=>({
    state: Home,
    ArticleChartCardLoading: loading.effects['Home/queryArticleChartData'],
    WorksChartCardLoading: loading.effects['Home/queryWorksChartData'],
    TopicsChartCardLoading: loading.effects['Home/queryTopicsChartData'],
    LinksChartCardLoading: loading.effects['Home/queryLinksChartData'],
  })
)(HomePage);

