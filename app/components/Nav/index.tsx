import Image from 'next/image';
import { NAV_ITEMS } from '@/app/constant';
import Logo from '@/public/images/logo.png';
import { NavItem } from './NavItem';
import Link from 'next/link';

export function Nav() {
	return (
		<div>
			{/* Logo */}
			<Link href="/">
				<Image
					src={Logo}
					alt="Logo"
					className="w-40"
				/>
			</Link>
			{/* Nav Bar */}
			<nav className="space-y-4 mt-4">
				{NAV_ITEMS.map(navItem => (
					<NavItem
						key={navItem.category}
						{...navItem}
					/>
				))}
			</nav>
		</div>
	);
}
