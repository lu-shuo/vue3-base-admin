<template>
	<div :style="style" v-show="isShow">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup name="GridItem">
import { Ref } from 'vue';
import { BreakPoint, Responsive } from '../interface/index';

type Props = {
	offset?: number;
	span?: number;
	suffix?: boolean;
	xs?: Responsive;
	sm?: Responsive;
	md?: Responsive;
	lg?: Responsive;
	xl?: Responsive;
};

const props = withDefaults(defineProps<Props>(), {
	offset: 0,
	span: 1,
	suffix: false,
	xs: undefined,
	sm: undefined,
	md: undefined,
	lg: undefined,
	xl: undefined
});

const attrs = useAttrs() as any; // 获取组件绑定的属性，这里为了拿index

const isShow = ref(true);

// 注入断点
const breakPoint = inject<Ref<BreakPoint>>('breakPoint', ref('xl'));
// 注入计算出的需要隐藏的index
const shouldHiddenIndex = inject<Ref<number>>('shouldHiddenIndex', ref(-1));
// 判断当前项目是否显示
watch(
	() => [shouldHiddenIndex.value, breakPoint.value],
	newVal => {
		if (!!attrs.index) {
			// 如果有标识索引，则隐藏大于shouldHiddenIndex的项目
			isShow.value = !(newVal[0] !== -1 && parseInt(attrs.index) >= Number(newVal[0]));
		}
	},
	{ immediate: true }
);

// 注入gap， cols
const gap = inject('gap', 0);
const cols = inject<Ref<number>>('cols', ref(4));

// 定义style
// * grid-column: grid-column-start和grid-column-end的合并简写形式
// grid-column-start属性：左边框所在的垂直网格线
// grid-column-end属性：右边框所在的垂直网格线
// * grid-row: grid-row-start和grid-row-end的合并简写形式
// grid-row-start属性：上边框所在的水平网格线
// grid-row-end属性：下边框所在的水平网格线
// span关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格
const style = computed(() => {
	const span = props[breakPoint.value]?.span ?? props.span;
	const offset = props[breakPoint.value]?.offset ?? props.offset;
	if (props.suffix) {
		return {
			gridColumnStart: cols.value - span - offset + 1, // 左边框所在的垂直网格线
			gridColumnEnd: `span ${span + offset}`, // 跨度
			marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : 'unset' // margin的百分比相对于自身的宽度，按比例计算出每一个“跨度”的宽度 * offset
		};
	} else {
		return {
			gridColumn: `span ${span + offset > cols.value ? cols.value : span + offset}/span ${
				span + offset > cols.value ? cols.value : span + offset
			}`,
			marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : 'unset'
		};
	}
});
</script>
