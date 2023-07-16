import { useEffect, useRef } from 'react';

export const useIsMounted = () => {
	const mountedRef = useRef<boolean>(true);
	useEffect(() => {
		return () => {
			mountedRef.current = false;
		};
	}, []);
	return mountedRef.current;
};
