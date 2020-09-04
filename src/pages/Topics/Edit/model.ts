import { Effect, Reducer } from "umi";
import moment from 'moment';
import { ResponseData } from "@/utils/request";
import { updateData, getData } from "./service";
import { FormValueType, TopicsContent } from "./data.d";


export interface StateType {
    tableData: TopicsContent[];
    tableDrawerVisible: boolean;
    detailData: Partial<FormValueType>;
};

export interface ModeType {
    namespace: string;
    state: StateType;
    effects: {
        update: Effect;
        detail: Effect;
    },
    reducers: {
        setTableData: Reducer<StateType>;
        setTableDrawerVisible: Reducer<StateType>;
        setDetailData: Reducer<StateType>;
    }
};

const initState: StateType = {
    tableData: [],
    tableDrawerVisible: false,
    detailData: {},
}

const Model: ModeType = {
    namespace: 'TopicsEdit',
    state: initState,
    effects:{
        *update({ payload }, { call }) {
            const {id, ...params } = payload;
            const response: ResponseData =  yield call(updateData, id, {...params});
            const { code } = response;
            if (code === 0) {
                return true;
            }
  
            return false;
              
        },
        *detail({ payload }, { call, put }) {
            const response: ResponseData = yield call(getData, payload);
            const { code, data } = response;
            if (code === 0) {

                yield put({
                    type: 'setDetailData',
                    payload: {
                        title: data.title || '',
                        keywords: data.keywords || '',
                        description: data.description || '',
                        addtime: moment(data.addtime),
                        alias: data.alias || ''
                    }
                });               

                yield put({
                    type: 'setTableData',
                    payload: data.content || [],
                });

                return true;
            }
  
            return false;
        },
      },
    reducers: {
        setTableData(state, { payload }) {
            return {
                ...initState,
                ...state,
                tableData: payload,
            }
        },
        setTableDrawerVisible(state, { payload }) {
            return {
                ...initState,
                ...state,
                tableDrawerVisible: payload,
            }
        },
        setDetailData(state, { payload }) {
            return {
                ...initState,
                ...state,
                detailData: payload,
            }
        },
    }
}

export default Model;