import { Effect, Reducer } from "umi";

import { ResponseData } from "@/utils/request";
import { TableListItem } from "@/components/ArticleTableChoose/data.d";
import { addData } from "./service";


export interface StateType {
    serverImageList: string[];
    editorValue: string;
    tableData: TableListItem[];
    tableDataIds: number[];
    tableDrawerVisible: boolean;
}

export interface ModeType {
    namespace: string;
    state: StateType;
    effects: {
        create: Effect;
    },
    reducers: {
        setServerImageList: Reducer<StateType>;
        setEditorValue: Reducer<StateType>;
        setTableData: Reducer<StateType>;
        setTableDrawerVisible: Reducer<StateType>;
    }
}

const initState: StateType = {
    serverImageList: [],
    editorValue: '',
    tableData: [],
    tableDataIds: [],
    tableDrawerVisible: false,
}

const Model: ModeType = {
    namespace: 'ArticleAdd',
    state: initState,
    effects: {
        *create({ payload }, { call }) {

          const response: ResponseData =  yield call(addData, payload);
          const { code } = response;
          if (code === 0) {
              return true;
          }

          return false;
            
        }
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
        }
    }
}

export default Model;