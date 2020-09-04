import React, { useState, useRef }  from 'react';
import { getLocale, useIntl } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import LinksCategorySelect from '@/components/LinksCategorySelect';
import { TableListItem , FormValueType } from './data.d';
import { queryList, detailList, removeList } from './service';

import CreateForm from './components/CreateForm';
import UpdateForm from "./components/UpdateForm";



const TableList: React.FC<{}> = () => {

  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateModalValId, setupdateModalValId] = useState<number>(0);
  const [updateModalValue, setUpdateModalValue] = useState<Partial<FormValueType>>({});
  const [updateBtnLoading, setUpdateBtnLoading] = useState<number[]>([]);
  const [removeLoading,handleRemoveLoading] = useState<number[]>([])

  const locale = getLocale();
  const intl = useIntl();
  const intlMap = {
    'zh-CN': zhCNIntl,
    'zh-TW': zhTWIntl,
    'en-US': enUSIntl,
  };

  const actionRef = useRef<ActionType>();

  const updateModalShow = async (row: TableListItem) => {

    setUpdateBtnLoading([row.id]);

    try {
      const res = await detailList(row.id)
      const { code, data } = res;
      if( code === 0 ) {
        handleUpdateModalVisible(true);
        setupdateModalValId(row.id);     
        setUpdateModalValue({
          title:data.title,
          categoryId: data.category.id,
          href: data.href,
          description:  data.description,
          logo: data.logo,
          category: data.category
        });
      }
      setUpdateBtnLoading([]);
    } catch (error) {
      message.error(error);
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


  const columns: ProColumns<TableListItem>[] = [
    {
      title: intl.formatMessage({id: 'app.links.list.table-column-number'}),
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
      title: intl.formatMessage({id: 'app.links.list.table-column-title'}),
      dataIndex: 'title',
    },
    {
      title: intl.formatMessage({id: 'app.links.list.table-column-category'}),
      hideInSearch: true,
      render: (_, record) => (
        <>
         {record.category.name}
        </>
      ),
    },
    
    {
      title: intl.formatMessage({id: 'app.links.list.table-column-oper'}),
      dataIndex: 'option',
      valueType: 'option',
      width: 160,
      render: (_, record) => (
        <>
          <Button type="link" onClick={()=> updateModalShow(record)} loading={updateBtnLoading.includes(record.id)}>{intl.formatMessage({id: 'app.links.list.btn-edit'})}</Button>
          <Button type="link" loading={removeLoading.includes(record.id)} onClick={()=> {
            Modal.confirm({
              title: intl.formatMessage({id: 'app.global.modal.title.prompt'}),
              content: intl.formatMessage({id: 'app.global.modal.confirm.content-del'}),
              okText: intl.formatMessage({id: 'app.global.modal.confirm.oktext-confirm'}),
              cancelText: intl.formatMessage({id: 'app.global.modal.confirm.cancelText-cancel'}),
              onOk: () => handleRemove(record) ,
            });
          }} >{intl.formatMessage({id: 'app.links.list.btn-del'})}</Button>
        </>
      ),
    },
    /* 以下独立设置的搜索 */
    {
      title: intl.formatMessage({id: 'app.links.list.table-column-category'}),
      dataIndex: 'category',
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }) => {
      
        return <LinksCategorySelect {...rest} placeholder={intl.formatMessage({id: 'app.global.text.choose'})} />;
      },
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
                <PlusOutlined /> {intl.formatMessage({id: 'app.links.list.btn-add'})}
              </Button>
          ]}
          request={async (params: any/* , sorter, filter */) => {
              const response = await queryList({
                 per: params.pageSize || 20,
                 page: params.current || 1,
                 keywords: params.title || '',
                 categoryid: params.category,
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


      <CreateForm
        onCancel={() => handleCreateModalVisible(false)}
        modalVisible={createModalVisible}  
        onSuccess={()=> actionRef.current?.reloadAndRest()}
      />

      
      {updateModalValue && Object.keys(updateModalValue).length?(
        <UpdateForm 
          onCancel={()=> {
            handleUpdateModalVisible(false)
            setupdateModalValId(0);
            setUpdateModalValue({})
          }}
          modalVisible={updateModalVisible}
          onSuccess={()=> actionRef.current?.reloadAndRest()}
          values={updateModalValue}
          valId={updateModalValId}
        />
      ):null}

    </PageHeaderWrapper>
  );
}

export default TableList;

