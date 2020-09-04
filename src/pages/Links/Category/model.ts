import { Effect, Reducer } from "umi";
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
    };
    reducers: {
        queryList: Reducer<StateType>;
        setDetail: Reducer<StateType>;
        setCreateFormVisible: Reducer<StateType>;
        setUpdateFormVisible: Reducer<StateType>;
    }
}

const initState: StateType = {
    list: [],
    createFormVisible: false,
    updateFormVisible: false,
    detail: {}
}

const Model: ModeType = {
    namespace: 'LinksCategory',
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
        *create({ payload, callback }, { call }) {
            const response = yield call(addList, payload);
            if (callback && typeof callback === 'function') {
                callback(response)
            }
            /*
            const { code } = response;
            if (code === 0) {
                yield put({
                    type: 'setCreateFormVisible',
                    payload: false,
                })
            }
            */
        },
        *update({ payload, callback }, { call }) {
            const { id, ...params } = payload;
            const response = yield call(editList, id, { ...params });
            if (callback && typeof callback === 'function') {
                callback(response)
            }
        },  
        *remove({ payload, callback }, { call }) {
            const response = yield call(removeList, payload);
            if (callback && typeof callback === 'function') {
                callback(response)
            }
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