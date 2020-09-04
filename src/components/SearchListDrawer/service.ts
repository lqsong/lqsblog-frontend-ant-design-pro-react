import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryList(params?: TableListParams) {
    return request('/searchs', {
        params,
    });
}