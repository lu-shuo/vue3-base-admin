<template>
	<template v-for="subItem in menuList" :key="subItem.name">
		<el-sub-menu v-if="subItem.children && subItem.children.length" :index="subItem.path">
			<template #title>
				<el-icon>
					<component :is="subItem.meta.icon"></component>
				</el-icon>
				<span>{{ subItem.meta.title }}</span>
			</template>
			<SubMenu :menuList="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
			<el-icon>
				<component :is="subItem.meta.icon"></component>
			</el-icon>
			<template #title>
				<span>{{ subItem.meta.title }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script lang="ts" setup name="SubMenu">
defineProps<{ menuList: Menu.MenuOptions[] }>();
const router = useRouter();
const handleClickMenu = (subItem: Menu.MenuOptions) => {
	if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank');
	router.push(subItem.path);
};
</script>
