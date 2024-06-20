import { Nav } from '@/app/components/Nav';
// import Clock from '@/app/components/Clock';
import dynamic from 'next/dynamic';

const ClockNoSSR = dynamic(() => import('@/app/components/Clock'), { ssr: false });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="p-6">
			<div className="h-12">
				{/* <Clock /> */}
				<ClockNoSSR />
			</div>
			<div className="flex">
				<Nav />
				<div className="mt-16 pl-8 w-full">{children}</div>
			</div>
		</div>
	);
}
