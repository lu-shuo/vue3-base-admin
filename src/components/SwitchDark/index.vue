<template>
	<el-switch
		v-model="globalStore.themeConfig.isDark"
		inline-prompt
		:active-icon="Sunny"
		:inactive-icon="Moon"
		@change="switchDark"
	/>
</template>

<script lang="ts" setup name="SwitchDark">
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useGlobalStore } from '@/stores';
import { useTheme } from '@/hooks/useTheme';

const globalStore = useGlobalStore();
const { switchDark } = useTheme();
</script>
