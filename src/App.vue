<template>
	<router-view></router-view>
	<GlobalUploader />
</template>

<script lang="ts" setup name="app">
import { useTheme } from '@/hooks/useTheme';
import GlobalUploader from '@/components/GlobalUploader/indexNew.vue';

// 初始化主题配置
const { initTheme } = useTheme();
initTheme();
</script>

<style scoped></style>
