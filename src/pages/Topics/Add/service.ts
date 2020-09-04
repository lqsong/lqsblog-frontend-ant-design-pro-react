import request from '@/utils/request';

import { FormValueParamsType } from "./data.d";


export async function addData(params: FormValueParamsType) {
    return request('/topics',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}