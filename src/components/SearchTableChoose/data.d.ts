export interface ArticleCategory {
    id: number;
    name: string;
    alias?: string;
}
export interface TableListItem {
    type: number;
    id: number;
    title: string;
    description: string;
    thumb: string;
    category?: ArticleCategory;
    addtime: string;
}