export interface ApiParams {
    pid: number | undefined;
}

export interface ApiTreeSelectAjaxData {
    id: number ;
    name: string;
    leaf: boolean;
}

export interface ApiTreeSelectTreeData {
    id: number;
    pId: number;
    key: string;
    value: string;
    title: string;
    isLeaf: boolean;
}

