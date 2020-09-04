import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { Drawer, Table, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';

import SearchListTypeTag from "@/components/SearchListTypeTag";
import { TableListItem, GetListParams, PaginationConfig } from './data.d';
import { queryList } from './service';


interface SearchListDrawerProps {
    drawerVisible: boolean;
    onClose: () => void;
    drawerTitle?: string;
    columnsAfter?: ColumnsType<TableListItem>;
}

const SearchListDrawer: React.FC<SearchListDrawerProps> = (props) => {

    const intl = useIntl();

    const { drawerVisible, onClose, drawerTitle = intl.formatMessage({id: 'components.searchlistdrawer.title'}), columnsAfter } = props;

    const [searchVal, setSearchVal] = useState<string>('');
    const [dataList, setDataList] = useState<TableListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const iniPagination: PaginationConfig = {
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: false,
    };
    const [pagination, setPagination] = useState<PaginationConfig>(iniPagination);


    const getList = async (params: GetListParams) => {
        setLoading(true);
        const response = await queryList({
           per: params.pageSize,
           page: params.current,
           keywords: params.title,
        });
        const { code,  data } = response;
        if (code === 0 ) {
            setDataList(data.list || []);
            setPagination({
                ...iniPagination,
                current: params.current,
                total: data.total || 0,
            });
        }

        setLoading(false);
    }

    const searchList = (v: string): void => {
        setSearchVal(v);
        getList({
            pageSize:  iniPagination.pageSize,
            current: iniPagination.current,
            title: v,
        })
    }


    useEffect(()=> {

        if(drawerVisible) {
            getList({
                pageSize:  iniPagination.pageSize,
                current: iniPagination.current,
                title: searchVal,
            })
        }

    },[drawerVisible])



    const columns: ColumnsType<TableListItem> = [
        {
            title: intl.formatMessage({id: 'components.searchlistdrawer.table-column-number'}),
            dataIndex: 'index',
            width: 80,
            render: (_, record,index) =>(
                <>
                { (pagination.current-1) * pagination.pageSize + index + 1 }
                </>
            ),
        },
        {
            title: intl.formatMessage({id: 'components.searchlistdrawer.table-column-id'}),
            dataIndex: 'id',
        },
        {
            title: intl.formatMessage({id: 'components.searchlistdrawer.table-column-type'}),
            dataIndex: 'type',
            render: (_, record) => {
                return <SearchListTypeTag value={record.type} /> 
            },
        },
        {
            title: intl.formatMessage({id: 'components.searchlistdrawer.table-column-title'}),
            dataIndex: 'title',
        },
        {
            title: intl.formatMessage({id: 'components.searchlistdrawer.table-column-addtime'}),
            dataIndex: 'addtime',
        },
        /* {
            title: '操作',
            dataIndex: 'option',
            width: 160,
            render: (_, record) => (
                <Button type="link">选择</Button>
            )
        } */
    ];
    
    

    return (
        <Drawer
            visible={drawerVisible}
            onClose={onClose}
            title={drawerTitle}
            width="80%"
        >

            <Table
              size="small"
              rowKey= { record => `${record.id  }-${  record.type}` }
              title={()=> (
                <Input.Search placeholder={intl.formatMessage({id: 'components.searchlistdrawer.search.text-placeholder'})} onSearch={searchList}  style={{ width: 300 }} />
              )}
              columns={[
                  ...columns,
                  ...(columnsAfter || [])
              ]}
              dataSource={dataList}
              loading={loading}
              pagination={pagination}
              onChange={(v) => {
                    getList({
                        pageSize: v.pageSize || iniPagination.pageSize,
                        current: v.current || iniPagination.current,
                        title: searchVal,
                    })
              }}
            />

        </Drawer>
    );



}

export default SearchListDrawer;