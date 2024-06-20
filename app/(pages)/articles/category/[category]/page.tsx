// http://localhost:3000/articles/category/business?date=yesterday
// params: { id: ’business‘ }，searchParams: { date: ’yesterday‘ }
// export default function CategoryDetailPage(p: { params: { id: string }; searchParams: { date: string } }) {
//
// 	return (
// 		<h1 className="font-bold capitalize text-3xl">
// 			Hello {p.params.id} News of {p.searchParams.date}
// 		</h1>
// 	);
// }

import Image from 'next/image';
import { ArticleApi } from '@/app/api/article-api';
import { ArticleCategory } from '@/app/types/article-type';
import { CATEGORIES_ITEMS, NAV_ITEMS } from '@/app/constant';
import { ArticleList } from '@/app/components/ArticleList';
import { notFound } from 'next/navigation';

// 如果想设置它的缓存有效时间，可以加上 revalidate
// export const revalidate = 1000; // 1000秒

// 相当于 nextjs@13 的 getStaticPaths
// export function generateStaticParams() {
// 	return NAV_ITEMS.map(navItem => {
// 		return {
// 			category: navItem.category,
// 		};
// 	});
// }

export const dynamic = 'force-dynamic';

export default async function ArticlesByCategoryPage(p: { params: { category: ArticleCategory } }) {
	const articles = await ArticleApi.fetchByCategory(p.params.category);

	if (!articles || !articles?.length) {
		notFound();
	}

	return (
		<div>
			<div className="flex items-center space-x-4 mb-16">
				<Image
					src={CATEGORIES_ITEMS[p.params.category].src}
					// className="h-10 2-10"
					width={40}
					height={40}
					alt="Latest news icon"
				/>
				<h1 className="text-4xl font-bold capitalize">{p.params.category} news</h1>
			</div>
			<ArticleList articles={articles} />
		</div>
	);
}
