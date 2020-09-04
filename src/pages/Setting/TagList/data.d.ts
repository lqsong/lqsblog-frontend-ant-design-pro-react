export interface TableListItem {
    id: number;
    name: string;
    pinyin: string;
    hit?: number;
}

export interface TableListParams {
    per: number;
    page: number;
    keywords?: string;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}

export interface FormValueType {
    name: string;
    pinyin: string;
}