import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { Card, Table } from 'antd';

import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import styles from '../../style.less';

import { TableListItem, PaginationConfig } from './data';
import { queryList } from './service';


interface HotTagsCardProps {

}

const HotTagsCard: React.FC<HotTagsCardProps> = () => {

    const intl = useIntl();    

    const iniPagination: PaginationConfig = {
        total: 0,
        current: 1,
        pageSize: 5,
        showSizeChanger: false,
    };
    const [dataList, setDataList] = useState<TableListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationConfig>(iniPagination);
    

    const getList = async (current: number) => {
        setLoading(true);
        const response = await queryList({
           per: iniPagination.pageSize,
           page: current,
           sort: 1,
        });
        const { code,  data } = response;
        if (code === 0 ) {
            setDataList(data.list || []);
            setPagination({
                ...iniPagination,
                current,
                total: data.total || 0,
            });
        }

        setLoading(false);
    }
    



    const TableOnChange = (p: TablePaginationConfig) => {
        getList(p.current || 1);
    }


    useEffect(()=> {
        getList(1)
    },[1])




    const columns: ColumnsType<TableListItem> = [
        {
            title: intl.formatMessage({id: 'app.home.hottagscard.card.table-column-number'}),
            dataIndex: 'index',
            width: 80,
            render: (_, record,index) =>(
                <>
                { (pagination.current-1) * pagination.pageSize + index + 1 }
                </>
            ),
        },
        {
            title: intl.formatMessage({id: 'app.home.hottagscard.card.table-column-name'}),
            dataIndex: 'name',
        },
        {
            title: intl.formatMessage({id: 'app.home.hottagscard.card.table-column-hit'}),
            dataIndex: 'hit',
        },
    ];

    return (
        <Card className={styles.homeBoxCard} title={intl.formatMessage({id: 'app.home.hottagscard.card-title'})}>
            <Table
              size="small"
              rowKey="id"
              columns={columns}
              dataSource={dataList}
              loading={loading}
              pagination={pagination}
              onChange={TableOnChange}
            />
        </Card>
    );
}

export default HotTagsCard;