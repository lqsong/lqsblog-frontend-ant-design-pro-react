import React, { useRef } from 'react';
import { connect, useIntl, Dispatch, history } from 'umi';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { Form , Card, Row, Col, message, Modal, Button, Input, DatePicker } from 'antd';

import ArticleCategoryCascader from '@/components/ArticleCategoryCascader';
import TagSelect from '@/components/TagSelect';
import ServerImageSelectionList from '@/components/ServerImage/SelectionList';
import TuiEditor from '@/components/TuiEditor';
import ArticleTableChoose from '@/components/ArticleTableChoose';
import { TableListItem } from '@/components/ArticleTableChoose/data.d';
import FixedFooterToolbar from '@/components/FixedFooterToolbar';
import { StateType } from './model';
import { FormValueType } from './data.d';


interface ArticleAddPageProps {
    state: StateType;
    dispatch: Dispatch;
    createFormSubmitLoading: boolean;
}

const ArticleAddPage: React.FC<ArticleAddPageProps> = ({state, dispatch, createFormSubmitLoading }) => {

    const intl = useIntl();
    const serverImgListRef = useRef<any>();
    const editorRef = useRef<any>();
    const articleTableChoosef = useRef<any>();

    const { serverImageList, editorValue, tableData, tableDataIds,  tableDrawerVisible } = state;

    const handleServerImageList = (v: string[]): void => {
        dispatch({
            type: 'ArticleAdd/setServerImageList',
            payload: v,
        })
    }

    const setEditorValue = (v: string): void => {
        dispatch({
            type: 'ArticleAdd/setEditorValue',
            payload: v,
        });
    }

    const setTableData = (v: TableListItem[]): void => {
        dispatch({
            type: 'ArticleAdd/setTableData',
            payload: v,
        });
    }

    const setTableDrawerVisible = (v: boolean): void => {
        dispatch({
            type: 'ArticleAdd/setTableDrawerVisible',
            payload: v,
        });
    }



    const [form] = Form.useForm();

    const onFinish = async () => {
        try {
            const fieldsValue = await form.validateFields();
            /* const formValue = {
                ...fieldsValue,
                'addtime': fieldsValue.addtime.format('YYYY-MM-DD HH:mm:ss'),
            }; */

            const categoryLen: number = fieldsValue.category.length;

            const formValue: FormValueType = {
                title: fieldsValue.title,
                keywords: fieldsValue.keywords,
                description: fieldsValue.description,
                addtime: fieldsValue.addtime.format('YYYY-MM-DD HH:mm:ss'),
                categoryId: categoryLen > 0 ? fieldsValue.category[categoryLen-1] : 0,
                categoryIds: fieldsValue.category.join(','),
                tag: fieldsValue.tag ? fieldsValue.tag.join(',') : '',
                thumb: serverImageList.join('|'),
                content: editorValue,
                interestIds: tableDataIds.join(','),
            } 
            const res: boolean = await dispatch({
                type: 'ArticleAdd/create',
                payload: formValue,
            });

            if (res) {
                Modal.confirm({
                content: <><CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize: '22px', marginRight: '10px'}} /><span>{intl.formatMessage({ id: 'app.articleadd.card-form.submit-confirm.content' })}</span></>,
                    cancelText: intl.formatMessage({ id: 'app.articleadd.card-form.submit-confirm.btn-cancel' }),
                    okText: intl.formatMessage({ id: 'app.articleadd.card-form.submit-confirm.btn-ok' }),
                    onOk:() => {
                        form.resetFields();
                        serverImgListRef.current.setListValue([]);
                        editorRef.current.setValue('');
                        articleTableChoosef.current.setValue([]);                        
                    },
                    onCancel: () => {
                        history.push('/article/list');
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
            name="articleaddform"
            layout="vertical"
        >
            <PageHeaderWrapper title={false}>
                <Card title={intl.formatMessage({ id: 'app.articleadd.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-title' })}
                                name="title"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-title-placeholder' }) },
                                    { min: 5, max: 100, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-title-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-title-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-category' })}
                                name="category"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-category-placeholder' }) }]}
                            >
                                <ArticleCategoryCascader placeholder={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-category-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-addtime' })}
                                name="addtime"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-addtime-placeholder' }) }]}
                            >
                                <DatePicker showTime  style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-keywords-placeholder' }) },
                                    { min: 2, max: 50, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-keywords-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-description-placeholder' }) },
                                    { min: 10, max: 200, message: intl.formatMessage({ id: 'app.articleadd.card-form.form-item-description-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-tag' })}
                                name="tag"
                            >
                                <TagSelect mode="multiple" placeholder={intl.formatMessage({ id: 'app.articleadd.card-form.form-item-tag-placeholder' })}  />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card
                    title={<><span>{intl.formatMessage({ id: 'app.articleadd.card-title-thumb' })}</span><span className="color-e6a23c margin-l10">{intl.formatMessage({ id: 'app.articleadd.card-title-thumb-tips' })}</span></>} 
                    bordered={false}
                    className="margin-b24"
                 >
                      <ServerImageSelectionList ref={serverImgListRef} defaultValue={serverImageList} setValue={handleServerImageList} limit={4} />
                </Card>
                <Card title={intl.formatMessage({ id: 'app.articleadd.card-title-content' })} bordered={false} className="margin-b24" bodyStyle={{padding: '16px'}}>
                    <TuiEditor ref={editorRef} value={editorValue} onChange={setEditorValue} />
                </Card>
                <Card 
                    title={<><span>{intl.formatMessage({ id: 'app.articleadd.card-title-rec' })}</span><span className="color-e6a23c margin-l10">{intl.formatMessage({ id: 'app.articleadd.card-title-rec-tips' })}</span></>}
                    extra={
                        <a href="#" onClick={e=> {
                            e.preventDefault();
                            setTableDrawerVisible(true);
                        }}>{intl.formatMessage({ id: 'app.articleadd.card-form.btn-add-rec' })}</a>
                    }
                    bordered={false}
                    className="margin-b24"
                >
                    <ArticleTableChoose ref={articleTableChoosef} value={tableData} onChange={setTableData} drawerVisible={tableDrawerVisible} drawerOnClose={()=> setTableDrawerVisible(false)} />
                </Card>


            </PageHeaderWrapper>
            <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={createFormSubmitLoading}>{intl.formatMessage({ id: 'app.articleadd.card-form.btn-submit' })}</Button>
            </FixedFooterToolbar>
        </Form>
    );
}

export default connect(
    ({
        ArticleAdd,
        loading,
    }:{
        ArticleAdd: StateType,
        loading: {
            effects: {
                [key:string]: boolean;
            }
        }
    }) => ({
        state: ArticleAdd,
        createFormSubmitLoading: loading.effects['ArticleAdd/create'],
    })
)(ArticleAddPage);