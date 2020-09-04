import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.global.form.validatefields.catch': 'The validation did not pass, please check the input',
  'app.global.modal.title.prompt': 'prompt',
  'app.global.modal.confirm.content-del': 'Are you sure to delete this data?',
  'app.global.modal.confirm.oktext-confirm': 'Confirm',
  'app.global.modal.confirm.cancelText-cancel': 'Cancel',
  'app.global.message.success.operation': 'Operation is successful',
  'app.global.message.success.del': 'Delete the success',
  'app.global.message.error.del': 'Delete failed',
  'app.global.text.choose': 'Please choose',  
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
