import moment from 'moment';

export interface FormValueParamsType {
    title: string;
    keywords: string;
    description: string;
    addtime: string;
    tag: string; // 多个, 分割
    thumb: string; // 多个 | 分割
    content: string;
}

export interface FormValueType {
    title: string;
    keywords: string;
    description: string;
    addtime: moment.Moment;
    tag: string[];
}