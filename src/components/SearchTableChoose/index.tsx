import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useIntl } from 'umi';
import { ColumnsType } from 'antd/es/table';
import { Table, Button, message } from 'antd';
import SearchListTypeTag from "@/components/SearchListTypeTag";
import SearchListDrawer from "@/components/SearchListDrawer";
import { TableListItem as DrawerTableListItem } from "@/components/SearchListDrawer/data.d";
import { TableListItem } from "./data.d";



interface SearchTableChooseProps {
    value: TableListItem[];
    onChange?: (value: TableListItem[]) => void;
    chooseLimit?: number;
    drawerVisible: boolean;
    drawerOnClose: () => void;
}

const SearchTableChoose = React.forwardRef<any, SearchTableChooseProps>((props, ref) => {


    const intl = useIntl();

    const { value, onChange, chooseLimit = 1000, drawerVisible, drawerOnClose } = props

    const [dataListIdsType, setDataListIdsType] = useState<string[]>([]);
    const [dataList, setDataList] = useState<TableListItem[]>(value);

    const setValue = (list: TableListItem[]): void => {
        setDataList(list);
        if(onChange) {
            onChange(list);
        }
    }

    const drawerChoose = (row: DrawerTableListItem): void => {
        if (dataList.length >= chooseLimit) {
            message.warning(intl.formatMessage({id: 'components.searchtablechoose.drawer.choose-limit-tip'},{num: chooseLimit}));
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
            title: intl.formatMessage({id: 'components.searchtablechoose.table-column-number'}),
            dataIndex: 'index',
            width: 80,
            render: (_, record,index) =>(
                <>
                { index + 1 }
                </>
            ),
        },
        {
            title: intl.formatMessage({id: 'components.searchtablechoose.table-column-id'}),
            dataIndex: 'id',
        },
        {
            title: intl.formatMessage({id: 'components.searchtablechoose.table-column-type'}),
            dataIndex: 'type',
            render: (_, record) => {
                return <SearchListTypeTag value={record.type} />;
            },
        },
        {
            title: intl.formatMessage({id: 'components.searchtablechoose.table-column-title'}),
            dataIndex: 'title',
        },
        {
            title: intl.formatMessage({id: 'components.searchtablechoose.table-column-addtime'}),
            dataIndex: 'addtime',
        },
        {
            title: intl.formatMessage({id: 'components.searchtablechoose.table-column-option'}),
            dataIndex: 'option',
            width: 160,
            render: (_, record, index) => (
                <Button type="link" onClick={()=> removeDataItem(index)}>{intl.formatMessage({id: 'components.searchtablechoose.btn-remove'})}</Button>
            )
        }
    ]


    useImperativeHandle(ref,()=> ({
        setValue,
    }))

    useEffect(()=> {
        const idsTyps: string[] = []
        for (let index = 0, len = dataList.length; index < len; index += 1) {
            const element = dataList[index];
            idsTyps.push(`${element.id  }-${  element.type}`);            
        }
        setDataListIdsType(idsTyps);
    },[dataList])
    

    return (
        <div>
            <Table<TableListItem>
                rowKey="id"
                columns={columns}
                dataSource={dataList}
                pagination={false}
            />
            <SearchListDrawer columnsAfter={[
                {
                    title: intl.formatMessage({id: 'components.searchtablechoose.drawer.table-column-option'}),
                    dataIndex: 'option',
                    width: 160,
                    render: (_, record) => (
                    <Button type="link" onClick={()=> drawerChoose(record)} disabled={dataListIdsType.includes(`${record.id  }-${  record.type}`)}>{intl.formatMessage({id: 'components.searchtablechoose.drawer.btn-choose'})}</Button>
                    )
                }
            ]} drawerVisible={drawerVisible} onClose={drawerOnClose} />
        </div>
    );




})

export default SearchTableChoose;


