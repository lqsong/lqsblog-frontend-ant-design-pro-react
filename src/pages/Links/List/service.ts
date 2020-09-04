import request from '@/utils/request';
import { TableListParams, FormValueType } from './data.d';


export async function queryList(params?: TableListParams) {
    return request('/links', {
        params,
    });
}

export async function addList(params: FormValueType) {
    return request('/links', {
      method: 'POST',
      data: {
        ...params,
      },
    });
}

export async function detailList(id: number) {
  return request(`/links/${ id }`);
}

export async function updateList(id: number, params: FormValueType) {
  return request(`/links/${ id }`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function removeList( id: number ) {
  return request(`/links/${ id }`, {
    method: 'delete'
  });
}