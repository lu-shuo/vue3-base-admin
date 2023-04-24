<template>
	<div :style="style">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup name="Grid">
// @See: https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html
import type { BreakPoint } from './interface';
import { VNodeArrayChildren } from 'vue';

type Props = {
	cols?: number | Record<BreakPoint, number>; // 列数
	collapsed?: boolean; // 是否折叠
	collapsedRows?: number; // 显示几行
	gap?: [number, number] | number; // [列间隔，行间隔] 与gap属性保持顺序一致
};

const props = withDefaults(defineProps<Props>(), {
	cols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
	collapsed: false,
	collapsedRows: 1,
	gap: 0
});

// 注入响应式断点
const breakPoint = ref<BreakPoint>('xl');
provide('breakPoint', breakPoint);

// 监听屏幕变化
const resize = (e: UIEvent) => {
	const width = (e.target as Window).innerWidth;
	switch (!!width) {
		case width < 768:
			breakPoint.value = 'xs';
			break;
		case width >= 768 && width < 992:
			breakPoint.value = 'sm';
			break;
		case width >= 992 && width < 1200:
			breakPoint.value = 'md';
			break;
		case width >= 1200 && width < 1920:
			breakPoint.value = 'lg';
			break;
		case width >= 1920:
			breakPoint.value = 'xl';
			break;
	}
};
onMounted(() => {
	resize({ target: { innerWidth: window.innerWidth } } as any);
	window.addEventListener('resize', useDebounceFn(resize, 100));
});
onActivated(() => {
	resize({ target: { innerWidth: window.innerWidth } } as any);
	window.addEventListener('resize', useDebounceFn(resize, 100));
});
onUnmounted(() => {
	window.removeEventListener('resize', resize);
});
onDeactivated(() => {
	window.removeEventListener('resize', resize);
});

// 注入 cols
const cols = computed(() => {
	if (typeof props.cols === 'object') return props.cols[breakPoint.value] ?? props.cols; // ??:前面的值为null、undefined，则取后面的值，否则都取前面的值。
	return props.cols;
});
provide('cols', cols);

// 注入要开始折叠的 index
const hiddenIndex = ref(-1);
provide('shouldHiddenIndex', hiddenIndex);

// 获取item
const slots = useSlots().default!(); // default 获取默认插槽

// 寻找需要开始折叠的字段 index
const findIndex = () => {
	const fields: VNodeArrayChildren = [];
	let suffix: any = null;
	slots.forEach((slot: any) => {
		// * slot为GridItem
		if (typeof slot.type === 'object' && slot.type.name === 'GridItem' && slot.props?.suffix !== undefined) suffix = slot;
		// * slot为v-for循环的GridItem。 type=Symbol(Fragment)
		if (typeof slot.type === 'symbol' && Array.isArray(slot.children)) slot.children.forEach((child: any) => fields.push(child));
	});

	// 计算 suffix 所占用的列
	let suffixCols = 0;
	if (suffix) {
		suffixCols =
			(suffix.props![breakPoint.value]?.span ?? suffix.props?.span ?? 1) +
			(suffix.props![breakPoint.value]?.offset ?? suffix.props?.offset ?? 0);
	}
	try {
		let find = false;
		fields.reduce((prev = 0, current, index) => {
			prev +=
				((current as VNode)!.props![breakPoint.value]?.span ?? (current as VNode)!.props?.span ?? 1) +
				((current as VNode)!.props![breakPoint.value]?.offset ?? (current as VNode)!.props?.offset ?? 0);
			if ((prev as number) > props.collapsedRows * cols.value - suffixCols) {
				hiddenIndex.value = index;
				find = true;
				throw 'find it';
			}
			return prev;
		}, 0);
		if (!find) hiddenIndex.value = -1;
	} catch (e) {
		// console.warn(e);
	}
};

// 断点变化时 执行 findIndex
watch(
	() => breakPoint.value,
	() => {
		if (props.collapsed) findIndex();
	}
);

// 监听 collapsed
watch(
	() => props.collapsed,
	value => {
		if (value) return findIndex();
		hiddenIndex.value = -1;
	}
);

// 注入行间距给GridItem
provide('gap', Array.isArray(props.gap) ? props.gap[1] : props.gap);

// 设置间距
const gap = computed(() => {
	if (typeof props.gap === 'number') return `${props.gap}px`;
	if (Array.isArray(props.gap)) return `${props.gap[0]}px ${props.gap[1]}px`;
	return 'unset';
});

// 设置 style
const style = computed(() => {
	return {
		display: 'grid',
		gridGap: gap.value, // grid-column-gap和grid-row-gap的合并简写形式
		gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))` // 均分
	};
});

defineExpose({ breakPoint });
</script>
