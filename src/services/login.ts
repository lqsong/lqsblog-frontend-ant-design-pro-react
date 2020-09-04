import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export interface LoginParamsNewType {
  username: string;
  password: string;
  imgCode: string;
  imgCodeToken: string;
}

export async function fakeAccountLogin(params: LoginParamsNewType) {
  return request('/user/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/login/captcha?mobile=${mobile}`);
}

export async function getImgCode() {
  return request(`/guest/validateCodeImg`);
}
