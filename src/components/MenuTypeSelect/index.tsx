import React from "react";
import { useIntl } from "umi";

import { Select } from "antd";

interface MenuTypeSelectProps {
    value?: any;
    placeholder?: string;
    onChange?: (value: any) => void ;
}

const MenuTypeSelect: React.FC<MenuTypeSelectProps> = (props) => {
    const intl = useIntl();

    const { placeholder,  ...rest } = props;

    return <Select                
                { ...rest }
                placeholder={placeholder}
            >
               <Select.Option value={1}>{intl.formatMessage({id: 'components.menulisttype.text-menu'})}</Select.Option>
               <Select.Option value={2}>{intl.formatMessage({id: 'components.menulisttype.text-btn'})}</Select.Option>
            </Select>;


}

export default MenuTypeSelect;