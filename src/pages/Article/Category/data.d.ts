export interface TableListItem {
    id: number;
    name: string;
    alias: string;
    title: string;
    keywords: string;
    description: string;
    pid: number;
    pname?: string;
    children?: TableListItem[];
}

export interface TableListParams {
    pid: number;
}

export interface FormValueType {
    pid: number;
    name: string;
    alias: string;
    title: string;
    keywords: string;
    description: string;
    pname?: string;
}