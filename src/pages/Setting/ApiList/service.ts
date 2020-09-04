import request from '@/utils/request';

import { TableListParams, FormValueType } from './data.d';

export async function queryList(params?: TableListParams) {
    return request('/apis', {
        params,
    });
}

export async function addList(params: FormValueType) {
    return request('/apis',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}


export async function editList(id: number, params: FormValueType) {
    return request(`/apis/${ id }`, {
        method: 'PUT',
        data: {
            ...params,
        }
    });
}

export async function removeList( id: number ) {
    return request(`/apis/${ id }`, {
      method: 'delete'
    });
}