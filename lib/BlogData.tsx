import useSWRInfinite from 'swr/infinite';
import { fetcher, baseUrl } from './DataFetcher';
import { DataAPIType } from './Interface';

export const useInfiniteScroll = () => {
	const PAGE_LIMIT = 10;

	const swr = useSWRInfinite<DataAPIType>(
		(index) => `${baseUrl}?limit=${PAGE_LIMIT}&page=${index + 1}&orderBy=likes`,
		fetcher
	);
	const { data, error, size, setSize } = swr;
	// const posts = data ? [].concat(...data) : [];
	const isLoadingInitialData = !data && !error;
	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === 'undefined');
	const isEmpty = data?.[0]?.length === 0;
	const isReachingEnd =
		isEmpty || (data && data[data.length - 1]?.length < PAGE_LIMIT);

	return { ...swr, isLoadingMore, isReachingEnd };
};