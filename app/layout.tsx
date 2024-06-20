import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
// 使用 Inter 字体中的一个子集，这里是拉丁
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Nextjs flash news',
	description: 'Get the latest flash news',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className}`}>{children}</body>
		</html>
	);
}
