import { Effect, Reducer } from "umi";

import { ResponseData } from '@/utils/request';
import { TableListItem } from "./data.d";
import { updateTreeDataChildren, updateTreeDataChildItem, updateTreeDataItem, removeTreeDataItem } from "./utils";
import { queryList, addList, editList, removeList } from "./service";


export interface StateType {
    list: TableListItem[];
    createFormValues: Partial<TableListItem>;
    createFormVisible: boolean;
    updateFormValues: Partial<TableListItem>;
    updateFormVisible: boolean;
}


export interface ModeType {
    namespace: string;
    state: StateType;
    effects: {
        query: Effect;
        create: Effect;
        update: Effect;
        remove: Effect;
    },
    reducers: {
        setList: Reducer<StateType>;
        setListChild: Reducer<StateType>;
        addListItem: Reducer<StateType>;
        addListChildItem: Reducer<StateType>;
        updateListItem: Reducer<StateType>;
        removeListItem: Reducer<StateType>;
        setCreateFormValues: Reducer<StateType>;
        setCreateFormVisible: Reducer<StateType>;
        setUpdateFormValues: Reducer<StateType>;
        setUpdateFormVisible: Reducer<StateType>;        
    }
}


const initState: StateType = {
    list: [],
    createFormValues: {},
    createFormVisible: false,
    updateFormValues: {},
    updateFormVisible: false,
}


const Model: ModeType = {
    namespace: 'SettingApiList',
    state: initState,
    effects: {
        *query({ payload }, { call, put }) {
            const response: ResponseData = yield call(queryList, payload);
            const { code, data } = response;
            if( code === 0 ) {
                const pid = payload.pid || 0;
                if( pid < 1 ) {
                    yield put({
                        type: 'setList',
                        payload:  Array.isArray(data) ? data : [],
                    })
                } else {
                    yield put({
                        type: 'setListChild',
                        payload: {
                            id: pid,
                            children:  Array.isArray(data) ? data : [],
                        }
                    })
                }
                
                return true;

            } 
                return false;
            
        },
        *create({ payload }, { call, put }) {
            const response: ResponseData = yield call(addList, payload);
            const { code, data } = response;
            if( code === 0 ) {
                const id = data.id || 0;

                if (payload.pid < 1) {
                    yield put({
                        type: 'addListItem',
                        payload: {
                            id,
                            name: payload.name,
                            permission: payload.permission,
                            pid: payload.pid,
                          }
                    })
                } else {
                    yield put({
                        type: 'addListChildItem',
                        payload: {
                            id: payload.pid,
                            childItem: {
                              id,
                              name: payload.name,
                              permission: payload.permission,
                              pid: payload.pid,
                            }
                          }
                    })
                }
                return true;
            } 
                return false;
            

        },
        *update({ payload }, { call, put }) {
            const { id, ...params } = payload;
            const response: ResponseData =  yield call(editList, id, {...params} );
            const { code } = response;
            if( code === 0 ) {
                yield put({
                    type: 'updateListItem',
                    payload,
                })
                return true;
            } 
                return false;
            
        },
        *remove({ payload }, { call, put }) {
            const response: ResponseData =  yield call(removeList, payload);
            const { code } = response;
            if( code === 0 ) {
                yield put({
                    type: 'removeListItem',
                    payload,
                })
                return true;
            } 
                return false;
            
        },
    },
    reducers: {
        setList(state, { payload }) {
            return {
                ...initState,
                ...state,
                list: payload
            };
        },
        setListChild(state, { payload }) {
            const list = (state && state.list) || [];
            return {
                ...initState,
                ...state,
                list: updateTreeDataChildren(list, payload.id, payload.children),
            }
        },
        addListItem(state, { payload }) {
            const list= (state && state.list) || [];
            list.push(payload);
            return {
                ...initState,
                ...state,
                list: [...list],
            }
        },
        addListChildItem(state, { payload }) {
            const list = (state && state.list) || [];
            return {
                ...initState,
                ...state,
                list: updateTreeDataChildItem(list, payload.id, payload.childItem),
            }
        },
        updateListItem(state, { payload }){
            const list = (state && state.list) || [];
            return {
                ...initState,
                ...state,
                list: updateTreeDataItem(list, payload),
            }
        },
        removeListItem(state, { payload }) {
            const list = (state && state.list) || [];
            return {
                ...initState,
                ...state,
                list: removeTreeDataItem(list, payload),
            }
        },
        setCreateFormValues(state, { payload }) {
            return {
                ...initState,
                ...state,
                createFormValues: payload,
            }
        },
        setCreateFormVisible(state, { payload }) {
            return {
                ...initState,
                ...state,
                createFormVisible: payload,
            }
        },
        setUpdateFormValues(state, { payload }) {
            return {
                ...initState,
                ...state,
                updateFormValues: payload,
            }
        },
        setUpdateFormVisible(state, { payload }) {
            return {
                ...initState,
                ...state,
                updateFormVisible: payload,
            }
        }
    }
}


export default Model;



