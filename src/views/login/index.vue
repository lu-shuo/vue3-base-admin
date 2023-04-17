<template>
	<div class="login-container flx-center">
		<div class="login-box flx-justify-around">
			<SwitchDark class="dark" />
			<div class="login-left">
				<img src="@/assets/images/login_left.png" alt="login" />
			</div>
			<div class="login-form">
				<div class="login-logo">
					<img class="login-icon" src="@/assets/images/logo.svg" alt="" />
					<h2 class="logo-text">Base-Admin</h2>
				</div>
				<LoginForm />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="login">
import SwitchDark from '@/components/SwitchDark/index.vue';
import LoginForm from './components/LoginForm.vue';
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
