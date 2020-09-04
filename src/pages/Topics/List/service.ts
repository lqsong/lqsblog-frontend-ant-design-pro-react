import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryList(params?: TableListParams) {
    return request('/topics', {
        params,
    });
}

export async function removeList( id: number ) {
    return request(`/topics/${ id }`, {
      method: 'delete'
    });
}