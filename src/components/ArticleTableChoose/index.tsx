import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useIntl } from 'umi';
import { ColumnsType } from 'antd/es/table';
import { Table, Button, message } from 'antd';
import ArticleListDrawer from '@/components/ArticleListDrawer';
import { TableListItem as DrawerTableListItem } from '@/components/ArticleListDrawer/data.d';
import { TableListItem } from './data.d';


interface ArticleTableChooseProps {
    value: TableListItem[];
    onChange?: (value: TableListItem[]) => void;
    chooseLimit?: number;
    drawerVisible: boolean;
    drawerOnClose: () => void;
}

const ArticleTableChoose = React.forwardRef<any, ArticleTableChooseProps>((props, ref) => {

    const intl = useIntl();

    const { value, onChange, chooseLimit = 10, drawerVisible, drawerOnClose } = props

    const [dataListIds, setDataListIds] = useState<number[]>([]);
    const [dataList, setDataList] = useState<TableListItem[]>(value);

    const setValue = (list: TableListItem[]): void => {
        setDataList(list);
        if(onChange) {
            onChange(list);
        }
    }

    const drawerChoose = (row: DrawerTableListItem): void => {
        if (dataList.length >= chooseLimit) {
            message.warning(intl.formatMessage({id: 'components.articletablechoose.drawer.choose-limit-tip'},{num: chooseLimit}));
            return ;
        }
        const list: TableListItem[] = [
            ...dataList,
            row,
        ];
        setValue(list);
    }

    const removeDataItem = (index: number): void => {
        dataList.splice(index, 1);
        const list: TableListItem[] = [
            ...dataList,
        ];
        setValue(list);
    }

    const columns: ColumnsType<TableListItem> = [
        {
            title: intl.formatMessage({id: 'components.articletablechoose.table-column-number'}),
            dataIndex: 'index',
            width: 80,
            render: (_, record,index) =>(
                <>
                { index + 1 }
                </>
            ),
        },
        {
            title: intl.formatMessage({id: 'components.articletablechoose.table-column-id'}),
            dataIndex: 'id',
        },
        {
            title: intl.formatMessage({id: 'components.articletablechoose.table-column-title'}),
            dataIndex: 'title',
        },
        {
            title: intl.formatMessage({id: 'components.articletablechoose.table-column-addtime'}),
            dataIndex: 'addtime',
        },
        {
            title: intl.formatMessage({id: 'components.articletablechoose.table-column-option'}),
            dataIndex: 'option',
            width: 160,
            render: (_, record, index) => (
            <Button type="link" onClick={()=> removeDataItem(index)}>{intl.formatMessage({id: 'components.articletablechoose.btn-remove'})}</Button>
            )
        }
    ]

    useImperativeHandle(ref,()=> ({
        setValue,
    }))

    useEffect(()=> {
        const ids: number[] = []
        for (let index = 0, len = dataList.length; index < len; index += 1) {
            const element = dataList[index];
            ids.push(element.id);            
        }
        setDataListIds(ids);
    },[dataList])

    return (
        <div>
            <Table<TableListItem>
                rowKey="id"
                columns={columns}
                dataSource={dataList}
                pagination={false}
            />
            <ArticleListDrawer columnsAfter={[
                {
                    title: intl.formatMessage({id: 'components.articletablechoose.drawer.table-column-option'}),
                    dataIndex: 'option',
                    width: 160,
                    render: (_, record) => (
                    <Button type="link" onClick={()=> drawerChoose(record)} disabled={dataListIds.includes(record.id)}>{intl.formatMessage({id: 'components.articletablechoose.drawer.btn-choose'})}</Button>
                    )
                }
            ]} drawerVisible={drawerVisible} onClose={drawerOnClose} />
        </div>
    );
})

export default ArticleTableChoose;