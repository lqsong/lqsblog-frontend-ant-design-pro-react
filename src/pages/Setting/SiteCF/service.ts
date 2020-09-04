import request from '@/utils/request';

import { FormValueType } from "./data.d";


export async function updateData(params: FormValueType) {
    return request('/config',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}

export async function getData() {
    return request('/config');
}