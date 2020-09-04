export interface TableListItem {
    id: number;
    title: string;
    hit: number;
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