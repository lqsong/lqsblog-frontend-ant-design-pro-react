import request from '@/utils/request';
import { FormValueType } from "./data.d";

export async function queryList() {
    return request('/roles');
}

export async function addList(params: FormValueType) {
    return request('/roles',{
        method: 'POST',
        data: {
            ...params,
        }
    })    
}

export async function editList(id: number, params: FormValueType) {
    return request(`/roles/${ id }`, {
        method: 'PUT',
        data: {
            ...params,
        }
    });
}

export async function removeList( id: number ) {
    return request(`/roles/${ id }`, {
      method: 'delete'
    });
}