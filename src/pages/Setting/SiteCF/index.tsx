import React, { useEffect, useState } from 'react';
import { connect, useIntl, Dispatch } from "umi";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form , Card, Row, Col, message, Button, Input, Result, Spin, DatePicker } from 'antd';
import FixedFooterToolbar from '@/components/FixedFooterToolbar';
import { StateType } from './model';
import { FormValueParamsType } from './data.d';


interface SettingSiteConfigPageProps {
  state: StateType;
  dispatch: Dispatch;
  updateFormSubmitLoading: boolean;
}


const SettingSiteConfigPage: React.FC<SettingSiteConfigPageProps> = ({ state, dispatch, updateFormSubmitLoading }) => {

    const intl = useIntl();

    const { detailData } = state;

    const [detailLoading, setDetailLoading] = useState<boolean>(true);

    const [form] = Form.useForm();

    const onFinish = async () => {
        try {
            const fieldsValue:any = await form.validateFields();

            const formValue: FormValueParamsType = {
                ...fieldsValue,
                siteCreationTime: fieldsValue.siteCreationTime.format('YYYY'),
            } 

            const res: boolean = await dispatch({
                type: 'SettingSiteConfig/update',
                payload: formValue,
            });

            if (res) {
                message.success(intl.formatMessage({ id: 'app.settingsiteconfig.card-form.submit-success.content' }));
            }

        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }




    useEffect(() => {
        const init = async () => {

            await dispatch({
                type: 'SettingSiteConfig/detail'
            });

            setDetailLoading(false);

        };
        init();
    },[1])




    return detailLoading ? (
        <Result icon={<Spin size="large" />} />
    ): (
        <Form
            form={form}
            name="settingsiteconfigform"
            layout="vertical"
            initialValues={detailData}
        >
          <PageHeaderWrapper title={false}>

          <Card title={intl.formatMessage({ id: 'app.settingsiteconfig.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-keywords-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-description-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col> 

                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-creattime' })}
                                name="siteCreationTime"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-creattime-placeholder' }) },
                                ]}
                            >
                                <DatePicker  picker="year"  style={{width:'100%'}} />
                            </Form.Item>
                        </Col>                        
                        
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-icp' })}
                                name="icp"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-icp-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-icp-placeholder' })} />
                            </Form.Item>
                        </Col>

                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-copyrightperson' })}
                                name="copyrightPerson"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-copyrightperson-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-copyrightperson-placeholder' })} />
                            </Form.Item>
                        </Col>

                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-copyrighturl' })}
                                name="copyrightUrl"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-copyrighturl-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingsiteconfig.card-form.form-item-copyrighturl-placeholder' })} />
                            </Form.Item>
                        </Col>

                    </Row>
                </Card>

          </PageHeaderWrapper>

          <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={updateFormSubmitLoading}>{intl.formatMessage({ id: 'app.settingsiteconfig.card-form.btn-submit' })}</Button>
          </FixedFooterToolbar>

        </Form>
    );







}

export default connect(
  ({
    SettingSiteConfig,
    loading,
  }:{
    SettingSiteConfig: StateType;
    loading: {
      effects: {
        [key:string]: boolean;
      }
    }
  }) => ({
    state: SettingSiteConfig,
    updateFormSubmitLoading: loading.effects['SettingSiteConfig/update'],
  })
)(SettingSiteConfigPage);



