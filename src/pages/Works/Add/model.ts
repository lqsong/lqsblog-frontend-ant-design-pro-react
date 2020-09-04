import { Effect, Reducer } from "umi";

import { ResponseData } from "@/utils/request";
import { addData } from "./service";

export interface StateType {
    serverImageList: string[];
    editorValue: string;
}


export interface ModeType {
    namespace: string;
    state: StateType;
    effects:{
        create: Effect;
    },
    reducers: {
        setServerImageList: Reducer<StateType>;
        setEditorValue: Reducer<StateType>;
    }
}

const initState: StateType = {
    serverImageList: [],
    editorValue: '',
}

const Model: ModeType = {
    namespace: 'WorksAdd',
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
    }
}

export default Model;