<template>
	<div class="header-right">
		<div class="header-icon">
			<!-- <AssemblySize id="assemblySize" /> -->
			<Language id="language" />
			<!-- <SearchMenu id="searchMenu" /> -->
			<ThemeSetting id="themeSetting" />
			<!-- <Message id="message" /> -->
			<Fullscreen id="fullscreen" />
		</div>
		<span class="username">{{ username }}</span>
		<Avatar />
	</div>
</template>

<script setup lang="ts" name="HeaderRight">
import { useUserStore } from '@/stores/modules/user';
// import SearchMenu from "./components/SearchMenu.vue";
import Fullscreen from './components/Fullscreen.vue';
// import Message from "./components/Message.vue";
import Language from './components/Language.vue';
import ThemeSetting from './components/ThemeSettings.vue';
// import AssemblySize from "./components/AssemblySize.vue";
import Avatar from './components/Avatar.vue';

const userStore = useUserStore();
const username = computed(() => userStore.userInfo.name);
</script>

<style scoped lang="scss">
.header-right {
	display: flex;
	align-items: center;
	justify-content: center;
	.header-icon {
		display: flex;
		align-items: center;
		& > * {
			margin-left: 21px;
		}
	}
	.username {
		margin: 0 20px;
		font-size: 15px;
	}
}
</style>
