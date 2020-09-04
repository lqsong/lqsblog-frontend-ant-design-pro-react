import React, { useRef, useEffect, useState } from 'react';
import { connect, useIntl, Dispatch, history, useRouteMatch} from "umi";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form , Card, Row, Col, message, Button, Input, DatePicker, Result, Spin  } from 'antd';

import SearchTableChoose from "@/components/SearchTableChoose";
import FixedFooterToolbar from '@/components/FixedFooterToolbar';

import { StateType } from "./model";
import { FormValueParamsType, TopicsContent } from './data.d';

interface TopicsEditPageProps {
    state: StateType;
    dispatch: Dispatch;
    updateFormSubmitLoading: boolean;
}

const TopicsEditPage: React.FC<TopicsEditPageProps> = ({state, dispatch, updateFormSubmitLoading}) => {

    const intl = useIntl();
    const searchTableChoosef = useRef<any>();

    const {  tableData, tableDrawerVisible, detailData } = state;

    const [detailLoading, setDetailLoading] = useState<boolean>(true);

    const [form] = Form.useForm();

    const { params } = useRouteMatch<{id: string}>();
    const id = params.id ? parseInt(params.id,10) : 0;
    if (id < 1 || Number.isNaN(id)) {
        history.push('/');
        // return null;
    }


    const setTableData = (v: TopicsContent[]): void => {
        dispatch({
            type: 'TopicsEdit/setTableData',
            payload: v,
        });
    }

    const setTableDrawerVisible = (v: boolean): void => {
        dispatch({
            type: 'TopicsEdit/setTableDrawerVisible',
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
                addtime: fieldsValue.addtime.format('YYYY-MM-DD HH:mm:ss'),
                alias: fieldsValue.alias,
                content: tableData,
            } 
            const res: boolean = await dispatch({
                type: 'TopicsEdit/update',
                payload: {
                    id,
                    ...formValue
                },
            });

            if (res) {
                message.success(intl.formatMessage({ id: 'app.topicsedit.card-form.submit-success.content' }),3,()=> {
                    history.push('/topics/list');
                });
            }

        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }




    useEffect(() => {
        const init = async () => {

            await dispatch({
                type: 'TopicsEdit/detail',
                payload: id,
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
            name="topicseditform"
            layout="vertical"
            initialValues={detailData}
        >
            <PageHeaderWrapper title={false}>

                <Card title={intl.formatMessage({ id: 'app.topicsedit.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-title' })}
                                name="title"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-title-placeholder' }) },
                                    { min: 5, max: 100, message: intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-title-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-title-placeholder' })} />
                            </Form.Item>
                        </Col>

                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-alias' })}
                                name="alias"
                                rules={[
                                    {
                                        required: true,
                                        validator: async (rule, value) => {
                                            if (value === '' || !value) {
                                                throw new Error(intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-alias-placeholder' }));
                                            } else if (!/^[a-z0-9]+$/.test(value)) {
                                                throw new Error(intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-alias-reg' }));
                                            } else if (value.length > 10) {
                                                throw new Error(intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-alias-max' }));
                                            }
                                        }
                                    }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-alias-placeholder' })} />
                            </Form.Item>
                        </Col>
                        
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-addtime' })}
                                name="addtime"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-addtime-placeholder' }) }]}
                            >
                                <DatePicker showTime  style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-keywords-placeholder' }) },
                                    { min: 2, max: 50, message: intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-keywords-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-description-placeholder' }) },
                                    { min: 10, max: 200, message: intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-description-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.topicsedit.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col>                        
                    </Row>
                </Card>


                <Card 
                    title={<><span>{intl.formatMessage({ id: 'app.topicsedit.card-title-rec' })}</span></>}
                    extra={
                        <a href="#" onClick={e=> {
                            e.preventDefault();
                            setTableDrawerVisible(true);
                        }}>{intl.formatMessage({ id: 'app.topicsedit.card-form.btn-add-rec' })}</a>
                    }
                    bordered={false}
                    className="margin-b24"
                >
                    <SearchTableChoose ref={searchTableChoosef} value={tableData} onChange={setTableData} drawerVisible={tableDrawerVisible} drawerOnClose={()=> setTableDrawerVisible(false)} />
                </Card>
                


            </PageHeaderWrapper>
            <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={updateFormSubmitLoading}>{intl.formatMessage({ id: 'app.topicsedit.card-form.btn-submit' })}</Button>
            </FixedFooterToolbar>
        </Form>
    );


}

export default connect(
    ({
        TopicsEdit,
        loading,
    }:{
        TopicsEdit: StateType;
        loading: {
            effects: {
                [key:string]: boolean;
            }
        }
    }) => ({
        state: TopicsEdit,
        updateFormSubmitLoading: loading.effects['TopicsEdit/update'],
    })
)(TopicsEditPage);