<template>
	<el-dropdown trigger="click" @command="handleSetLanguage">
		<i :class="'iconfont icon-zhongyingwen'" class="toolBar-icon"></i>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item :disabled="language === 'zh'" command="zh">简体中文</el-dropdown-item>
				<el-dropdown-item :disabled="language === 'en'" command="en">English</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script lang="ts" setup name="Language">
import { useAppStore } from '@/stores/modules/app';
import { useI18n } from 'vue-i18n';
import { getBrowserLang } from '@/utils/utils';

const i18n = useI18n();
const appStore = useAppStore();

const language = computed(() => appStore.language);

// 切换语言
const handleSetLanguage = (lang: string) => {
	i18n.locale.value = lang;
	appStore.language = lang;
};

onMounted(() => {
	const lang = getBrowserLang();
	handleSetLanguage(language.value || lang);
});
</script>
