import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function ArticleViewCount() {
	const pathname = usePathname();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (pathname.includes('/articles/title/')) {
			setCount(count => count++);
		}
	}, [pathname]);

	return <div className="text-xs">{count} articles consulted</div>;
}
