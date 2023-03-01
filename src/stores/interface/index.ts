export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns';

/* themeConfigProp */
export interface ThemeConfigProps {
	isDark: boolean;
	primary: string;
	isGrey: boolean;
	isWeak: boolean;
	// maximize: boolean;
	// layout: LayoutType;
	// isCollapse: boolean;
	// breadcrumb: boolean;
	// breadcrumbIcon: boolean;
	// tabs: boolean;
	// tabsIcon: boolean;
	// footer: boolean;
}

export interface AuthState {
	routeName: string;
	authButtonList: {
		[key: string]: string[];
	};
	authMenuList: Menu.MenuOptions[];
}
