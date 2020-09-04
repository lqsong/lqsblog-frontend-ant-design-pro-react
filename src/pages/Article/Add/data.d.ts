export interface FormValueType {
    title: string;
    keywords: string;
    description: string;
    addtime: string;
    categoryId: number;
    categoryIds: string; // , 分割
    tag: string; // 多个, 分割
    thumb: string; // 多个 | 分割
    content: string;
    interestIds: string; // , 分割
}