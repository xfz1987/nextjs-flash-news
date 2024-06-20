// http://localhost:3000

import { Suspense } from 'react';
import { LatestNews, LatestNewsSkeleton } from '@/app/components/LatestNews';
import { CryptoNews, CryptoNewsSkeleton } from '@/app/components/CryptoNews/index.server';

export default async function Home() {
	return (
		<div className="flex justify-between">
			<Suspense fallback={<LatestNewsSkeleton />}>
				<LatestNews />
			</Suspense>
			<Suspense fallback={<CryptoNewsSkeleton />}>
				<CryptoNews />
			</Suspense>
		</div>
	);
}
