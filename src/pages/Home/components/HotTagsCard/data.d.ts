export interface TableListItem {
    id: number;
    name: string;
    hit: number;
    pinyin?: string;
}

export interface TableListParams {
    per: number;
    page: number;
    sort: number;
}

export interface PaginationConfig {
    total: number;
    current: number;
    pageSize: number;
    showSizeChanger: boolean;
}