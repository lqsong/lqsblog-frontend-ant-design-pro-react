import request from '@/utils/request';

import { FormValueParamsType } from "./data.d";


export async function updateData(id: number, params: FormValueParamsType) {
    return request(`/topics/${ id }`,{
        method: 'PUT',
        data: {
            ...params,
        }
    })    
}

export async function getData(id: number) {
    return request(`/topics/${ id }`);
}