import React , {useState, useEffect} from 'react';
import { connect, Dispatch, FormattedMessage, useIntl } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsNewType , getImgCode } from '@/services/login';
import { ConnectState } from '@/models/connect';
import { Alert, Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockTwoTone, MailTwoTone } from '@ant-design/icons';


import styles from './style.less';
import stylesLogin from './components/Login/index.less';




interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const intl = useIntl();

  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;

  const [imgCodeDataLoading, handleImgCodeDataLoading] = useState<boolean>(false);
  const [imgCodeData, handleImgCodeData] = useState<string>(''); 
  const [imgCodeToken, handleImgCodeToken] = useState<string>(''); 

  const getImgCodeData = async () => {
    handleImgCodeDataLoading(true);

    const result = await getImgCode()
    const { code, data } = result;
    if(code === 0) {
      const { base64, tokenCode } = data;
      handleImgCodeData(base64);
      handleImgCodeToken(tokenCode);
      handleImgCodeDataLoading(false);
    }

  }

  const handleSubmit = (values: LoginParamsNewType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  useEffect(() => {
    getImgCodeData();
  },[])

  return (
    <div className={styles.main}>
      <div className={stylesLogin.login}>
      <Form 
        onFinish={(values) => {
          handleSubmit({...values, imgCodeToken} as LoginParamsNewType);
        }}
        >
          {status === 'error' && !submitting && (
            <LoginMessage content={intl.formatMessage({ id: 'app.user.login.message-tip' })} />
          )}

          <Form.Item name="username" rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'app.user.login.form-item-username-required' }),
              },
            ]}>
            <Input size='large' id='username' prefix={<UserOutlined style={{ color: '#1890ff'}} className={stylesLogin.prefixIcon} />} placeholder={intl.formatMessage({ id: 'app.user.login.form-item-username' })}/>
          </Form.Item>

          <Form.Item name="password" rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'app.user.login.form-item-password-required' }),
              },
            ]}>
            <Input size='large' id='password'  type='password' prefix={<LockTwoTone className={stylesLogin.prefixIcon} />} placeholder={intl.formatMessage({ id: 'app.user.login.form-item-password' })}/>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
              <Row gutter={8}>
                <Col span={16}>
                  <Form.Item name="imgCode" rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'app.user.login.form-item-imgcode-required' }),
                    },
                  ]}>
                    <Input  size='large' prefix={<MailTwoTone className={stylesLogin.prefixIcon} />} placeholder={intl.formatMessage({ id: 'app.user.login.form-item-imgcode' })} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    className={stylesLogin.getCaptcha}
                    size="large"
                    loading={imgCodeDataLoading}
                    onClick={()=> {
                      getImgCodeData();
                    }}
                  >
                    <img alt="" src={imgCodeData} />
                  </Button>
                </Col>
              </Row>
          </Form.Item>


          <Form.Item>
            <Button size="large" className={stylesLogin.submit} type="primary" htmlType="submit" loading={submitting} >
            <FormattedMessage id="app.user.login.form.btn-submit" />
            </Button>
          </Form.Item>




      </Form>
      </div>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
