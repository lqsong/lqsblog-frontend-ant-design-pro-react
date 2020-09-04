import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

/* 以下自定义添加 lqs 2020 */

export const AJAX_RESPONSE_NO_VERIFY_URL = [
  '/user/login', // 用户登录
  '/user/info', // 获取用户信息
];

export const AJAX_HEADER_TOKEN_KEY = 'lqsblog-token';

export function setAjaxHeaderToken(token: string): void {
  localStorage.setItem(AJAX_HEADER_TOKEN_KEY, token);
}

export function getAjaxHeaderToken(): string | undefined | null {
  return localStorage.getItem(AJAX_HEADER_TOKEN_KEY);
}

export function removeAjaxHeaderToken(): void {
  localStorage.removeItem(AJAX_HEADER_TOKEN_KEY);
}
