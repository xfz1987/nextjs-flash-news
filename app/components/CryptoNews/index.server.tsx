import Skeleton from 'react-loading-skeleton';
import { fetchBitcoin } from '@/app/api/crypto-api';
import { CryptoNews as CryptoNewsClient } from './index.client';

export async function CryptoNews() {
	const crypto = await fetchBitcoin();
	return <CryptoNewsClient initialData={crypto} />;
}

export const CryptoNewsSkeleton = () => {
	return (
		<div>
			<Skeleton
				height={28}
				width={140}
				count={1}
				className="mb-4"
			/>
			<Skeleton
				height={108}
				width={320}
				count={1}
			/>
		</div>
	);
};
