export namespace Theme {
	export type GreyOrWeakType = 'grey' | 'weak';
}

export namespace Confirm {
	export type MessageType = '' | 'success' | 'warning' | 'info' | 'error';
}

export namespace Table {
	export interface ApiDataKeyMap {
		tableData: string;
		pageNo: string;
		pageSize: string;
		total: string;
	}

	export interface PageParamsKeyMap {
		pageNo: string;
		pageSize: string;
	}
	export interface UseTableParams {
		api: (params: any) => Promise<any> | any;
		apiDataKeyMap?: ApiDataKeyMap;
		initParams?: object;
		pageable?: boolean;
		pageParamsKeyMap?: PageParamsKeyMap;
		filterEmptyParams?: boolean;
		handleSearchParams?: (data: Recordable) => void;
		dataCallback?: (data: any) => any;
		initOnMount?: boolean;
	}
	export interface PageParams {
		pageNo: number;
		pageSize: number;
		total: number;
	}
	export interface TableStateProps<T = any> {
		loading: boolean;
		tableData: T[];
		pageParams: PageParams;
		initSearchParams: {
			[key: string]: any;
		};
		searchParams: {
			[key: string]: any;
		};
		finalParams: {
			[key: string]: any;
		};
	}
}
