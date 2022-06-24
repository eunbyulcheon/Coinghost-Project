import { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetcher, baseUrl } from './DataFetcher';
import { DataAPIType } from './types';

export const useInfiniteScroll = () => {
	const PAGE_LIMIT = 10;

	const getKey = (pageIndex: number, previousPageData: any) => {
		if (previousPageData && !previousPageData.data) return null;
		return `${baseUrl}?limit=${PAGE_LIMIT}&page=${pageIndex + 1}&orderBy=likes`;
	};

	const { data, setSize, isValidating } = useSWRInfinite<DataAPIType>(
		getKey,
		fetcher
	);

	const blogs =
		data &&
		data
			.map((data) => data.data)
			.map((data) => data.data)
			.flat();

	const [target, setTarget] = useState<HTMLElement | null | undefined>(null);

	useEffect(() => {
		if (!target) return;
		const observer = new IntersectionObserver(onIntersect, {
			threshold: 0.4,
		});
		observer.observe(target);
		return () => observer && observer.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, target]);

	const onIntersect: IntersectionObserverCallback = ([entry]) => {
		if (entry.isIntersecting) {
			setSize((prev) => prev + 1);
		}
	};

	return { blogs, setTarget, isValidating };
};
