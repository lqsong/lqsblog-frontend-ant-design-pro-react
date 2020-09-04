export interface TableListItem {
    id: number;
    name: string;
    urlcode: string
    perms: string;
    permsLevel: string;
    type: number;
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
    urlcode: string
    perms: string;
    permsLevel: string;
    type: number;
    pname?: string;
}