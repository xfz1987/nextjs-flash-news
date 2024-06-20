import { CryptoItem, CryptoResponse } from '@/app/types/crypto-type';
import { delayResponse, minDelay } from '@/app/lib/delay';

export const fetchBitcoin = async (): Promise<CryptoItem> => {
	const cryptoResp: CryptoResponse = await (
		await fetch(`${process.env.NEXT_PUBLIC_CRYPO_BASE_URL}/assets/bitcoin`)
	).json();

	return delayResponse(cryptoResp.data, 4000);
};
