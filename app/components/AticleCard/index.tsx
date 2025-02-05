import { Article, ArticleCategory } from '@/app/types/article-type';
import Image from 'next/image';
import Link from 'next/link';
import defaultNewsPng from '@/public/images/default-news.png';
import { CATEGORIES_ITEMS } from '@/app/constant';
import { ImageWithFallback } from '@/app/components/ImageWithFallback';

export function ArticleCard(p: { article: Article }) {
	return (
		<Link
			href={`/articles/title/${p.article.title}`}
			className="space-y-4 block w-80 hover:bg-slate-50 transition hover:scale-105 border-2 border-gray-100 py-4 px-6 rounded-xl shadow-sm"
		>
			{/* Header */}
			<div className="capitalize">
				{/* Icon and category*/}
				<div className="flex items-center gap-2">
					<div className="flex w-10 h-10 justify-center items-center border border-slate-300 rounded-full">
						<Image
							className="w-5 h-5"
							src={CATEGORIES_ITEMS[p.article.category[0] as ArticleCategory].src}
							alt="Icon for category"
						/>
					</div>
					<div className="font-bold text-sm">{p.article.category}</div>
				</div>
				{/* Date */}
				<div className="mt-2 text-sm text-gray-400">Published: {new Date(p.article.pubDate).toDateString()}</div>
			</div>

			{/* Body */}
			<div className="space-y-2">
				{/* Title */}
				<div className="font-semibold text-xl line-clamp-2 h-14">{p.article.title}</div>
				{/* Article images */}
				<ImageWithFallback
					height={200}
					width={300}
					src={p.article.image_url || defaultNewsPng}
					alt="Image for article"
					fallback={defaultNewsPng}
				/>
			</div>
		</Link>
	);
}
