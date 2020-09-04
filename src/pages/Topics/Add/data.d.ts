export interface ArticleCategory {
    id: number;
    name: string;
    alias?: string;
}

export interface TopicsContent {
    type: number;
    id: number;
    title: string;
    description: string;
    thumb: string;
    category?: ArticleCategory;
    addtime: string;
}

export interface FormValueParamsType {
    title: string;
    keywords: string;
    description: string;
    addtime: string;
    alias: string;
    content: TopicsContent[];
}