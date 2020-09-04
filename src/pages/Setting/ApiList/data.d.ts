export interface TableListItem {
    id: number;
    name: string;
    permission: string;
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
    permission: string;
    pname?: string;
}