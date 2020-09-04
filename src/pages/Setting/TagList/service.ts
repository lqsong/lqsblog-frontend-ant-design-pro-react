import request from '@/utils/request';
import { TableListParams, FormValueType } from './data.d';


export async function queryList(params?: TableListParams) {
    return request('/tags', {
        params,
    });
}

export async function addList(params: FormValueType) {
    return request('/tags', {
      method: 'POST',
      data: {
        ...params,
      },
    });
}

export async function updateList(id: number, params: FormValueType) {
  return request(`/tags/${ id }`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function removeList( id: number ) {
  return request(`/tags/${ id }`, {
    method: 'delete'
  });
}