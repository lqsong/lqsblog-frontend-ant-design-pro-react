export interface CategoryType {
    id: number;
    name: string;
    alias?: string
}

export interface TableListItem {
    id: number;
    category: CategoryType;
    title: string;
}

export interface TableListParams {
    per: number;
    page: number;
    keywords?: string;
    categoryid?: number;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}

export interface FormValueType {
    title: string;
    description: string;
    categoryId: number;
    href: string;
    logo?: string;
    category?: CategoryType
}