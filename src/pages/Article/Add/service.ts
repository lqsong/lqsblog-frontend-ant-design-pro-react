import request from '@/utils/request';

import { FormValueType } from "./data.d";


export async function addData(params: FormValueType) {
    return request('/articles',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}