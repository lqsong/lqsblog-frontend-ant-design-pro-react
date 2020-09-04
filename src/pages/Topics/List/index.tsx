import React, { useRef, useState }  from 'react';
import { Link, getLocale, useIntl } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, Modal, message } from 'antd';
import { TableListItem } from './data.d';
import { queryList, removeList } from './service';


const TableList: React.FC<{}> = () => {

  const [removeLoading,handleRemoveLoading] = useState<number[]>([])

  const locale = getLocale();
  const intl = useIntl();
  const intlMap = {
    'zh-CN': zhCNIntl,
    'zh-TW': zhTWIntl,
    'en-US': enUSIntl,
  };
  const actionRef = useRef<ActionType>();


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
      title: intl.formatMessage({id: 'app.topicslist.table-column-number'}),
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
      title: intl.formatMessage({id: 'app.topicslist.table-column-title'}),
      dataIndex: 'title',
    },
    {
      title: intl.formatMessage({id: 'app.topicslist.table-column-alias'}),
      dataIndex: 'alias',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'app.topicslist.table-column-addtime'}),
      dataIndex: 'addtime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'app.topicslist.table-column-oper'}),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Link to={`/topics/edit-${record.id}`}>
            <Button type="link">{intl.formatMessage({id: 'app.topicslist.btn-edit'})}</Button>
          </Link>
          <Button type="link" loading={removeLoading.includes(record.id)} onClick={()=> {
            Modal.confirm({
              title: intl.formatMessage({id: 'app.global.modal.title.prompt'}),
              content: intl.formatMessage({id: 'app.global.modal.confirm.content-del'}),
              okText: intl.formatMessage({id: 'app.global.modal.confirm.oktext-confirm'}),
              cancelText: intl.formatMessage({id: 'app.global.modal.confirm.cancelText-cancel'}),
              onOk: () => handleRemove(record) ,
            });
          }} >{intl.formatMessage({id: 'app.topicslist.btn-del'})}</Button>
        </>
      ),
    },
  ];


  return (
    <PageHeaderWrapper title={false}>
      <IntlProvider value={intlMap[locale]}>
        <ProTable<TableListItem>
            headerTitle= {intl.formatMessage({id: 'app.topicslist.table-title'})}
            actionRef={actionRef}
            rowKey="id"
            toolBarRender={() => [
              <Link to="/topics/add">
                <Button type="primary">
                  <PlusOutlined /> {intl.formatMessage({id: 'app.topicslist.btn-add'})}
                </Button>
              </Link>
            ]}
            request={async (params: any/* , sorter, filter */) => {
              const response = await queryList({
                 per: params.pageSize || 20,
                 page: params.current || 1,
                 keywords: params.title || '',
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
  </PageHeaderWrapper>
  );
};

export default TableList;
