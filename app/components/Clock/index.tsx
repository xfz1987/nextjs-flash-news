'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
	const [value, setValue] = useState(new Date().toLocaleTimeString());

	useEffect(() => {
		const intervalId = setInterval(() => setValue(new Date().toLocaleTimeString()), 1000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return <div>{value}</div>;
}
