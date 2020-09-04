import React from "react";
import { useIntl } from "umi";

import { Tag } from "antd";

interface SearchListTypeTagProps {
    value: number;
}

const SearchListTypeTag: React.FC<SearchListTypeTagProps> = (props) => {
    const intl = useIntl();

    const { value } = props;


    return value === 1 ? 
    <Tag color="green">{intl.formatMessage({id: 'components.searchlisttype.text-article'})}</Tag> : 
    <Tag color="purple">{intl.formatMessage({id: 'components.searchlisttype.text-works'})}</Tag>;


}

export default SearchListTypeTag;