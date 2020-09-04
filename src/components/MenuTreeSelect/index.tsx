import React, { useState, useEffect } from 'react';

import { TreeSelect } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DataNode, ChangeEventExtra, LegacyDataNode } from 'rc-tree-select/lib/interface'
import Request from 'umi-request';
import { MenuTreeSelectAjaxData, MenuTreeSelectTreeData } from "./data.d";

import { query } from './service';

interface MenuTreeSelectProps {
    value?: string[] | undefined;
    onChange?: (value: any, labelList?: React.ReactNode[], extra?: ChangeEventExtra) => void;
    style?: React.CSSProperties | undefined;
    placeholder?: string;
}

const formatData = (data: MenuTreeSelectAjaxData[], pId: number, pValue: string): DataNode[] => {
    return data.map((item: MenuTreeSelectAjaxData)=> {
        const key = pValue !== '' ? `${ pValue }-${ item.id }` : item.id.toString();
        const d: MenuTreeSelectTreeData = {
            id: item.id,
            pId,
            key,
            value: key,
            title: item.name,
            isLeaf: item.leaf,
        }
        return d;
    })
}

const MenuTreeSelect: React.FC<MenuTreeSelectProps> = (props) => {

    const {CancelToken} = Request;
    const { token, cancel } = CancelToken.source();

    const { placeholder, ...rest } = props;

    const [requestedPid, setRequestedPid] = useState<number[]>([]);
    let requestedPidLet: number[] = [];
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    let treeDataLet: DataNode[] = [];

    const setTreeSelectData = async (pId: number, pValue: string) => {
        if (requestedPidLet.length < 1 && requestedPid.length > 0) {
            requestedPidLet = [...requestedPid]
        }
        if(requestedPidLet.includes(pId)) {
            return ;
        }
        requestedPidLet.push(pId);
        setRequestedPid([...requestedPidLet]);
                      
        const result = await query({ pid: pId}, token);
        if (!result) {
            return;
        }
        const { data } = result;
        if(treeDataLet.length < 1 && treeData.length > 0) {
            treeDataLet = [...treeData];
        }
        const newData = treeDataLet.concat(formatData(data,pId,pValue));
        treeDataLet = [...newData];
        setTreeData([
            ...treeDataLet,
        ]);
    }

    const onLoadData = (dataNode: LegacyDataNode): Promise<any> => {
        const { id, value } = dataNode;
        return setTreeSelectData(id, !value ? '': value.toString());
    }

    const setDefaultData = async (value: string[]) => {

        const results = [];

        for (let index = 0, len = value.length; index < len; index+=1) {
            const element = value[index];
            const arr = element.split('-');
            const arrLen = arr.length;
            if (arrLen > 1) {
                const eleVal = [];
                for (let index2 = 0, len2 = arrLen-1; index2 < len2; index2+=1) {
                    const element2 = arr[index2];
                    eleVal.push(element2);
                    results.push(setTreeSelectData(parseInt(element2,10),eleVal.join('-')));
                }
            }
        }

        if(results.length > 0) {
            await Promise.all(results)
        }
    }

    const initData = async () => {
        const { value } = props;
        await setTreeSelectData(0,'');
        if (value && value.length > 0) {
            await setDefaultData(value);
        }
    }


    useEffect(()=>{
        
        initData();

        return () => {
            cancel('CancelToken');
        }
    },[1])


    return <TreeSelect
        { ...rest }
        placeholder={placeholder}
        multiple
        allowClear
        showSearch={false}
        treeDataSimpleMode
        treeData={treeData}
        loadData={onLoadData}
    />;

}

export default MenuTreeSelect;