import { Effect, Reducer } from "umi";

import { ResponseData } from "@/utils/request";
import { addData } from "./service";
import { TopicsContent } from "./data.d";


export interface StateType {
    tableData: TopicsContent[];
    tableDrawerVisible: boolean;
}

export interface ModeType {
    namespace: string;
    state: StateType;
    effects: {
        create: Effect;
    },
    reducers: {
        setTableData: Reducer<StateType>;
        setTableDrawerVisible: Reducer<StateType>;
    }
}

const initState: StateType ={
    tableData: [],
    tableDrawerVisible: false,
}

const Model: ModeType = {
    namespace: 'TopicsAdd',
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
        }
    }
}

export default Model;