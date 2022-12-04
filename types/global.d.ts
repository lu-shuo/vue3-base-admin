declare type Recordable<T = any> = Record<string, T>;

// Vite
declare interface ViteEnv {
	VITE_GLOB_APP_TITLE: string;
	VITE_PUBLIC_PATH: string;
	VITE_PORT: number;
	VITE_OPEN: boolean;
	VITE_PROXY: [string, string][];
	VITE_LEGACY: boolean;
	VITE_DROP_CONSOLE: boolean;
	VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
	VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
}
