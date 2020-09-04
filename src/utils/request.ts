/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { history } from 'umi';
import { extend } from 'umi-request';
import { setAjaxHeaderToken, getAjaxHeaderToken, AJAX_HEADER_TOKEN_KEY, AJAX_RESPONSE_NO_VERIFY_URL } from '@/utils/authority';
import { notification } from 'antd';

export interface ResponseData {
  code: number;
  data?: any;
  msg?: string;
  token?: string;
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response, message: string }): Response => {
  const { response, message } = error;
  if(message === 'CancelToken') {
    // eslint-disable-next-line no-console
    console.log(message);
  } else if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }


  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'same-origin', // 默认请求是否带上cookie
  prefix: API_HOST
});

request.use(async (ctx, next) => {
  // 请求前
  const { req } = ctx;
  const { url, options } = req;

  const headers = {};
  const getToken = getAjaxHeaderToken();
  if (getToken) {
    headers[AJAX_HEADER_TOKEN_KEY] = getToken;
  }

  ctx.req.options = {
    ...options,
    headers,
  };


  await next();

  // 请求后
  const { res } = ctx;
  const { code, token } = res;

  // 重置刷新token
  if(token) {
    setAjaxHeaderToken(token);
  }

  // 如果自定义代码不是 0，则判断为错误。
  if (code !== 0) {

    const reqUrl = url.split("?")[0].replace(API_HOST, '');
    const noVerifyBool = AJAX_RESPONSE_NO_VERIFY_URL.includes(reqUrl);

    switch (code) {
          case 10002: // 未登陆

              if (!noVerifyBool) {
                notification.error({
                  message: `提示`,
                  description: '当前用户登入信息已失效，请重新登入再操作',
                });

                history.replace({
                  pathname: '/user/login',
                });
              }

              break;

          default:
              if (!noVerifyBool) {
                notification.error({
                  message: `请求错误`,
                  description: res.msg || 'Error',
                });
              }
              break;
    }



  }

});

export default request;
