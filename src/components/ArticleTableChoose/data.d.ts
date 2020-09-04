export interface ArticleCategory {
    id: number;
    name: string;
    alias?: string;
}
export interface TableListItem {
    id: number;
    title: string;
    category: ArticleCategory;
    addtime: string;
    hit?: number;
    tag?: string;
}