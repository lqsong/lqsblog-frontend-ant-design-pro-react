import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader';
import { queryCascader } from './service';
import { ArticleCategoryCascaderData } from './data';

interface ArticleCategoryCascaderProps {
    value?: string[] | number[] | undefined;
    placeholder?: string;
    onChange?: (value: CascaderValueType, selectedOptions?: CascaderOptionType[] | undefined) => void ;
}

const formatData = (data: ArticleCategoryCascaderData[]): CascaderOptionType[] => {
    return data.map((item: ArticleCategoryCascaderData)=> {
        return {
            label: item.name,
            value: item.id,
            isLeaf: item.leaf
        }
    })
}

const ArticleCategoryCascader:React.FC<ArticleCategoryCascaderProps> = (props) => {
    

    const { placeholder, ...rest } = props;

    const [options, handleOptions] = useState<CascaderOptionType[] | undefined>(); 

    const loadData = (selectedOptions: CascaderOptionType[] | undefined): void => {

        const sOptions = selectedOptions || [];
        const targetOption = sOptions[sOptions.length - 1];
        targetOption.loading = true;


        queryCascader({pid: targetOption.value}).then(res=> {
            const { data } = res;

            targetOption.loading = false;

            targetOption.children = formatData(data);

            const newOptions = options || [];
            handleOptions([...newOptions])
        })
    }


    const initData = async (pid:number) => {
    
        const result = await queryCascader({pid})
        const { data } = result;

        handleOptions(formatData(data))
    }

    useEffect(() => {
        initData(0);        
    },[])






    return <Cascader { ...rest } placeholder={placeholder} options={options} loadData={loadData} />;
}

export default ArticleCategoryCascader;