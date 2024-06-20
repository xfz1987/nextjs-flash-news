export const delayResponse = <T>(response: T, duration = 1000): Promise<T> =>
	new Promise(resolve => setTimeout(() => resolve(response), duration));

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const minDelay = async <T>(promise: Promise<T>, ms = 1000) => {
	const [p] = await Promise.all([promise, sleep(ms)]);
	return p;
};
