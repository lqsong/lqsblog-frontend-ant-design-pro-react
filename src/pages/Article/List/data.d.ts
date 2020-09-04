export interface ArticleCategory {
    id: number;
    alias: string;
    name: string;
}

export interface TableListItem {
    id: number;
    title: string;
    category: ArticleCategory;
    addtime: string;
    tag: string;
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