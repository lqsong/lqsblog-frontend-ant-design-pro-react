export interface ArticleCategory {
    id: number;
    name: string;
    alias?: string;
}
export interface TableListItem {
    type: number;
    id: number;
    title: string;
    description: string;
    thumb: string;
    category?: ArticleCategory;
    addtime: string;
}

export interface TableListParams {
    per: number;
    page: number;
    keywords?: string;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}

export interface PaginationConfig {
    total: number;
    current: number;
    pageSize: number;
    showSizeChanger: boolean;
}

export interface GetListParams {
    pageSize: number;
    current: number;
    title: string;
}