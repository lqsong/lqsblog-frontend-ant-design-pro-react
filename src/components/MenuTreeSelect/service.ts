import request from '@/utils/request';
import { MenuParams } from './data.d';

export async function query(params?: MenuParams, cancelToken?: any) {
    return request('/menus/cascader', {
        params,
        cancelToken,
    });
}