export interface RoleListItem {
    id: number;
    name: string;
}

export interface TableListItem {
    id: number;
    nickname: string;
    username: string;
    roles: RoleListItem[];
}

export interface TableListParams {
    per: number;
    page: number;
    keywords?: string;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}

export interface FormValueType {
    id?: number;
    username: string;
    password?: string;
    nickname: string;
    roles: number[];
}