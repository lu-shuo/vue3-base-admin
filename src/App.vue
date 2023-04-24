<template>
	<el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
		<router-view></router-view>
	</el-config-provider>
</template>

<script lang="ts" setup name="app">
import { useI18n } from 'vue-i18n';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/modules/app';
import { getBrowserLang } from '@/utils';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const appStore = useAppStore();

// 初始化主题配置
const { initTheme } = useTheme();
initTheme();

// init language
const i18n = useI18n();
onMounted(() => {
	const language = appStore.language ?? getBrowserLang();
	i18n.locale.value = language;
	appStore.setAppState('language', language);
});

// element language
const locale = computed(() => {
	if (appStore.language === 'zh') return zhCn;
	if (appStore.language === 'en') return en;
	return getBrowserLang() === 'zh' ? zhCn : en;
});

// element assemblySize
const assemblySize = computed(() => appStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });
</script>
