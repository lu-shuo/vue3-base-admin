<template>
	<div class="home card">
		<img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" />
		<el-button class="logout" type="primary" @click="logout">退出登录</el-button>
	</div>
</template>

<script setup lang="ts" name="home">
import { logoutApi } from '@/api/modules/login';
import { useAppStore } from '@/stores/modules/app';
import { LOGIN_URL } from '@/config/router';

const appStore = useAppStore();
const router = useRouter();

// 临时测试退出
const logout = () => {
	ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(async () => {
		// 1.调用退出登录接口
		await logoutApi();
		// 2.清除 Token
		appStore.setToken('');
		// 3.重定向到登陆页
		router.replace(LOGIN_URL);
		ElMessage.success('退出登录成功！');
	});
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
