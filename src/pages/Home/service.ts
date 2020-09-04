import request from '@/utils/request';


export async function dailynewArticles() {
    return request('/stats/articles/dailynew');
}

export async function weeknewWorks() {
    return request('/stats/works/weeknew');
}

export async function monthnewTopics() {
    return request('/stats/topics/monthnew');
}

export async function annualnewLinks() {
    return request('/stats/links/annualnew');
}