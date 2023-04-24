import { isArray } from './is';
import { FieldNamesProps } from '@/components/ProTable/interface';

/**
 * @description 获取当前时间对应的提示语
 * @return string
 */
export function getTimeState() {
	// 获取当前时间
	const timeNow = new Date();
	// 获取当前小时
	const hours = timeNow.getHours();
	// 判断当前时间段
	if (hours >= 6 && hours <= 10) return '早上好 ⛅';
	if (hours >= 10 && hours <= 14) return '中午好 🌞';
	if (hours >= 14 && hours <= 18) return '下午好 🌞';
	if (hours >= 18 && hours <= 24) return '晚上好 🌛';
	if (hours >= 0 && hours <= 6) return '凌晨好 🌛';
}

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export function getBrowserLang() {
	const browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
	let defaultBrowserLang = '';
	if (browserLang.toLowerCase() === 'cn' || browserLang.toLowerCase() === 'zh' || browserLang.toLowerCase() === 'zh-cn') {
		defaultBrowserLang = 'zh';
	} else {
		defaultBrowserLang = 'en';
	}
	return defaultBrowserLang;
}

/**
 * @description 使用递归，过滤出需要渲染在左侧菜单的列表（剔除 isHide == true 的菜单）
 * @param {Array} menuList 所有菜单列表
 * @return array
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
	const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.filter(item => {
		item.children?.length && (item.children = getShowMenuList(item.children));
		return !item.meta?.isHide;
	});
}

/**
 * @description 扁平化数组对象(主要用来处理路由菜单)
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getFlatArr(menuList: Menu.MenuOptions[]) {
	const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
		let flatArr = [...pre, current];
		if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
		return flatArr;
	}, []);
}

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export function getType(val: any) {
	if (val === null) return 'null';
	if (typeof val !== 'object') return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description 递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 所有菜单列表
 * @param {Object} result 输出的结果
 * @param {Array} parent 父级菜单
 * @returns object
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], result: { [key: string]: any } = {}, parent = []) => {
	for (const item of menuList) {
		result[item.path] = [...parent, item];
		if (item.children) getAllBreadcrumbList(item.children, result, result[item.path]);
	}
	return result;
};

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop: string) {
	const propArr = prop.split('.');
	if (propArr.length === 1) return prop;
	return propArr[propArr.length - 1];
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
	if (!prop.includes('.')) return row[prop] ?? '--';
	prop.split('.').forEach(item => (row = row[item] ?? '--'));
	return row;
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: 'tag') {
	const value = fieldNames?.value ?? 'value';
	const label = fieldNames?.label ?? 'label';
	const children = fieldNames?.children ?? 'children';
	let filterData: { [key: string]: any } = {};
	// 判断 enumData 是否为数组
	if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
	// 判断是否输出的结果为 tag 类型
	if (type === 'tag') {
		return filterData?.tagType ? filterData.tagType : '';
	} else {
		return filterData ? filterData[label] : '--';
	}
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
	return enumData.reduce((accumulator: any, current: any) => {
		if (accumulator) return accumulator;
		if (current[value] === callValue) return current;
		if (current[children]) return findItemNested(current[children], callValue, value, children);
	}, null);
}

/**
 * @description 处理值无数据情况
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any) {
	// 如果当前值为数组，使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--';
	return callValue ?? '--';
}
