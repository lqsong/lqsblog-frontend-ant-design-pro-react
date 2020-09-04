import React, { useState, useEffect } from 'react';
import { connect, Dispatch, useIntl } from "umi";
import { PlusOutlined, LoadingOutlined, PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table , Button, message, Modal } from 'antd';

import { ColumnsType } from 'antd/lib/table';
// import { FormInstance } from 'antd/lib/form';
import { TableListItem, FormValueType } from "./data.d";
import { StateType } from "./model";
import { getTreeDataItem } from "./utils";


import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';


interface MenuListPageProps {
  state: StateType;
  dispatch: Dispatch;
  createFormSubmitLoading: boolean;
  updateFormSubmitLoading: boolean;
}

const MenuListPage: React.FC<MenuListPageProps> = ({ state, dispatch, createFormSubmitLoading, updateFormSubmitLoading }) => {


    const intl = useIntl();

    const { list, createFormValues, createFormVisible, updateFormValues, updateFormVisible } = state;

    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [dataLoading, setDataLoading] = useState<number[]>([]);
    const [dataAjax, setDataAjax] = useState<number[]>([]);
    const [removeLoading, handleRemoveLoading] = useState<number[]>([])


    const handleCreateModalVisible = (value: boolean) : void => {
        dispatch({
            type: 'SettingMenuList/setCreateFormVisible',
            payload: value,
        });
    }

    const createModalShow = (pid: number, pname: string) : void => {
      dispatch({
        type: 'SettingMenuList/setCreateFormValues',
        payload: {
          name: '',
          urlcode: '',
          perms:'',
          permsLevel: '',
          type: 1,
          pid,
          pname,
        }
      });
      handleCreateModalVisible(true);
    }

    const createModalOnCancel = () : void => {
      dispatch({
        type: 'SettingMenuList/setCreateFormValues',
        payload: {}
      });
      handleCreateModalVisible(false);
    }

    const onSubmitCreateModal = async (values: FormValueType/* , form: FormInstance */) => {

      const res: boolean = await dispatch({
        type: 'SettingMenuList/create',
        payload: values,
      });
      if (res) {
          // form.resetFields();
          createModalOnCancel();
          message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
      }

    }

    const handleUpdateModalVisible = (value: boolean) :void => {
      dispatch({
        type: 'SettingMenuList/setUpdateFormVisible',
        payload: value,
      });
    }

    const updateModalShow = (row: TableListItem) : void => {
      let pname: string = '--';
      if (row.pid > 0) {
        const item: Partial<TableListItem> =  getTreeDataItem(list, row.pid);
        pname = item.name || '--';
      }

      dispatch({
        type: 'SettingMenuList/setUpdateFormValues',
        payload: {
          id: row.id,
          name: row.name,
          urlcode:  row.urlcode,
          perms: row.perms,
          permsLevel: row.permsLevel,
          type:  row.type,
          pid: row.pid,
          pname,
        },
      })
      handleUpdateModalVisible(true);
    }

    const updateModalOnCancel = () :void => {
      dispatch({
        type: 'SettingMenuList/setUpdateFormValues',
        payload: {}
      });
      handleUpdateModalVisible(false);
    }

    const onSubmitUpdateModal = async (values: TableListItem/* , form: FormInstance */) => {
        const res: boolean = await dispatch({
          type: 'SettingMenuList/update',
          payload: values,
        });
        if (res) {
          // form.resetFields();
          updateModalOnCancel();
          message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
        }

    }

    const handleRemove = async (row: TableListItem) => {
      handleRemoveLoading([row.id]);

      const res: boolean = await dispatch({
        type: 'SettingMenuList/remove',
        payload: row.id,
      });

      if(res) {
        handleRemoveLoading([])
        message.success(intl.formatMessage({id: 'app.global.message.success.del'}));
      }
      
    }



    const columns: ColumnsType<TableListItem> = [
      {
        title: intl.formatMessage({ id: 'app.settingmenulist.list.table-column-title' }),
        dataIndex: 'name'
      },
      {
        title: intl.formatMessage({ id: 'app.settingmenulist.list.table-column-urlcode' }),
        dataIndex: 'urlcode'
      },
      {
        title: intl.formatMessage({ id: 'app.settingmenulist.list.table-column-type' }),
        dataIndex: 'type',
        render: (_, record) => {
          return record.type === 1 ? <span>{intl.formatMessage({id: 'components.menulisttype.text-menu'})}</span> : <span>{intl.formatMessage({id: 'components.menulisttype.text-btn'})}</span>;
        }
      },
      {
        title: intl.formatMessage({ id: 'app.settingmenulist.list.table-column-oper' }),
        dataIndex: 'option',
        width: 260,
        render: (_, record) => <>
            <Button type="link" onClick={()=> createModalShow(record.id,record.name) }>{intl.formatMessage({ id: 'app.settingmenulist.list.btn-add-child' })}</Button>
            <Button type="link" onClick={()=> updateModalShow(record)}>{intl.formatMessage({ id: 'app.settingmenulist.list.btn-edit' })}</Button>
            <Button type="link" loading={removeLoading.includes(record.id)} onClick={()=> {
                Modal.confirm({
                    title: intl.formatMessage({id: 'app.global.modal.title.prompt'}),
                    content: intl.formatMessage({id: 'app.global.modal.confirm.content-del'}),
                    okText: intl.formatMessage({id: 'app.global.modal.confirm.oktext-confirm'}),
                    cancelText: intl.formatMessage({id: 'app.global.modal.confirm.cancelText-cancel'}),
                    onOk: () => handleRemove(record) ,
                });
            }}>{intl.formatMessage({ id: 'app.settingmenulist.list.btn-del' })}</Button>
        </>
      },
    ]
  
  
  
    useEffect(() => {
      setTableLoading(true);
      dispatch({
        type: 'SettingMenuList/query',
        payload: {
          pid: 0
        }
      }).then(() => setTableLoading(false));
    }, [1]);



    return (
      <PageHeaderWrapper title={false}>
        <Card bodyStyle={{padding:0}}>
            <div style={{padding: '16px 24px'}}>
                    <Button type="primary" onClick={()=> createModalShow(0,'--') }>
                        <PlusOutlined /> {intl.formatMessage({ id: 'app.settingmenulist.list.btn-add' })}
                    </Button>
            </div>
            <Table<TableListItem>
                    size="middle"
                    rowKey="id"
                    columns={columns}
                    dataSource={list}
                    pagination={false}
                    loading={tableLoading}
                    expandable={
                      {
                        onExpand: async (expanded, record) => {
                          // if (expanded === true && !record.children) {
                          if (expanded === true && !dataAjax.includes(record.id)) {
  
                              setDataLoading([record.id]);
  
                              const res: boolean = await dispatch({
                                type: 'SettingMenuList/query',
                                payload: {
                                  pid: record.id
                                }
                              });
  
                              if (res) {
                                const v: number[] = dataAjax;
                                v.push(record.id);
                                setDataAjax(v);
                              }
  
                              setDataLoading([])
  
                          }
  
                        },
                        expandIcon: ({ expanded, onExpand, record }) => {
  
                          if (dataLoading.includes(record.id)) {
                            return <LoadingOutlined />;
                          }                      
  
                          return expanded ?  (<MinusSquareOutlined  onClick={e => onExpand(record, e)}/>) : (<PlusSquareOutlined   onClick={e => onExpand(record, e)}/> );
  
                          
                        }                   
                      }
                    }                
              />
                
        </Card>
  
        {createFormValues && Object.keys(createFormValues).length ? (
          <CreateForm modalVisible={createFormVisible} onCancel={createModalOnCancel} values={createFormValues} onSubmitLoading={createFormSubmitLoading} onSubmit={onSubmitCreateModal} />
        ):null}
  
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm modalVisible={updateFormVisible} onCancel={updateModalOnCancel} values={updateFormValues} onSubmitLoading={updateFormSubmitLoading} onSubmit={onSubmitUpdateModal} />
        ) : null }
      
      </PageHeaderWrapper>
    )


  

}

export default connect(
  ({
    SettingMenuList,
    loading,
  } : {
    SettingMenuList: StateType;
    loading: {
      effects: {
        [key:string]: boolean;
      }
    }
  }) => ({
    state: SettingMenuList,
    createFormSubmitLoading: loading.effects['SettingMenuList/create'],
    updateFormSubmitLoading: loading.effects['SettingMenuList/update'],
  })
)(MenuListPage);
