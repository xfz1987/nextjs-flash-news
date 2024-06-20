'use client';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation';
import { ArticleCategory } from '@/app/types/article-type';

type NavItem = {
	src: StaticImageData;
	category: string;
	alt: string;
};

export function NavItem(p: NavItem) {
	const pathname = usePathname();
	const isActive = `/articles/category/${p.category}` === pathname;
	// console.log(process.env.API_KEY, process.env.NEXT_PUBLIC_TEST);
	return (
		<Link
			href={`/articles/category/${p.category}`}
			className={`flex items-center h-12 gap-2 p-3 hover:bg-slate-100 transition hover:scale-105 rounded-xl ${
				isActive && 'bg-orange-50'
			}`}
		>
			<div className="flex justify-center items-center rounded-full border border-[#BBC2CC] w-10 h-10">
				<Image
					className="w-5 h-5"
					src={p.src}
					alt={p.alt}
				/>
			</div>
			<div className="capitalize font-semibold">{p.category}</div>
		</Link>
	);
}
