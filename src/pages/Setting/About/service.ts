import request from '@/utils/request';

import { FormValueParamsType } from "./data.d";


export async function updateData(params: FormValueParamsType) {
    return request('/about',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}

export async function getData() {
    return request('/about');
}