import request from '@/utils/request';

export async function querySelect() {
    return request('/roles')
}