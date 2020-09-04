import request from '@/utils/request';
import { ApiParams } from './data.d';

export async function query(params?: ApiParams, cancelToken?: any) {
    return request('/apis/cascader', {
        params,
        cancelToken,
    });
}