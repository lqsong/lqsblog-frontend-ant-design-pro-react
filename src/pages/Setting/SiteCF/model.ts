import { Effect, Reducer } from "umi";
import moment from 'moment';
import { ResponseData } from "@/utils/request";
import { updateData, getData } from "./service";
import { FormValueType } from "./data.d";

export interface StateType {
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
        setDetailData: Reducer<StateType>;
    }
}

const initState: StateType = {
    detailData: {},
}

const Model: ModeType = {
    namespace: 'SettingSiteConfig',
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
                        keywords: data.keywords || '',
                        description: data.description || '',
                        siteCreationTime: moment(data.siteCreationTime),
                        icp: data.icp || '',
                        copyrightPerson: data.copyrightPerson || '',
                        copyrightUrl: data.copyrightUrl || '',
                    }
                });

                return true;
            }
  
            return false;
        },
    },
    reducers: {
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
