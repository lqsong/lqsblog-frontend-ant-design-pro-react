// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV, API_HOST } = process.env;

export default defineConfig({
  define:{
    API_HOST: API_HOST
  },
  history: { type: 'hash' },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            {
              path: '/home',
              name: 'home',
              icon: 'HomeOutlined',
              component: './Home/Index',
            },
            {
              path: '/article',
              name: 'article',
              icon: 'FormOutlined',
              authority: ['admin','article'],
              routes: [
                {
                  path: '/article/list',
                  name: 'article-list',
                  component: './Article/List',
                  authority: ['admin','article-list'],
                },
                {
                  path: '/article/add',
                  name: 'article-add',
                  component: './Article/Add',
                  authority: ['admin','article-add'],
                  hideInMenu: true
                },
                {
                  path: '/article/edit-:id',
                  name: 'article-edit',
                  component: './Article/Edit',
                  authority: ['admin','article-edit'],
                  hideInMenu: true
                },
                {
                  path: '/article/category',
                  name: 'article-category',
                  component: './Article/Category',
                  authority: ['admin','article-category'],
                },
                {
                  component: './404',
                }
              ],
            },
            {
              path: '/works',
              name: 'works',
              icon: 'CrownOutlined',
              authority: ['admin','works'],
              routes: [
                {
                  path: '/works/list',
                  name: 'works-list',
                  component: './Works/List',
                  authority: ['admin','works-list'],
                },
                {
                  path: '/works/add',
                  name: 'works-add',
                  component: './Works/Add',
                  authority: ['admin','works-add'],
                  hideInMenu: true
                },
                {
                  path: '/works/edit-:id',
                  name: 'works-edit',
                  component: './Works/Edit',
                  authority: ['admin','works-edit'],
                  hideInMenu: true
                },
                {
                  component: './404',
                }
              ],
            },
            {
              path: '/topics',
              name: 'topics',
              icon: 'SketchOutlined',
              authority: ['admin','topics'],
              routes: [
                {
                  path: '/topics/list',
                  name: 'topics-list',
                  component: './Topics/List',
                  authority: ['admin','topics-list'],
                },
                {
                  path: '/topics/add',
                  name: 'topics-add',
                  component: './Topics/Add',
                  authority: ['admin','topics-add'],
                  hideInMenu: true
                },
                {
                  path: '/topics/edit-:id',
                  name: 'topics-edit',
                  component: './Topics/Edit',
                  authority: ['admin','topics-edit'],
                  hideInMenu: true
                },
                {
                  component: './404',
                }
              ],
            },
            {
              path: '/links',
              name: 'links',
              icon: 'LinkOutlined',
              authority: ['admin','links'],
              routes: [
                {
                  path: '/links/list',
                  name: 'links-list',
                  component: './Links/List',
                  authority: ['admin','links-list'],
                },{
                  path: '/links/category',
                  name: 'links-category',
                  component: './Links/Category',
                  authority: ['admin','links-category'],
                },
                {
                  component: './404',
                }
              ],
            },
            {
              path: '/setting',
              name: 'setting',
              icon: 'SettingOutlined',
              authority: ['admin','setting'],
              routes: [
                {
                  path: '/setting/about',
                  name: 'setting-about',
                  component: './Setting/About',
                  authority: ['admin','setting-about'],
                },
                {
                  path: '/setting/taglist',
                  name: 'setting-taglist',
                  component: './Setting/TagList',
                  authority: ['admin','setting-taglist'],
                },
                {
                  path: '/setting/accountlist',
                  name: 'setting-accountlist',
                  component: './Setting/AccountList',
                  authority: ['admin','setting-accountlist'],
                },
                {
                  path: '/setting/rolelist',
                  name: 'setting-rolelist',
                  component: './Setting/RoleList',
                  authority: ['admin','setting-rolelist'],
                },
                {
                  path: '/setting/menulist',
                  name: 'setting-menulist',
                  component: './Setting/MenuList',
                  authority: ['admin','setting-menulist'],
                },
                {
                  path: '/setting/apilist',
                  name: 'setting-apilist',
                  component: './Setting/ApiList',
                  authority: ['admin','setting-apilist'],
                },
                {
                  path: '/setting/siteconfig',
                  name: 'setting-siteconfig',
                  component: './Setting/SiteCF',
                  authority: ['admin','setting-siteconfig'],
                },
                {
                  component: './404',
                }
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
