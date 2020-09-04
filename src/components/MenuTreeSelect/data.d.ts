export interface MenuParams {
    pid: number | undefined;
}

export interface MenuTreeSelectAjaxData {
    id: number ;
    name: string;
    leaf: boolean;
}

export interface MenuTreeSelectTreeData {
    id: number;
    pId: number;
    key: string;
    value: string;
    title: string;
    isLeaf: boolean;
}

