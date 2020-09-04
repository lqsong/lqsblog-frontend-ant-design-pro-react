import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { SelectDataItem } from './data.d';
import { querySelect } from './service';

interface RoleSelectProps {
    defaultReadData?: boolean,
    value?: number[];
    placeholder?: string;
    onChange?: (value: any) => void ;
}


const RoleSelect:React.FC<RoleSelectProps> = (props) => {

    const { defaultReadData = false, ...rest } = props;

    const [loading, handleLoading] = useState<boolean>(false);
    const [optionData, handleOptionData] = useState<SelectDataItem[]>([]);

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

    useEffect(()=> {
        if (defaultReadData) {
            onDropdownVisibleChange(true);
        }
    },[defaultReadData])
    

    return <Select { ...rest }
        allowClear
        mode="multiple"
        loading={loading}
        onDropdownVisibleChange={onDropdownVisibleChange}
        filterOption={(input, option) =>
            option ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
        }
        >
        {  
            optionData.map( d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option> ) 
        }
    </Select>;

}

export default RoleSelect;