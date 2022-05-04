import { ArticeInfo, ArticleDetail, QueryArticlesParams } from './types';
export declare function getPublishedArticles(params: QueryArticlesParams): Promise<ArticeInfo[]>;
export declare function getArticleDetailById(id: number): Promise<ArticleDetail>;
declare const _default: {
    getPublishedArticles: typeof getPublishedArticles;
    getArticleDetailById: typeof getArticleDetailById;
};
export default _default;
