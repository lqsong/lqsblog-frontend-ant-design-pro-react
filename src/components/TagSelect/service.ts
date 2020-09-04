import request from '@/utils/request';

import { TagSelectParams } from './data.d';

export async function querySelect(params?:TagSelectParams) {
    return request('/tags/search',{
        params
    })
}