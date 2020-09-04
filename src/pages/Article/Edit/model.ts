import { Effect, Reducer } from "umi";
import moment from 'moment';
import { ResponseData } from "@/utils/request";
import { TableListItem } from "@/components/ArticleTableChoose/data.d";
import { trimComma, trimVerticalBar } from "@/utils/trim";
import { updateData, getData } from "./service";
import { FormValueType } from "./data.d";

export interface StateType {
    serverImageList: string[];
    editorValue: string;
    tableData: TableListItem[];
    tableDataIds: number[];
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
        setServerImageList: Reducer<StateType>;
        setEditorValue: Reducer<StateType>;
        setTableData: Reducer<StateType>;
        setTableDrawerVisible: Reducer<StateType>;
        setDetailData: Reducer<StateType>;
    }
};

const initState: StateType = {
    serverImageList: [],
    editorValue: '',
    tableData: [],
    tableDataIds: [],
    tableDrawerVisible: false,
    detailData: {},
}

const Model: ModeType = {
    namespace: 'ArticleEdit',
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
                        category: trimComma(data.categoryIds).split(',').map(item => parseInt(item,10)),
                        tag: trimComma(data.tag).split(','),
                    }
                });

                yield put({
                    type: 'setServerImageList',
                    payload: trimVerticalBar(data.thumb).split('|'),
                });

                yield put({
                    type: 'setEditorValue',
                    payload: data.content || '',
                });

                yield put({
                    type: 'setTableData',
                    payload: data.interest || [],
                });

                return true;
            }
  
            return false;
        },
      },
    reducers: {
        setServerImageList(state, { payload }) {
            return {
                ...initState,
                ...state,
                serverImageList: payload
            }
        },
        setEditorValue(state, { payload }) {
            return {
                ...initState,
                ...state,
                editorValue: payload,
            }
        },
        setTableData(state, { payload }) {
             
            const tableDataIds: number[] = [];

            for (let index = 0, len = payload.length; index < len; index+=1) {
                const element = payload[index];
                tableDataIds.push(element.id);                
            }

            return {
                ...initState,
                ...state,
                tableData: payload,
                tableDataIds,
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