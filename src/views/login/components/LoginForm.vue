<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="用户名：admin / user">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" placeholder="密码：123456" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">重置</el-button>
		<el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
			登录
		</el-button>
	</div>
</template>

<script lang="ts" setup name="LoginForm">
import type { FormInstance, FormRules } from 'element-plus';
import { loginApi } from '@/api/modules/login';
import { useAppStore } from '@/stores/modules/app';
import { HOME_URL } from '@/config/router';
import { getTimeState } from '@/utils/utils';
import { CircleClose, UserFilled } from '@element-plus/icons-vue';
import { initDynamicRouter } from '@/routers/modules/dynamicRoutes';
import md5 from 'js-md5';

const router = useRouter();

const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
	username: '',
	password: ''
});

const loginRules = reactive<FormRules>({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});

const loading = ref(false);
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl?.validate(async valid => {
		if (valid) {
			loading.value = true;
			const appStore = useAppStore();
			try {
				// 1.执行登录接口
				const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
				appStore.setToken(data.access_token);

				// 2.添加动态路由
				await initDynamicRouter();

				// 3.清空 tabs、keepAlive 保留的数据
				// tabsStore.closeMultipleTab();
				// keepAlive.setKeepAliveName();

				// 4.跳转到首页
				router.push(HOME_URL);
				ElNotification({
					title: getTimeState(),
					message: `欢迎登录 ${import.meta.env.VITE_GLOB_APP_TITLE}`,
					type: 'success',
					duration: 3000
				});
			} finally {
				loading.value = false;
			}
		}
	});
};
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
