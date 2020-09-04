export interface ArticleCategoryCascaderData {
    id: number;
    name: string;
    leaf: boolean;
}

export interface CascaderParams {
    pid: number | string | undefined;
}