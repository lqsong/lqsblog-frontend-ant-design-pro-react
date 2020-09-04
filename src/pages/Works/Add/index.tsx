import React, { useRef } from 'react';
import { Dispatch, connect, useIntl, history } from "umi";
import { CheckCircleTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { Form , Card, Row, Col, message, Modal, Button, Input, DatePicker } from 'antd';

import TagSelect from '@/components/TagSelect';
import ServerImageSelectionList from '@/components/ServerImage/SelectionList';
import TuiEditor from '@/components/TuiEditor';
import FixedFooterToolbar from '@/components/FixedFooterToolbar';

import { StateType } from "./model";
import { FormValueParamsType } from "./data.d";

interface WorksAddPageProps {
    state: StateType;
    dispatch: Dispatch;
    createFormSubmitLoading: boolean;
}

const WorksAddPage: React.FC<WorksAddPageProps> = ({state, dispatch, createFormSubmitLoading}) => {

    const intl = useIntl();
    const serverImgListRef = useRef<any>();
    const editorRef = useRef<any>();

    const { serverImageList, editorValue } = state;

    const handleServerImageList = (v: string[]): void => {
        dispatch({
            type: 'WorksAdd/setServerImageList',
            payload: v,
        })
    }

    const setEditorValue = (v: string): void => {
        dispatch({
            type: 'WorksAdd/setEditorValue',
            payload: v,
        });
    }

    const [form] = Form.useForm();


    const onFinish = async () => {
        try {
            const fieldsValue = await form.validateFields();


            const formValue: FormValueParamsType = {
                title: fieldsValue.title,
                keywords: fieldsValue.keywords,
                description: fieldsValue.description,
                addtime: fieldsValue.addtime.format('YYYY-MM-DD HH:mm:ss'),
                tag: fieldsValue.tag ? fieldsValue.tag.join(',') : '',
                thumb: serverImageList.join('|'),
                content: editorValue,
            } 
            const res: boolean = await dispatch({
                type: 'WorksAdd/create',
                payload: formValue,
            });

            if (res) {
                Modal.confirm({
                content: <><CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize: '22px', marginRight: '10px'}} /><span>{intl.formatMessage({ id: 'app.worksadd.card-form.submit-confirm.content' })}</span></>,
                    cancelText: intl.formatMessage({ id: 'app.worksadd.card-form.submit-confirm.btn-cancel' }),
                    okText: intl.formatMessage({ id: 'app.worksadd.card-form.submit-confirm.btn-ok' }),
                    onOk:() => {
                        form.resetFields();
                        serverImgListRef.current.setListValue([]);
                        editorRef.current.setValue('');
                    },
                    onCancel: () => {
                        history.push('/works/list');
                    }
                });
            }

        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }

    return (
        <Form
            form={form}
            name="worksaddform"
            layout="vertical"
        >
            <PageHeaderWrapper title={false}>

            <Card title={intl.formatMessage({ id: 'app.worksadd.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-title' })}
                                name="title"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.worksadd.card-form.form-item-title-placeholder' }) },
                                    { min: 5, max: 100, message: intl.formatMessage({ id: 'app.worksadd.card-form.form-item-title-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-title-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-addtime' })}
                                name="addtime"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.worksadd.card-form.form-item-addtime-placeholder' }) }]}
                            >
                                <DatePicker showTime  style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.worksadd.card-form.form-item-keywords-placeholder' }) },
                                    { min: 2, max: 50, message: intl.formatMessage({ id: 'app.worksadd.card-form.form-item-keywords-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.worksadd.card-form.form-item-description-placeholder' }) },
                                    { min: 10, max: 200, message: intl.formatMessage({ id: 'app.worksadd.card-form.form-item-description-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-tag' })}
                                name="tag"
                            >
                                <TagSelect mode="multiple" placeholder={intl.formatMessage({ id: 'app.worksadd.card-form.form-item-tag-placeholder' })}  />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card
                    title={<><span>{intl.formatMessage({ id: 'app.worksadd.card-title-thumb' })}</span><span className="color-e6a23c margin-l10">{intl.formatMessage({ id: 'app.worksadd.card-title-thumb-tips' })}</span></>} 
                    bordered={false}
                    className="margin-b24"
                 >
                      <ServerImageSelectionList ref={serverImgListRef} defaultValue={serverImageList} setValue={handleServerImageList} limit={4} />
                </Card>

                <Card title={intl.formatMessage({ id: 'app.worksadd.card-title-content' })} bordered={false} className="margin-b24" bodyStyle={{padding: '16px'}}>
                    <TuiEditor ref={editorRef} value={editorValue} onChange={setEditorValue} />
                </Card>

            </PageHeaderWrapper>
            <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={createFormSubmitLoading}>{intl.formatMessage({ id: 'app.worksadd.card-form.btn-submit' })}</Button>
            </FixedFooterToolbar>

        </Form>
    );
}

export default connect(
    ({
        WorksAdd,
        loading,
    }:{
        WorksAdd: StateType,
        loading: {
            effects: {
                [key:string]: boolean;
            }
        };
    }) => ({
        state: WorksAdd,
        createFormSubmitLoading: loading.effects['WorksAdd/create'],
    })
)(WorksAddPage);