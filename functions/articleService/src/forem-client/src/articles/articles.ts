import { foremClient } from '../client/client'
import { ArticeInfo, ArticleDetail, QueryArticlesParams } from './types'

// https://developers.forem.com/api#operation/getArticles
export async function getPublishedArticles(params: QueryArticlesParams): Promise<ArticeInfo[]> {
    const resp = await foremClient.get('/api/articles', {
        params: params,
    });

    return resp.data
}

export async function getArticleDetailById(id: number): Promise<ArticleDetail> {
    const resp = await foremClient.get(`/api/articles/${id}`)
    return resp.data
}

export default {
    getPublishedArticles,
    getArticleDetailById
}