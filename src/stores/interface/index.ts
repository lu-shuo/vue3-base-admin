export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns';

/* themeConfigProp */
export interface ThemeConfigProps {
	isDark: boolean;
	primary: string;
	isGrey: boolean;
	isWeak: boolean;
	isCollapse: boolean;
	layout: LayoutType;
	// maximize: boolean;
	// breadcrumb: boolean;
	// breadcrumbIcon: boolean;
	// tabs: boolean;
	// tabsIcon: boolean;
	// footer: boolean;
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
