import React, { useState } from 'react';
import { Select } from 'antd';
import { LinksCategorySelectData } from './data.d';
import { querySelect } from './service';

interface LinksCategorySelectProps {
    selectedOption?: LinksCategorySelectData,
    value?: string | number | undefined;
    placeholder?: string;
    onChange?: (value: any) => void ;
}

const LinksCategorySelect:React.FC<LinksCategorySelectProps> = (props) => {

    const { selectedOption, ...rest } = props;

    const [loading, handleLoading] = useState<boolean>(false);
    const [optionData, handleOptionData] = useState<LinksCategorySelectData[]>([]);

    const onDropdownVisibleChange = (open: boolean): void => {
        if(!open) {
            return;
        }

        if(optionData.length > 0) {
            return;
        }
        handleLoading(true);
        querySelect().then(res => {
            const { data } = res;
            handleLoading(false);
            handleOptionData(data);
        })

    }

    return <Select { ...rest }
        allowClear
        loading={loading}
        onDropdownVisibleChange={onDropdownVisibleChange}>
        {
            optionData.length > 0 ?
            optionData.map( d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option> ) :
            (selectedOption && <Select.Option key={selectedOption.id} value={selectedOption.id}>{selectedOption.name}</Select.Option>)
        }
    </Select>;
}

export default LinksCategorySelect;

