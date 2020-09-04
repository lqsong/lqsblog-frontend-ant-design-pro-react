import React, { useRef, useEffect, useState } from 'react';
import { connect, useIntl, Dispatch } from "umi";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form , Card, Row, Col, message, Button, Input, Result, Spin  } from 'antd';

import TuiEditor from '@/components/TuiEditor';
import FixedFooterToolbar from '@/components/FixedFooterToolbar';

import { StateType } from "./model";
import { FormValueParamsType } from './data.d';

interface SettingAboutPageProps {
  state: StateType;
  dispatch: Dispatch;
  updateFormSubmitLoading: boolean;
}

const SettingAboutPage: React.FC<SettingAboutPageProps> = ({ state, dispatch, updateFormSubmitLoading }) => {

    const intl = useIntl();
    const editorRef = useRef<any>();

    const { editorValue, detailData } = state;

    const [detailLoading, setDetailLoading] = useState<boolean>(true);

    const [form] = Form.useForm();

    const setEditorValue = (v: string): void => {
        dispatch({
            type: 'SettingAbout/setEditorValue',
            payload: v,
        });
    }


    const onFinish = async () => {
        try {
            const fieldsValue = await form.validateFields();

            const formValue: FormValueParamsType = {
                title: fieldsValue.title,
                keywords: fieldsValue.keywords,
                description: fieldsValue.description,
                content: editorValue,
            } 
            const res: boolean = await dispatch({
                type: 'SettingAbout/update',
                payload: formValue,
            });

            if (res) {
                message.success(intl.formatMessage({ id: 'app.settingabout.card-form.submit-success.content' }));
            }

        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }




    useEffect(() => {
        const init = async () => {

            await dispatch({
                type: 'SettingAbout/detail'
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
            name="settingaboutform"
            layout="vertical"
            initialValues={detailData}
        >
          <PageHeaderWrapper title={false}>

          <Card title={intl.formatMessage({ id: 'app.settingabout.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingabout.card-form.form-item-title' })}
                                name="title"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingabout.card-form.form-item-title-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingabout.card-form.form-item-title-placeholder' })} />
                            </Form.Item>
                        </Col>                        
                        
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingabout.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingabout.card-form.form-item-keywords-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingabout.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.settingabout.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.settingabout.card-form.form-item-description-placeholder' }) },
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.settingabout.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col>                        
                    </Row>
                </Card>


                <Card title={intl.formatMessage({ id: 'app.settingabout.card-title-content' })} bordered={false} className="margin-b24" bodyStyle={{padding: '16px'}}>
                    <TuiEditor ref={editorRef} value={editorValue} onChange={setEditorValue} />
                </Card>


          </PageHeaderWrapper>

          <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={updateFormSubmitLoading}>{intl.formatMessage({ id: 'app.settingabout.card-form.btn-submit' })}</Button>
          </FixedFooterToolbar>

        </Form>
    );





}


export default connect(
  ({
    SettingAbout,
    loading,
  }:{
    SettingAbout: StateType;
    loading: {
      effects: {
        [key:string]: boolean;
      }
    }
  }) => ({
    state: SettingAbout,
    updateFormSubmitLoading: loading.effects['SettingAbout/update']
  })
)(SettingAboutPage);



