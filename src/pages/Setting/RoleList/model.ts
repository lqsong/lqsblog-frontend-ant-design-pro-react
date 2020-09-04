import { Effect, Reducer } from "umi";
import { ResponseData } from '@/utils/request';
import { queryList, addList, editList, removeList } from "./service";

import { TableListItem } from "./data.d";

export interface StateType {
    list: TableListItem[];
    detail: Partial<TableListItem>;
    createFormVisible: boolean;
    updateFormVisible: boolean;
}

export interface ModeType {
    namespace: string;
    state: StateType;
    effects: {
        fetch: Effect;
        create: Effect;
        update: Effect;
        remove: Effect;
    },
    reducers: {
        queryList: Reducer<StateType>;
        setDetail: Reducer<StateType>;
        setCreateFormVisible: Reducer<StateType>;
        setUpdateFormVisible: Reducer<StateType>;
    }
}

const initState = {
    list: [],
    createFormVisible: false,
    updateFormVisible: false,
    detail: {}
}

const Model: ModeType = {
    namespace: 'SettingRoleList',
    state: initState,
    effects: {
        *fetch( _ , { call, put }) {
            const response = yield call(queryList);
            const { data } = response;
            yield put({
                type: 'queryList',
                payload: {
                    list: Array.isArray(data) ? data : [],
                },
            })
        },
        *create({ payload }, { call }) {
            const response: ResponseData  = yield call(addList, payload);
            const { code } = response;
            if (code === 0) {
                return true;
            }

            return false;
            
        },
        *update({ payload }, { call }) {
            const { id, ...params } = payload;
            const response: ResponseData = yield call(editList, id, { ...params });
            const { code } = response;
            if (code === 0) {
                return true;
            }

            return false;
        },  
        *remove({ payload }, { call }) {
            const response: ResponseData = yield call(removeList, payload);
            const { code } = response;
            if (code === 0) {
                return true;
            }

            return false;
            
        },      
    },
    reducers: {
        queryList(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },
        setDetail(state, { payload }) {
            return {
                ...initState,
                ...state,
                detail: payload,
            }
        },
        setCreateFormVisible(state, action) {
            return {
                ...initState,
                ...state,
                createFormVisible: action.payload,
            }
        },
        setUpdateFormVisible(state, action) {
            return {
                ...initState,
                ...state,
                updateFormVisible: action.payload,
            }
        }
    }
}

export default Model;