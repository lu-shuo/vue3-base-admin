<template>
	<router-view></router-view>
</template>

<script lang="ts" setup name="app">
import { useTheme } from '@/hooks/useTheme';
// 初始化主题配置
const { initTheme } = useTheme();
initTheme();
</script>

<style scoped></style>
