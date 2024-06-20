/**
 * React Server Component 直接请求 Server API，因此不需要经过http请求（里面的http请求是server to server）
 * 因此可以设么写，方法调用即可
 */

import { Article, ArticleCategory, ArticleListResponse } from '@/app/types/article-type';

export class ArticleApi {
	static async fetchToday(): Promise<Article[]> {
		console.log('ENV API KEY accessible on server only', process.env.API_KEY);
		const { results } = (await (await fetch(`${process.env.API_BASE_URL}`)).json()) as ArticleListResponse;
		return results;
	}

	static async fetchByCategory(category: ArticleCategory): Promise<Article[]> {
		const { results } = (await (
			await fetch(`${process.env.API_BASE_URL}?category=${category}`)
		).json()) as ArticleListResponse;
		return results;
	}

	static async fetchByTitle(title: string): Promise<Article> {
		const formatedTitle = title.replace('/:/g', '');

		const { results } = (await (
			await fetch(`${process.env.API_BASE_URL}?title=${formatedTitle}`)
		).json()) as ArticleListResponse;
		return results[0];
	}
}
