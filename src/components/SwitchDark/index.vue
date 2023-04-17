<template>
	<el-switch v-model="appStore.isDark" inline-prompt :active-icon="Sunny" :inactive-icon="Moon" @change="switchDark" />
</template>

<script lang="ts" setup name="SwitchDark">
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useAppStore } from '@/stores/modules/app';
import { useTheme } from '@/hooks/useTheme';

const appStore = useAppStore();
const { switchDark } = useTheme();
</script>
