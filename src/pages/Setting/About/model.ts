import { Effect, Reducer } from "umi";
import { ResponseData } from "@/utils/request";
import { updateData, getData } from "./service";
import { FormValueType } from "./data.d";

export interface StateType {
    editorValue: string;
    detailData: Partial<FormValueType>;
}

export interface ModeType {
    namespace: string;
    state: StateType;
    effects: {
        update: Effect;
        detail: Effect;
    },
    reducers: {
        setEditorValue: Reducer<StateType>;
        setDetailData: Reducer<StateType>;
    }
}


const initState: StateType = {
    editorValue: '',
    detailData: {},
}


const Model: ModeType = {
    namespace: 'SettingAbout',
    state: initState,
    effects: {
        *update({ payload }, { call }) {
            const response: ResponseData =  yield call(updateData, payload);
            const { code } = response;
            if (code === 0) {
                return true;
            }
  
            return false;
              
        },
        *detail( _ , { call, put }) {
            const response: ResponseData = yield call(getData);
            const { code, data } = response;
            if (code === 0) {

                yield put({
                    type: 'setDetailData',
                    payload: {
                        title: data.title || '',
                        keywords: data.keywords || '',
                        description: data.description || '',
                    }
                });

                yield put({
                    type: 'setEditorValue',
                    payload: data.content || '',
                });

                return true;
            }
  
            return false;
        },
    },
    reducers: {
        setEditorValue(state, { payload }) {
            return {
                ...initState,
                ...state,
                editorValue: payload,
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








