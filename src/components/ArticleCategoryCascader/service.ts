import request from '@/utils/request';
import { CascaderParams } from './data.d';


export async function queryCascader(params?: CascaderParams) {
    return request('/article/categorys/cascader', {
        params,
    });
}