import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.global.form.validatefields.catch': '验证不通过，请检查输入',
  'app.global.modal.title.prompt': '提示',
  'app.global.modal.confirm.content-del': '确定删除该数据吗？',
  'app.global.modal.confirm.oktext-confirm': '确认',
  'app.global.modal.confirm.cancelText-cancel': '取消',
  'app.global.message.success.operation': '操作成功',
  'app.global.message.success.del': '删除成功',
  'app.global.message.error.del': '删除失败',
  'app.global.text.choose': '请选择',  
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
