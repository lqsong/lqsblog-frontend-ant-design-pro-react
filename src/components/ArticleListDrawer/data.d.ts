export interface ArticleCategory {
    id: number;
    name: string;
    alias?: string;
}
export interface TableListItem {
    id: number;
    title: string;
    category: ArticleCategory;
    addtime: string;
    hit?: number;
    tag?: string;
}

export interface TableListParams {
    per: number;
    page: number;
    keywords?: string;
    categoryid?: number;
    addtimestart?: string;
    addtimeend?: string;
    tags?: string;
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