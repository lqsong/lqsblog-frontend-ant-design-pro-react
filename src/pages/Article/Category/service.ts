import request from '@/utils/request';

import { TableListParams, FormValueType } from './data.d';

export async function queryList(params?: TableListParams) {
    return request('/article/categorys', {
        params,
    });
}

export async function addList(params: FormValueType) {
    return request('/article/categorys',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}


export async function editList(id: number, params: FormValueType) {
    return request(`/article/categorys/${ id }`, {
        method: 'PUT',
        data: {
            ...params,
        }
    });
}

export async function removeList( id: number ) {
    return request(`/article/categorys/${ id }`, {
      method: 'delete'
    });
}