import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { ArticleApi } from '@/app/api/article-api';
import { ArticleList } from '@/app/components/ArticleList';
import topPng from '@/public/images/top.png';

export async function LatestNews() {
	const articles = await ArticleApi.fetchToday();
	return (
		<div>
			<div className="flex items-center space-x-4 mb-16">
				<Image
					src={topPng}
					className="h-10 w-10"
					alt="Latest news icon"
				/>
				<h1>Latest news</h1>
			</div>
			<ArticleList articles={articles} />
		</div>
	);
}

export const LatestNewsSkeleton = () => (
	<div>
		<Skeleton
			height={40}
			width={218}
			count={1}
			className="mb-16"
		/>
		{Array.from({ length: 15 }, (_, index) => index + 1).map(i => (
			<Skeleton
				key={i}
				height={344}
				width={320}
			/>
		))}
	</div>
);
