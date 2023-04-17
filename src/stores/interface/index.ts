export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns';
export type AssemblySizeType = 'large' | 'default' | 'small';
export type LanguageType = 'zh' | 'en' | null;

/* themeConfigProp */
export interface AppState {
	layout: LayoutType;
	assemblySize: AssemblySizeType;
	language: LanguageType;
	maximize: boolean;
	primary: string;
	isDark: boolean;
	isGrey: boolean;
	isWeak: boolean;
	asideInverted: boolean;
	isCollapse: boolean;
	breadcrumb: boolean;
	breadcrumbIcon: boolean;
	tabs: boolean;
	tabsIcon: boolean;
	footer: boolean;
}
/* UserState */
export interface UserState {
	token: string;
	userInfo: { name: string };
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
