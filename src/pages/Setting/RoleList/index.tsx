import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Table , Button, message, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
// import { FormInstance } from 'antd/lib/form';

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
            type: 'SettingRoleList/setCreateFormVisible',
            payload: value,
        });
    }

    const onSubmitCreateModal = async (values: FormValueType/* , form: FormInstance */) => {
        const res: boolean = await dispatch({
            type: 'SettingRoleList/create',
            payload: values,
        });
        if (res) {
            handleCreateModalVisible(false);
            // form.resetFields();
            message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
            dispatch({ type: 'SettingRoleList/fetch' });
        }
    }

    const handleUpdateModalVisible = (value: boolean) : void => {
        dispatch({
            type: 'SettingRoleList/setUpdateFormVisible',
            payload: value,
        });
    }

    const updateModalShow = (row: TableListItem): void => {
        dispatch({
            type: 'SettingRoleList/setDetail',
            payload: row,
        });
        handleUpdateModalVisible(true);
    }

    const onSubmitUpdateModal = async (values: TableListItem/* , form: FormInstance */)  => {
        const res: boolean = await dispatch({
            type: 'SettingRoleList/update',
            payload: values,
        });

        if (res) {
            handleUpdateModalVisible(false);
            // form.resetFields();
            message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
            dispatch({ type: 'SettingRoleList/fetch' });
        }
    }

    const handleRemove = async (row: TableListItem) => {
        handleRemoveLoading([row.id]);
        const res: boolean = await dispatch({
            type: 'SettingRoleList/remove',
            payload: row.id,
        });
        handleRemoveLoading([]);
        if (res) {
            message.success(intl.formatMessage({id: 'app.global.message.success.del'}));
            dispatch({ type: 'SettingRoleList/fetch' });
        } 
    }

    useEffect(() => {
        dispatch({
          type: 'SettingRoleList/fetch'
        });
    }, [1]);
    
    const columns:ColumnsType<TableListItem> = [
      {
          title: intl.formatMessage({ id: 'app.settingrolelist.list.table-column-number' }),
          dataIndex: 'index',
          width: 80,
          render: (_, record,index) =>(
              <>
              { index + 1 }
              </>
          ),
      },
      {
          title: intl.formatMessage({ id: 'app.settingrolelist.list.table-column-name' }),
          dataIndex: 'name'
      },
      {
          title: intl.formatMessage({ id: 'app.settingrolelist.list.table-column-description' }),
          dataIndex: 'description'
      },
      {
          title: intl.formatMessage({ id: 'app.settingrolelist.list.table-column-oper' }),
          dataIndex: 'option',
          width: 160,
          render: (_, record) => (
              <>
                  <Button type="link" onClick={()=> updateModalShow(record)}>{intl.formatMessage({ id: 'app.settingrolelist.list.btn-edit' })}</Button>
                  <Button type="link" loading={removeLoading.includes(record.id)} onClick={()=> {
                      Modal.confirm({
                      title: intl.formatMessage({id: 'app.global.modal.title.prompt'}),
                      content: intl.formatMessage({id: 'app.global.modal.confirm.content-del'}),
                      okText: intl.formatMessage({id: 'app.global.modal.confirm.oktext-confirm'}),
                      cancelText: intl.formatMessage({id: 'app.global.modal.confirm.cancelText-cancel'}),
                      onOk: () => handleRemove(record) ,
                      });
                  }}>{intl.formatMessage({ id: 'app.settingrolelist.list.btn-del' })}</Button>
              </>
          )
      }
  ];

  return(
  <PageHeaderWrapper title={false}>
      <Card bodyStyle={{padding:0}}>
          <div style={{padding: '16px 24px'}}>
              <Button type="primary" onClick={()=> handleCreateModalVisible(true)}>
                  <PlusOutlined /> {intl.formatMessage({ id: 'app.settingrolelist.list.btn-add' })}
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
      {createFormVisible?(
        <CreateForm modalVisible={createFormVisible} onCancel={() => handleCreateModalVisible(false) } onSubmit={onSubmitCreateModal} onSubmitLoading={createFormSubmitLoading} />
      ):null}
      {detail && Object.keys(detail).length ? (
          <UpdateForm modalVisible={updateFormVisible} onCancel={()=> {
              handleUpdateModalVisible(false);
              dispatch({ type: 'SettingRoleList/setDetail', payload: {} });
          } } onSubmit={onSubmitUpdateModal} onSubmitLoading={updateFormSubmitLoading} values={detail} />
      ):null}
  </PageHeaderWrapper>
  )





}

export default connect(
  ({ 
      SettingRoleList,
      loading
  } : {
      SettingRoleList: StateType, 
      loading: { 
          effects: { 
              [key:string] : boolean 
          } 
      }
  }) => ({
      state: SettingRoleList,
      tableLoading: loading.effects['SettingRoleList/fetch'],
      createFormSubmitLoading: loading.effects['SettingRoleList/create'],
      updateFormSubmitLoading: loading.effects['SettingRoleList/update'],
  }),
)(TableList);
