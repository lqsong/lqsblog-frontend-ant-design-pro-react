import component from './zh-TW/component';
import globalHeader from './zh-TW/globalHeader';
import menu from './zh-TW/menu';
import pwa from './zh-TW/pwa';
import settingDrawer from './zh-TW/settingDrawer';
import settings from './zh-TW/settings';

export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.global.form.validatefields.catch': '驗證不通過，請檢查輸入',
  'app.global.modal.title.prompt': '提示',
  'app.global.modal.confirm.content-del': '確定刪除該數據嗎？',
  'app.global.modal.confirm.oktext-confirm': '確認',
  'app.global.modal.confirm.cancelText-cancel': '取消',
  'app.global.message.success.operation': '操作成功',
  'app.global.message.success.del': '刪除成功',
  'app.global.message.error.del': '刪除失敗',
  'app.global.text.choose': '請選擇',  
  'app.preview.down.block': '下載此頁面到本地項目',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
