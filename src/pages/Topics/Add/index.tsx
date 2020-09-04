import React, { useRef } from "react";
import { connect, useIntl, Dispatch, history } from 'umi';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { Form , Card, Row, Col, message, Modal, Button, Input, DatePicker } from 'antd';
import SearchTableChoose from "@/components/SearchTableChoose";
import FixedFooterToolbar from '@/components/FixedFooterToolbar';

import { StateType } from "./model";
import { TopicsContent, FormValueParamsType } from "./data.d";


interface TopicsAddPageProps {
    state: StateType;
    dispatch: Dispatch;
    createFormSubmitLoading: boolean;
}

const TopicsAddPage: React.FC<TopicsAddPageProps> = ({ state, dispatch, createFormSubmitLoading}) => {


    const intl = useIntl();
    const searchTableChoosef = useRef<any>();

    const {  tableData, tableDrawerVisible } = state;

    
    const setTableData = (v: TopicsContent[]): void => {
        dispatch({
            type: 'TopicsAdd/setTableData',
            payload: v,
        });
    }

    const setTableDrawerVisible = (v: boolean): void => {
        dispatch({
            type: 'TopicsAdd/setTableDrawerVisible',
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
                alias: fieldsValue.alias,
                content: tableData,
            } 
            const res: boolean = await dispatch({
                type: 'TopicsAdd/create',
                payload: formValue,
            });

            if (res) {
                Modal.confirm({
                content: <><CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize: '22px', marginRight: '10px'}} /><span>{intl.formatMessage({ id: 'app.topicsadd.card-form.submit-confirm.content' })}</span></>,
                    cancelText: intl.formatMessage({ id: 'app.topicsadd.card-form.submit-confirm.btn-cancel' }),
                    okText: intl.formatMessage({ id: 'app.topicsadd.card-form.submit-confirm.btn-ok' }),
                    onOk:() => {
                        form.resetFields();
                        searchTableChoosef.current.setValue([]);                        
                    },
                    onCancel: () => {
                        history.push('/topics/list');
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
            name="topicsaddform"
            layout="vertical"
        >
            <PageHeaderWrapper title={false}>

                <Card title={intl.formatMessage({ id: 'app.topicsadd.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-title' })}
                                name="title"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-title-placeholder' }) },
                                    { min: 5, max: 100, message: intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-title-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-title-placeholder' })} />
                            </Form.Item>
                        </Col>

                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-alias' })}
                                name="alias"
                                rules={[
                                    {
                                        required: true,
                                        validator: async (rule, value) => {
                                            if (value === '' || !value) {
                                                throw new Error(intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-alias-placeholder' }));
                                            } else if (!/^[a-z0-9]+$/.test(value)) {
                                                throw new Error(intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-alias-reg' }));
                                            } else if (value.length > 10) {
                                                throw new Error(intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-alias-max' }));
                                            }
                                        }
                                    }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-alias-placeholder' })} />
                            </Form.Item>
                        </Col>
                        
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-addtime' })}
                                name="addtime"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-addtime-placeholder' }) }]}
                            >
                                <DatePicker showTime  style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-keywords-placeholder' }) },
                                    { min: 2, max: 50, message: intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-keywords-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-description-placeholder' }) },
                                    { min: 10, max: 200, message: intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-description-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsadd.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col>                        
                    </Row>
                </Card>


                <Card 
                    title={<><span>{intl.formatMessage({ id: 'app.topicsadd.card-title-rec' })}</span></>}
                    extra={
                        <a href="#" onClick={e=> {
                            e.preventDefault();
                            setTableDrawerVisible(true);
                        }}>{intl.formatMessage({ id: 'app.topicsadd.card-form.btn-add-rec' })}</a>
                    }
                    bordered={false}
                    className="margin-b24"
                >
                    <SearchTableChoose ref={searchTableChoosef} value={tableData} onChange={setTableData} drawerVisible={tableDrawerVisible} drawerOnClose={()=> setTableDrawerVisible(false)} />
                </Card>
                

            </PageHeaderWrapper>
            <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={createFormSubmitLoading}>{intl.formatMessage({ id: 'app.topicsadd.card-form.btn-submit' })}</Button>
            </FixedFooterToolbar>
        </Form>
    );
}


export default connect(
    ({
        TopicsAdd,
        loading,
    }:{
        TopicsAdd: StateType;
        loading: {
            effects: {
                [key:string]: boolean;
            }
        }
    }) => ({
        state: TopicsAdd,
        createFormSubmitLoading: loading.effects['TopicsAdd/create']
    })
)(TopicsAddPage);