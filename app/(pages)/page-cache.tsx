// http://localhost:3000
import { ArticleApi } from '@/app/api/article-api';

// 页面缓存10s
export const revalidate = 10;

export default async function Home() {
	const articles = await ArticleApi.fetchToday();

	return (
		<>
			<div>{new Date().toLocaleTimeString()}</div>
			<div>{JSON.stringify(articles)}</div>;
		</>
	);
}
