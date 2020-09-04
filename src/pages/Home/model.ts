import { Effect, Reducer } from "umi";

import { ResponseData } from '@/utils/request';
import { VisitDataType as ArticleVisitDataType } from "./components/StatisticalOverviewRow/ArticleChartCard";
import { VisitDataType as WorksVisitDataType } from "./components/StatisticalOverviewRow/WorksChartCard";
import { VisitDataType as TopicsVisitDataType } from "./components/StatisticalOverviewRow/TopicsChartCard";
import { VisitDataType as LinksVisitDataType } from "./components/StatisticalOverviewRow/LinksChartCard";
import { dailynewArticles, weeknewWorks, monthnewTopics, annualnewLinks } from "./service";

export interface StateType {
    articleChartData: ArticleVisitDataType;
    worksChartData: WorksVisitDataType;
    topicsChartData: TopicsVisitDataType;
    linksChartData: LinksVisitDataType;
}

export interface ModeType {
    namespace: string;
    state: StateType;
    effects: {
        queryArticleChartData: Effect;
        queryWorksChartData: Effect;
        queryTopicsChartData: Effect;
        queryLinksChartData: Effect;
    },
    reducers: {
        setArticleChartData: Reducer<StateType>;
        setWorksChartData: Reducer<StateType>;
        setTopicsChartData: Reducer<StateType>;
        setLinksChartData: Reducer<StateType>;
    },
}

const initState: StateType = {
    articleChartData: {
        total: 0,
        num: 0,
        week: 0,
        day: 0,
    },
    worksChartData: {
        total: 0,
        num: 0,
        chart: {
            day: [],
            num: [],
        },
    },
    topicsChartData: {
        total: 0,
        num: 0,
        chart: {
            day: [],
            num: [],
        },
    },
    linksChartData: {
        total: 0,
        num: 0,
        chart: {
            day: [],
            num: [],
        },
    },
}

const Model: ModeType = {
    namespace: 'Home',
    state: initState,
    effects: {
        *queryArticleChartData( _ , { call, put }) {
            const response: ResponseData = yield call(dailynewArticles);
            const { code, data } = response;
            if( code === 0 ) {
                yield put({
                    type: 'setArticleChartData',
                    payload:  {
                        ...initState.articleChartData,
                        ...data,
                    },
                });
                return true;
            } 
                return false;
            
        },
        *queryWorksChartData( _ , { call, put }) {
            const response: ResponseData = yield call(weeknewWorks);
            const { code, data } = response;
            if( code === 0 ) {
                yield put({
                    type: 'setWorksChartData',
                    payload:  {
                        ...initState.worksChartData,
                        ...data,
                    },
                });
                return true;
            } 
                return false;
            
        },
        *queryTopicsChartData( _ , { call, put }) {
            const response: ResponseData = yield call(monthnewTopics);
            const { code, data } = response;
            if( code === 0 ) {
                yield put({
                    type: 'setTopicsChartData',
                    payload:  {
                        ...initState.topicsChartData,
                        ...data,
                    },
                });
                return true;
            } 
                return false;
        },
        *queryLinksChartData(_, { call, put }) {
            const response: ResponseData = yield call(annualnewLinks);
            const { code, data } = response;
            if( code === 0 ) {
                yield put({
                    type: 'setLinksChartData',
                    payload:  {
                        ...initState.linksChartData,
                        ...data,
                    },
                });
                return true;
            } 
                return false;
        },
    },
    reducers: {
        setArticleChartData(state, { payload }) {
            return {
                ...initState,
                ...state,
                articleChartData: payload,
            }
        },
        setWorksChartData(state, { payload }) {
            return {
                ...initState,
                ...state,
                worksChartData: payload,
            }
        },
        setTopicsChartData(state, { payload }) {
            return {
                ...initState,
                ...state,
                topicsChartData: payload,
            }
        },
        setLinksChartData(state, { payload }) {
            return {
                ...initState,
                ...state,
                linksChartData: payload,
            }
        },
    },
}

export default Model;