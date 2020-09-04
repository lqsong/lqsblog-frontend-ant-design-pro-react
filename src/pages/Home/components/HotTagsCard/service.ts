import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryList(params?: TableListParams) {
    return request('/tags', {
        params,
    });
}