export interface TableListItem {
    id: number;
    title: string;
    addtime: string;
    tag: string;
}

export interface TableListParams {
    per: number;
    page: number;
    keywords?: string;
    addtimestart?: string;
    addtimeend?: string;
    tags?: string;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}