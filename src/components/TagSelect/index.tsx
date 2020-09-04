import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin   } from 'antd';
import { TagSelectData } from './data.d';
import { querySelect } from './service';

interface TagSelectProps {
    value?: any;
    placeholder?: string;
    onChange?: (value: any) => void ;
    mode?: 'multiple' | 'tags';
}


const TagSelect:React.FC<TagSelectProps> = (props)=> {

    const { placeholder,  ...rest } = props;

    const [fetching, handleFetching] = useState<boolean>(false);
    const [optionData, handleOptionData] = useState<TagSelectData[]>();

    

    const handleSearch = debounce((val: any): void => {
        handleFetching(true);
        handleOptionData([]);
        querySelect({keywords:val}).then(res => {
            const { data } = res;
            handleFetching(false);
            handleOptionData(data);
        })
    },800);
    


    return <Select                
                { ...rest }
                placeholder={placeholder}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={handleSearch}
            >
                {
                    optionData?.map( d => <Select.Option  key={d.id} value={d.name}>{d.name}</Select.Option> )
                }
                
            </Select>;

}


export default TagSelect;