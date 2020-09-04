import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/user/info');
}

export async function queryNotices(): Promise<any> {
  return request('/notices');
}
