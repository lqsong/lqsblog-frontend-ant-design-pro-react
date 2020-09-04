import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryList(params?: TableListParams) {
    return request('/works', {
        params,
    });
}

export async function removeList( id: number ) {
    return request(`/works/${ id }`, {
      method: 'delete'
    });
}