declare type Recordable<T = any> = Record<string, T>;

// Vite
declare interface ViteEnv {
	VITE_GLOB_APP_TITLE: string;
	VITE_PUBLIC_PATH: string;
	VITE_PORT: number;
	VITE_OPEN: boolean;
	VITE_PROXY: [string, string][];
	VITE_LEGACY: boolean;
}
