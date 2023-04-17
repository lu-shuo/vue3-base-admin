<template>
	<LayoutVertical />
	<ThemeDrawer />
</template>

<script lang="ts" setup name="layout">
import LayoutVertical from './LayoutVertical/index.vue';
import ThemeDrawer from './components/ThemeDrawer/index.vue';
</script>

<style lang="scss" scoped>
.layout {
	min-width: 730px;
}
</style>
