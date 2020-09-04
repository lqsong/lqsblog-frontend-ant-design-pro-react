import React, { useState, useRef }  from 'react';
import { getLocale, useIntl } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { ResponseData } from '@/utils/request';
import { FormInstance } from 'antd/lib/form';
import { TableListItem , FormValueType } from './data.d';
import { queryList, addList, updateList, removeList } from './service';

import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";

const TableList: React.FC<{}> = () => {

    const intl = useIntl();
    const actionRef = useRef<ActionType>();

    const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
    const [createModalSubmitLoading, handleCreateModalSubmitLoading] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const [updateModalValue, setUpdateModalValue] = useState<Partial<TableListItem>>({});
    const [updateModalSubmitLoading, setUpdateModalSubmitLoading] = useState<boolean>(false);
    const [removeLoading,handleRemoveLoading] = useState<number[]>([])

    const onSubmitCreateModal = async (values: FormValueType, form: FormInstance) => {
      handleCreateModalSubmitLoading(true);
      const response: ResponseData =  await addList(values);
      const { code } = response;
      handleCreateModalSubmitLoading(false);
      if (code === 0 ) {    
          form.resetFields();  
          handleCreateModalVisible(false);        
          message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
          actionRef.current?.reloadAndRest();
      }
  }

    const handleUpdateModalShow = (row: TableListItem): void => {
      setUpdateModalValue(row);
      handleUpdateModalVisible(true);
    }

    const handleUpdateModalOnCancel = (): void => {
        handleUpdateModalVisible(false);
        setUpdateModalValue({});
    }

    const onSubmitUpdateModal = async (values: FormValueType/* , form: FormInstance */)  => {
        setUpdateModalSubmitLoading(true);
        const { id, ...params } = values;
        const response: ResponseData = await updateList(id || 0, { ...params });
        const { code } = response;
        setUpdateModalSubmitLoading(false);
        if (code === 0 ) {
            // form.resetFields();
            handleUpdateModalOnCancel();          
            message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
            actionRef.current?.reloadAndRest();
        }
    }    
  

    const handleRemove = async (row:TableListItem) => {
      try {
        handleRemoveLoading([row.id]);
        const res = await removeList(row.id);
        const { code } = res;
        if ( code === 0) {
          message.success(intl.formatMessage({id: 'app.global.message.success.del'}));
          actionRef.current?.reload();
        } else {
          message.error(intl.formatMessage({id: 'app.global.message.error.del'}));
        }
        handleRemoveLoading([])
        return true
      } catch (e) {
        message.error(intl.formatMessage({id: 'app.global.message.error.del'}));
        return false;
      }
    };







    const locale = getLocale();
    const intlMap = {
      'zh-CN': zhCNIntl,
      'zh-TW': zhTWIntl,
      'en-US': enUSIntl,
    };


    const columns: ProColumns<TableListItem>[] = [
      {
        title: intl.formatMessage({id: 'app.settingaccountlist.table-column-number'}),
        dataIndex: 'index',
        valueType: 'index',
        width: 80,
        render: (_, record,index, action) => {
          return (
            <>
            { (action.current-1) * action.pageSize + index + 1 }
            </>
          )
        },
      },
      {
        title: intl.formatMessage({id: 'app.settingaccountlist.table-column-nickname'}),
        hideInSearch: true,
        dataIndex: 'nickname',
      },
      {
        title: intl.formatMessage({id: 'app.settingaccountlist.table-column-username'}),
        hideInSearch: true,
        render: (_, record) => (
          <>
          {record.username}
          </>
        ),
      },
      {
        title: intl.formatMessage({id: 'app.settingaccountlist.table-column-roles'}),
        hideInSearch: true,
        render: (_, record) => {
            const {roles} = record;
            const nameArr: string[] = [];
            for (let index = 0, len= roles.length; index < len; index+=1) {
              const element = roles[index];
              nameArr.push(element.name);
            }

            return (<>{nameArr.join('，')}</>)
        },
      },
      {
        title: intl.formatMessage({id: 'app.settingaccountlist.table-column-oper'}),
        dataIndex: 'option',
        valueType: 'option',
        width: 160,
        render: (_, record) => (
          <>
            <Button type="link" onClick={()=> handleUpdateModalShow(record)} >{intl.formatMessage({id: 'app.settingaccountlist.btn-edit'})}</Button>
            <Button type="link" loading={removeLoading.includes(record.id)} onClick={()=> {
              Modal.confirm({
                title: intl.formatMessage({id: 'app.global.modal.title.prompt'}),
                content: intl.formatMessage({id: 'app.global.modal.confirm.content-del'}),
                okText: intl.formatMessage({id: 'app.global.modal.confirm.oktext-confirm'}),
                cancelText: intl.formatMessage({id: 'app.global.modal.confirm.cancelText-cancel'}),
                onOk: () => handleRemove(record) ,
              });
            }} >{intl.formatMessage({id: 'app.settingaccountlist.btn-del'})}</Button>
          </>
        ),
      },

    /* 以下独立设置的搜索 */
    {
      title: intl.formatMessage({id: 'app.settingaccountlist.table-column-keywords'}),
      dataIndex: 'keywords',
      hideInTable: true
    },


      
    ];


    return (
      <PageHeaderWrapper title={false}>
        <IntlProvider value={intlMap[locale]}>
          <ProTable<TableListItem> 
            actionRef={actionRef}
            rowKey="id"
            toolBarRender={() => [
                <Button type="primary"  onClick={() => handleCreateModalVisible(true)}>
                  <PlusOutlined /> {intl.formatMessage({id: 'app.settingaccountlist.btn-add'})}
                </Button>
            ]}
            request={async (params: any/* , sorter, filter */) => {
                const response = await queryList({
                  per: params.pageSize || 20,
                  page: params.current || 1,
                  keywords: params.keywords || '',
                });
                const { data } = response;
                return {
                  success: true,
                  total: data.total || 0,
                  page: data.currentPage || 1,
                  data: data.list || []
                };
            }}
            columns={columns}
            pagination={{
              pageSizeOptions: ['20', '50', '100']
            }}
          />
        </IntlProvider>

        
        {createModalVisible ? (
          <CreateForm
            onCancel={() => handleCreateModalVisible(false)}
            modalVisible={createModalVisible}  
            onSubmitLoading={createModalSubmitLoading}
            onSubmit={onSubmitCreateModal}
          />
        ):null}

        {updateModalValue && Object.keys(updateModalValue).length ? (
            <UpdateForm modalVisible={updateModalVisible} onCancel={handleUpdateModalOnCancel} onSubmit={onSubmitUpdateModal} onSubmitLoading={updateModalSubmitLoading} values={updateModalValue} />
        ):null}
      

      </PageHeaderWrapper>
    );




}



export default TableList;







