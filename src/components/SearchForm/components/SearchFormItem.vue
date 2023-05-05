<template>
	<!-- TODO:https://github.com/antfu/unplugin-vue-components/issues/556 -->
	<!-- auto import 无法识别动态组件 -->
	<!-- <component
		v-if="column.search?.el"
		v-bind="{ ...handleSearchProps, ...placeholder }"
		v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
		:is="`el-${column.search.el}`"
		:data="column.search?.el === 'tree-select' ? columnEnum : []"
		:options="['cascader', 'select-v2'].includes(column.search?.el) ? columnEnum : []"
		:clearable="clearable"
	>
		<template #default="{ data }" v-if="column.search.el === 'cascader'">
			<span>{{ data[fieldNames.label] }}</span>
		</template>
		<template v-if="column.search.el === 'select'">
			<component
				:is="`el-option`"
				v-for="(col, index) in columnEnum"
				:key="index"
				:label="col[fieldNames.label]"
				:value="col[fieldNames.value]"
			></component>
		</template>
		<slot v-else></slot>
	</component> -->
	<template v-if="column.search?.el">
		<el-input
			v-if="column.search.el === 'input'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-input>
		<el-input-number
			v-if="column.search.el === 'input-number'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-input-number>
		<el-select
			v-if="column.search.el === 'select'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<el-option
				v-for="(col, index) in columnEnum"
				:key="index"
				:label="col[fieldNames.label]"
				:value="col[fieldNames.value]"
			></el-option>
		</el-select>
		<el-select-v2
			v-if="column.search.el === 'select-v2'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
			:options="columnEnum"
		>
			<slot />
		</el-select-v2>
		<el-tree-select
			v-if="column.search.el === 'tree-select'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-tree-select>
		<el-cascader
			v-if="column.search.el === 'cascader'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
			:options="columnEnum"
		>
			<template #default="{ data }">
				<span>{{ data[fieldNames.label] }}</span>
			</template>
		</el-cascader>
		<el-date-picker
			v-if="column.search.el === 'date-picker'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-date-picker>
		<el-time-picker
			v-if="column.search.el === 'time-picker'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-time-picker>
		<el-time-select
			v-if="column.search.el === 'time-select'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-time-select>
		<el-switch
			v-if="column.search.el === 'switch'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-switch>
		<el-slider
			v-if="column.search.el === 'slider'"
			v-bind="{ ...handleSearchProps, ...placeholder }"
			v-model.trim="searchParams[column.search.key ?? handleProp(column.prop!)]"
			:clearable="clearable"
		>
			<slot />
		</el-slider>
	</template>
</template>

<script setup lang="ts" name="SearchFormItem">
import { computed, inject, ref } from 'vue';
import { handleProp } from '@/utils';
import { ColumnProps } from '@/components/ProTable/interface';

interface SearchFormItem {
	column: ColumnProps;
	searchParams: { [key: string]: any };
}
const props = defineProps<SearchFormItem>();

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
	return {
		label: props.column.fieldNames?.label ?? 'label',
		value: props.column.fieldNames?.value ?? 'value',
		children: props.column.fieldNames?.children ?? 'children'
	};
});

// 接收 enumMap (el 为 select-v2 需单独处理 enumData)
const enumMap = inject('enumMap', ref(new Map()));
const columnEnum = computed(() => {
	let enumData = enumMap.value.get(props.column.prop);
	if (!enumData) return [];
	if (props.column.search?.el === 'select-v2' && props.column.fieldNames) {
		enumData = enumData.map((item: { [key: string]: any }) => {
			return { ...item, label: item[fieldNames.value.label], value: item[fieldNames.value.value] };
		});
	}
	return enumData;
});

// 处理透传的 searchProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleSearchProps = computed(() => {
	const label = fieldNames.value.label;
	const value = fieldNames.value.value;
	const children = fieldNames.value.children;
	const searchEl = props.column.search?.el;
	let searchProps = props.column.search?.props ?? {};
	if (searchEl === 'tree-select') {
		searchProps = { ...searchProps, props: { ...searchProps.props, label, children }, nodeKey: value };
	}
	if (searchEl === 'cascader') {
		searchProps = { ...searchProps, props: { ...searchProps.props, label, value, children } };
	}
	return searchProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
	const search = props.column.search;
	if (['datetimerange', 'daterange', 'monthrange'].includes(search?.props?.type) || search?.props?.isRange) {
		return { rangeSeparator: '至', startPlaceholder: '开始时间', endPlaceholder: '结束时间' };
	}
	const placeholder = search?.props?.placeholder ?? (search?.el.includes('input') ? '请输入' : '请选择');
	return { placeholder };
});

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = computed(() => {
	const search = props.column.search;
	return search?.props?.clearable ?? (search?.defaultValue === null || search?.defaultValue === undefined);
});
</script>
