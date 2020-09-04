import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Table , Button, message, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FormInstance } from 'antd/lib/form';

import { ResponseData } from '@/utils/request';
import { TableListItem, FormValueType } from './data.d';
import { StateType } from './model';

import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";


interface TableListProps {
    state: StateType;
    dispatch: Dispatch;
    tableLoading: boolean;
    createFormSubmitLoading: boolean;
    updateFormSubmitLoading: boolean;
}

const TableList:React.FC<TableListProps> = ({state, dispatch, tableLoading, createFormSubmitLoading, updateFormSubmitLoading}) => {

    const intl = useIntl();

    const { list, createFormVisible, updateFormVisible, detail } = state;

    const [removeLoading,handleRemoveLoading] = useState<number[]>([])


    const handleCreateModalVisible = (value: boolean) : void => {
        dispatch({
            type: 'LinksCategory/setCreateFormVisible',
            payload: value,
        });
    }

    const onSubmitCreateModal = (values: FormValueType, form: FormInstance): void => {
        dispatch({
            type: 'LinksCategory/create',
            payload: values,
            callback: (response: ResponseData) => {
                const { code } = response;
                if (code === 0) {
                    handleCreateModalVisible(false);
                    form.resetFields();
                    message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
                    dispatch({ type: 'LinksCategory/fetch' });
                }
            }
        });
    }

    const handleUpdateModalVisible = (value: boolean) : void => {
        dispatch({
            type: 'LinksCategory/setUpdateFormVisible',
            payload: value,
        });
    }

    const updateModalShow = (row: TableListItem): void => {
        dispatch({
            type: 'LinksCategory/setDetail',
            payload: row,
        });
        handleUpdateModalVisible(true);
    }

    const onSubmitUpdateModal = (values: TableListItem, form: FormInstance) : void => {
        dispatch({
            type: 'LinksCategory/update',
            payload: values,
            callback: (response: ResponseData) => {
                const { code } = response;
                if (code === 0) {
                    handleUpdateModalVisible(false);
                    form.resetFields();
                    message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
                    dispatch({ type: 'LinksCategory/fetch' });
                }
            }
        });
    }

    const handleRemove = (row: TableListItem) : void => {
        handleRemoveLoading([row.id]);
        dispatch({
            type: 'LinksCategory/remove',
            payload: row.id,
            callback: (response: ResponseData) => {
                handleRemoveLoading([])
                const { code } = response;
                if (code === 0) {
                    message.success(intl.formatMessage({id: 'app.global.message.success.del'}));
                    dispatch({ type: 'LinksCategory/fetch' });
                } 
            }
        });
    }

    useEffect(() => {
        dispatch({
          type: 'LinksCategory/fetch'
        });
    }, [1]);
    
    

    const columns:ColumnsType<TableListItem> = [
        {
            title: intl.formatMessage({ id: 'app.linkscategory.list.table-column-number' }),
            dataIndex: 'index',
            width: 80,
            render: (_, record,index) =>(
                <>
                { index + 1 }
                </>
            ),
        },
        {
            title: intl.formatMessage({ id: 'app.linkscategory.list.table-column-name' }),
            dataIndex: 'name'
        },
        {
            title: intl.formatMessage({ id: 'app.linkscategory.list.table-column-alias' }),
            dataIndex: 'alias'
        },
        {
            title: intl.formatMessage({ id: 'app.linkscategory.list.table-column-sort' }),
            dataIndex: 'sort'
        },
        {
            title: intl.formatMessage({ id: 'app.linkscategory.list.table-column-oper' }),
            dataIndex: 'option',
            width: 160,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={()=> updateModalShow(record)}>{intl.formatMessage({ id: 'app.linkscategory.list.btn-edit' })}</Button>
                    <Button type="link" loading={removeLoading.includes(record.id)} onClick={()=> {
                        Modal.confirm({
                        title: intl.formatMessage({id: 'app.global.modal.title.prompt'}),
                        content: intl.formatMessage({id: 'app.global.modal.confirm.content-del'}),
                        okText: intl.formatMessage({id: 'app.global.modal.confirm.oktext-confirm'}),
                        cancelText: intl.formatMessage({id: 'app.global.modal.confirm.cancelText-cancel'}),
                        onOk: () => handleRemove(record) ,
                        });
                    }}>{intl.formatMessage({ id: 'app.linkscategory.list.btn-del' })}</Button>
                </>
            )
        }
    ];

    return(
    <PageHeaderWrapper title={false}>
        <Card bodyStyle={{padding:0}}>
            <div style={{padding: '16px 24px'}}>
                <Button type="primary" onClick={()=> handleCreateModalVisible(true)}>
                    <PlusOutlined /> {intl.formatMessage({ id: 'app.linkscategory.list.btn-add' })}
                </Button>
            </div>
            <Table<TableListItem>
                size="middle"
                rowKey="id"
                columns={columns}
                loading={tableLoading}
                dataSource={list}
                pagination={false}
            />
        </Card>
        <CreateForm modalVisible={createFormVisible} onCancel={() => handleCreateModalVisible(false) } onSubmit={onSubmitCreateModal} onSubmitLoading={createFormSubmitLoading} />
        {detail && Object.keys(detail).length ? (
            <UpdateForm modalVisible={updateFormVisible} onCancel={()=> {
                handleUpdateModalVisible(false);
                dispatch({ type: 'LinksCategory/setDetail', payload: {} });
            } } onSubmit={onSubmitUpdateModal} onSubmitLoading={updateFormSubmitLoading} values={detail} />
        ):null}
    </PageHeaderWrapper>
    )

}

export default connect(
    ({ 
        LinksCategory,
        loading
    } : {
        LinksCategory: StateType, 
        loading: { 
            effects: { 
                [key:string] : boolean 
            } 
        }
    }) => ({
        state: LinksCategory,
        tableLoading: loading.effects['LinksCategory/fetch'],
        createFormSubmitLoading: loading.effects['LinksCategory/create'],
        updateFormSubmitLoading: loading.effects['LinksCategory/update'],
    }),
)(TableList);