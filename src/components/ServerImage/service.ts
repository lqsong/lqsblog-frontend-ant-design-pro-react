import request from '@/utils/request';
import { ImgListParams } from './data.d';


export async function queryImgList(params?: ImgListParams) {
    return request('/upload/images', {
        params,
    });
}