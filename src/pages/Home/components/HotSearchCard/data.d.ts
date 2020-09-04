export interface TableListItem {
    name: string;
    hit: number;
}

export interface TableListParams {
    per: number;
    page: number;
}

export interface PaginationConfig {
    total: number;
    current: number;
    pageSize: number;
    showSizeChanger: boolean;
}