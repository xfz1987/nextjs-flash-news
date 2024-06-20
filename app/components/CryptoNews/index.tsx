'use client';

import { useState, useEffect } from 'react';
import { fetchBitcoin } from '@/app/api/crypto-api';
import { CryptoItem } from '@/app/types/crypto-type';

export function CryptoNews() {
	const [crypto, setCrypto] = useState<CryptoItem>(null!);
	const fetchCrypto = async () => {
		const data = await fetchBitcoin();
		setCrypto(data);
	};

	useEffect(() => {
		fetchCrypto();

		const intervalId = setInterval(fetchCrypto, 20000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const getEvolutionEmoji = (value: string) => {
		const v = Number(value);
		return v > 0 ? <span className="text-green-500">△</span> : <span className="text-red-500">▽</span>;
	};

	return (
		crypto && (
			<div>
				<div className="flex items-center space-x-4 mb-4">
					<h2 className="text-xl font-bold">
						<span className="animate-pulse">🔴</span> Crypto news
					</h2>
				</div>
				<div className="w-80 border-2 p-4 rounded-lg">
					<div>
						<div className="text-lg font-semibold">{`${crypto.name}  market`}</div>
						<div className="text-slate-500">Real time {crypto.name} evolution</div>
					</div>
					<div className="space-y-2 text-sm">
						{crypto.priceUsd.split('.')[0]}$ ({crypto.changePercent24Hr}%)
						{getEvolutionEmoji(crypto.changePercent24Hr)}
					</div>
				</div>
			</div>
		)
	);
}
