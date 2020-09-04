import request from '@/utils/request';

import { TableListParams, FormValueType } from './data.d';

export async function queryList(params?: TableListParams) {
    return request('/menus', {
        params,
    });
}

export async function addList(params: FormValueType) {
    return request('/menus',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}


export async function editList(id: number, params: FormValueType) {
    return request(`/menus/${ id }`, {
        method: 'PUT',
        data: {
            ...params,
        }
    });
}

export async function removeList( id: number ) {
    return request(`/menus/${ id }`, {
      method: 'delete'
    });
}