export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns';

/* themeConfigProp */
export interface ThemeConfigProps {
	isDark: boolean;
	primary: string;
	isGrey: boolean;
	isWeak: boolean;
	isCollapse: boolean;
	layout: LayoutType;
	tabs: boolean;
	tabsIcon: boolean;
	footer: boolean;
	breadcrumb: boolean;
	breadcrumbIcon: boolean;
	maximize: boolean;
}

export interface AppState {
	token: string;
	userInfo: any;
	language: string;
	// assemblySize: AssemblySizeType;
	themeConfig: ThemeConfigProps;
}
export interface AuthState {
	routeName: string;
	authButtonList: {
		[key: string]: string[];
	};
	authMenuList: Menu.MenuOptions[];
}

export interface TabMenu {
	icon: string;
	title: string;
	path: string;
	name: string;
	closable: boolean;
}

export interface TabsState {
	currentTabPath: string;
	tabsMenuList: TabMenu[];
}

export interface KeepAliveState {
	keepAliveNameList: string[];
}
