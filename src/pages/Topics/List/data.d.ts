export interface TableListItem {
    id: number;
    title: string;
    addtime: string;
    alias: string;
}

export interface TableListParams {
    per: number;
    page: number;
    keywords?: string;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}