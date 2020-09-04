import React, { useRef, useEffect, useState } from 'react';
import { connect, useIntl, Dispatch, history, useRouteMatch} from "umi";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form , Card, Row, Col, message, Button, Input, DatePicker, Result, Spin  } from 'antd';

import ArticleCategoryCascader from '@/components/ArticleCategoryCascader';
import TagSelect from '@/components/TagSelect';
import ServerImageSelectionList from '@/components/ServerImage/SelectionList';
import TuiEditor from '@/components/TuiEditor';
import ArticleTableChoose from '@/components/ArticleTableChoose';
import { TableListItem } from '@/components/ArticleTableChoose/data.d';
import FixedFooterToolbar from '@/components/FixedFooterToolbar';
import { StateType } from "./model";
import { FormValueParamsType } from './data.d';


interface ArticleEditPageProps {
    state: StateType;
    dispatch: Dispatch;
    updateFormSubmitLoading: boolean;
}

const ArticleEditPage: React.FC<ArticleEditPageProps> = ({state, dispatch, updateFormSubmitLoading}) => {


    const intl = useIntl();
    const serverImgListRef = useRef<any>();
    const editorRef = useRef<any>();
    const articleTableChoosef = useRef<any>();

    const { serverImageList, editorValue, tableData, tableDataIds,  tableDrawerVisible, detailData } = state;

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
            type: 'ArticleEdit/setServerImageList',
            payload: v,
        })
    }

    const setEditorValue = (v: string): void => {
        dispatch({
            type: 'ArticleEdit/setEditorValue',
            payload: v,
        });
    }

    const setTableData = (v: TableListItem[]): void => {
        dispatch({
            type: 'ArticleEdit/setTableData',
            payload: v,
        });
    }

    const setTableDrawerVisible = (v: boolean): void => {
        dispatch({
            type: 'ArticleEdit/setTableDrawerVisible',
            payload: v,
        });
    }


    const onFinish = async () => {
        try {
            const fieldsValue = await form.validateFields();

            const categoryLen: number = fieldsValue.category.length;

            const formValue: FormValueParamsType = {
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
                type: 'ArticleEdit/update',
                payload: {
                    id,
                    ...formValue
                },
            });

            if (res) {
                message.success(intl.formatMessage({ id: 'app.articleedit.card-form.submit-success.content' }),3,()=> {
                    history.push('/article/list');
                });
            }

        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }




    useEffect(() => {
        const init = async () => {

            await dispatch({
                type: 'ArticleEdit/detail',
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
            name="articleeditform"
            layout="vertical"
            initialValues={detailData}
        >
            <PageHeaderWrapper title={false}>
                <Card title={intl.formatMessage({ id: 'app.articleedit.card-title-basic' })}  bordered={false} className="margin-b24">
                    <Row gutter={24}>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-title' })}
                                name="title"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-title-placeholder' }) },
                                    { min: 5, max: 100, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-title-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-title-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-category' })}
                                name="category"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-category-placeholder' }) }]}
                            >
                                <ArticleCategoryCascader placeholder={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-category-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-addtime' })}
                                name="addtime"
                                rules={[{ required: true, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-addtime-placeholder' }) }]}
                            >
                                <DatePicker showTime  style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-keywords' })}
                                name="keywords"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-keywords-placeholder' }) },
                                    { min: 2, max: 50, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-keywords-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-keywords-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-description' })}
                                name="description"
                                rules={[
                                    { required: true, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-description-placeholder' }) },
                                    { min: 10, max: 200, message: intl.formatMessage({ id: 'app.articleedit.card-form.form-item-description-minmax' }) }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-description-placeholder' })} />
                            </Form.Item>
                        </Col>
                        <Col lg={8} md={12} sm={24}>
                            <Form.Item
                                label={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-tag' })}
                                name="tag"
                            >
                                <TagSelect mode="multiple" placeholder={intl.formatMessage({ id: 'app.articleedit.card-form.form-item-tag-placeholder' })}  />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card
                    title={<><span>{intl.formatMessage({ id: 'app.articleedit.card-title-thumb' })}</span><span className="color-e6a23c margin-l10">{intl.formatMessage({ id: 'app.articleedit.card-title-thumb-tips' })}</span></>} 
                    bordered={false}
                    className="margin-b24"
                 >
                      <ServerImageSelectionList ref={serverImgListRef} defaultValue={serverImageList} setValue={handleServerImageList} limit={4} />
                </Card>


                <Card title={intl.formatMessage({ id: 'app.articleedit.card-title-content' })} bordered={false} className="margin-b24" bodyStyle={{padding: '16px'}}>
                    <TuiEditor ref={editorRef} value={editorValue} onChange={setEditorValue} />
                </Card>

                <Card 
                    title={<><span>{intl.formatMessage({ id: 'app.articleedit.card-title-rec' })}</span><span className="color-e6a23c margin-l10">{intl.formatMessage({ id: 'app.articleedit.card-title-rec-tips' })}</span></>}
                    extra={
                        <a href="#" onClick={e=> {
                            e.preventDefault();
                            setTableDrawerVisible(true);
                        }}>{intl.formatMessage({ id: 'app.articleedit.card-form.btn-add-rec' })}</a>
                    }
                    bordered={false}
                    className="margin-b24"
                >
                    <ArticleTableChoose ref={articleTableChoosef} value={tableData} onChange={setTableData} drawerVisible={tableDrawerVisible} drawerOnClose={()=> setTableDrawerVisible(false)} />
                </Card>



            </PageHeaderWrapper>
            <FixedFooterToolbar>
                <Button type="primary" onClick={() => onFinish()} loading={updateFormSubmitLoading}>{intl.formatMessage({ id: 'app.articleedit.card-form.btn-submit' })}</Button>
            </FixedFooterToolbar>
        </Form>
    );
}

export default connect(
    ({
        ArticleEdit,
        loading,
    }:{
        ArticleEdit: StateType,
        loading: {
            effects: {
                [key:string]: boolean,
            }
        }
    })=>({
        state: ArticleEdit,
        updateFormSubmitLoading: loading.effects['ArticleEdit/update'],
    })
)(ArticleEditPage);