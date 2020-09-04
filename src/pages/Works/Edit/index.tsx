import React, { useRef, useEffect, useState } from 'react';
import { connect, useIntl, Dispatch, history, useRouteMatch} from "umi";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form , Card, Row, Col, message, Button, Input, DatePicker, Result, Spin  } from 'antd';

import TagSelect from '@/components/TagSelect';
import ServerImageSelectionList from '@/components/ServerImage/SelectionList';
import TuiEditor from '@/components/TuiEditor';
import FixedFooterToolbar from '@/components/FixedFooterToolbar';

import { StateType } from "./model";
import { FormValueParamsType } from './data.d';

interface WorksEditPageProps {
    state: StateType;
    dispatch: Dispatch;
    updateFormSubmitLoading: boolean;
}

const WorksEditPage: React.FC<WorksEditPageProps> = ({ state, dispatch, updateFormSubmitLoading }) => {

    const intl = useIntl();
    const serverImgListRef = useRef<any>();
    const editorRef = useRef<any>();

    const { serverImageList, editorValue, detailData } = state;

    const [detailLoading, setDetailLoading] = useState<boolean>(true);

    const [form] = Form.useForm();

    const { params } = useRouteMatch<{id: string}>();
    const id = params.id ? parseInt(params.id,10) : 0;
    if (id < 1 || Number.isNaN(id)) {
        history.push('/');
        // return null;
    }

    const handleServerImageList = (v: string[]): void => {
        dispatch({
            type: 'WorksEdit/setServerImageList',
            payload: v,
        })
    }

    const setEditorValue = (v: string): void => {
        dispatch({
            type: 'WorksEdit/setEditorValue',
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
                tag: fieldsValue.tag ? fieldsValue.tag.join(',') : '',
                thumb: serverImageList.join('|'),
                content: editorValue,
            } 
            const res: boolean = await dispatch({
                type: 'WorksEdit/update',
                payload: {
                    id,
                    ...formValue
                },
            });

            if (res) {
                message.success(intl.formatMessage({ id: 'app.worksedit.card-form.submit-success.content' }),3,()=> {
                    history.push('/works/list');
                });
            }

        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }




    useEffect(() => {
        const init = async () => {

            await dispatch({
                type: 'WorksEdit/detail',
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
            name="workseditform"
            layout="vertical"
            initialValues={detailData}
        >
            <PageHeaderWrapper title={false}>
                <Card title={intl.formatMessage({ id: 'app.worksedit.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-title' })}
                                name="title"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.worksedit.card-form.form-item-title-placeholder' }) },
                                    { min: 5, max: 100, message: intl.formatMessage({ id: 'app.worksedit.card-form.form-item-title-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-title-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-addtime' })}
                                name="addtime"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.worksedit.card-form.form-item-addtime-placeholder' }) }]}
                            >
                                <DatePicker showTime  style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.worksedit.card-form.form-item-keywords-placeholder' }) },
                                    { min: 2, max: 50, message: intl.formatMessage({ id: 'app.worksedit.card-form.form-item-keywords-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.worksedit.card-form.form-item-description-placeholder' }) },
                                    { min: 10, max: 200, message: intl.formatMessage({ id: 'app.worksedit.card-form.form-item-description-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-tag' })}
                                name="tag"
                            >
                                <TagSelect mode="multiple" placeholder={intl.formatMessage({ id: 'app.worksedit.card-form.form-item-tag-placeholder' })}  />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card
                    title={<><span>{intl.formatMessage({ id: 'app.worksedit.card-title-thumb' })}</span><span className="color-e6a23c margin-l10">{intl.formatMessage({ id: 'app.worksedit.card-title-thumb-tips' })}</span></>} 
                    bordered={false}
                    className="margin-b24"
                 >
                      <ServerImageSelectionList ref={serverImgListRef} defaultValue={serverImageList} setValue={handleServerImageList} limit={4} />
                </Card>


                <Card title={intl.formatMessage({ id: 'app.worksedit.card-title-content' })} bordered={false} className="margin-b24" bodyStyle={{padding: '16px'}}>
                    <TuiEditor ref={editorRef} value={editorValue} onChange={setEditorValue} />
                </Card>




            </PageHeaderWrapper>
            <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={updateFormSubmitLoading}>{intl.formatMessage({ id: 'app.worksedit.card-form.btn-submit' })}</Button>
            </FixedFooterToolbar>
        </Form>
    );

}


export default connect(
    ({
        WorksEdit,
        loading,
    }:{
        WorksEdit: StateType;
        loading: {
            effects: {
                [key:string]: boolean;
            }
        }
    }) => ({
        state: WorksEdit,
        updateFormSubmitLoading: loading.effects['WorksEdit/update']
    })
)(WorksEditPage);