'use client';
import { useState } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';

type ImageWithFallbackType = ImageProps & {
	fallback: StaticImageData;
};

export function ImageWithFallback({ fallback, src, alt, ...p }: ImageWithFallbackType) {
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<Image
			{...p}
			src={imgSrc}
			alt={alt || 'default alt'}
			onError={() => setImgSrc(fallback.src)}
		/>
	);
}
