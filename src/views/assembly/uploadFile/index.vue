<template>
	<div class="upload-file card">
		<div class="file-box">
			<p class="title">文件资源库</p>

			<!-- todo 已上传的文件列表 -->

			<div v-if="!fileList.length" class="empty">
				<el-empty>
					<template #description>
						<p>暂无文件，请先<a class="upload" @click="upload">上传</a></p>
					</template>
				</el-empty>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Bus from '@/utils/mittBus';

const fileList = ref([]);

const upload = () => {
	// 打开文件选择框
	Bus.emit('openUploader', {
		// 给服务端的额外参数
		params: {
			page: 'home'
		},
		options: {
			target: 'http://localhost:3000/upload'
		}
	});
};

onMounted(() => {
	// 文件选择后的回调
	Bus.on('fileAdded', () => {
		console.log('文件已选择');
	});

	// 文件上传成功的回调
	Bus.on('fileSuccess', () => {
		console.log('文件上传成功');
	});
});

onBeforeUnmount(() => {
	Bus.off('fileAdded');
	Bus.off('fileSuccess');
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
