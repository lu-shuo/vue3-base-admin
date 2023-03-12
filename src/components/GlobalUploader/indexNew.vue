<template>
	<div id="global-uploader" :class="{ 'global-uploader-single': !global }">
		<uploader
			ref="uploaderRef"
			class="uploader-app"
			:options="initOptions"
			:file-status-text="fileStatusText"
			:auto-start="false"
			@file-added="onFileAdded"
			@file-success="onFileSuccess"
			@file-progress="onFileProgress"
			@file-error="onFileError"
		>
			<!-- 替换默认插槽 -->
			<uploader-unsupport></uploader-unsupport>
			<!-- 页面内使用时展示，全局使用时隐藏 -->
			<uploader-btn id="global-uploader-btn" ref="uploadBtnRef">选择文件</uploader-btn>

			<uploader-list v-show="panelShow">
				<template #default="{ fileList }">
					<div class="file-panel" :class="{ collapse: collapse }">
						<div class="file-title">
							<div class="title">文件列表</div>
							<div class="operate">
								<el-button :title="collapse ? '展开' : '折叠'" link @click="collapse = !collapse">
									<el-icon :size="18">
										<component :is="collapse ? 'FullScreen' : 'Minus'"></component>
									</el-icon>
								</el-button>
								<el-button title="关闭" link @click="close">
									<el-icon :size="20"><Close /></el-icon>
								</el-button>
							</div>
						</div>

						<ul class="file-list">
							<li v-for="file in fileList" :key="file.id" class="file-item">
								<uploader-file ref="files" :class="['file_' + file.id, customStatus]" :file="file" :list="true"></uploader-file>
							</li>
							<div v-if="!fileList.length" class="no-file">
								<el-icon><Files /></el-icon> 暂无待上传文件
							</div>
						</ul>
					</div>
				</template>
			</uploader-list>
		</uploader>
	</div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue';
import { useFileStatus } from './useFileStatus';
import mittBus from '@/utils/mittBus';
import { generateMD5 } from '@/utils/md5';

const props = defineProps({
	global: {
		type: Boolean,
		default: true
	},
	params: Object,
	options: Object
});
const emits = defineEmits(['fileAdded', 'fileSuccess', 'fileFailed']);
const trigger = e => {
	mittBus.emit(e);
	emits(e);
};

const error = msg => {
	ElNotification({
		title: '错误',
		message: msg,
		type: 'error',
		duration: 2000
	});
};

// 文件状态hook
const { fileStatusText, customStatus, statusRemove, statusSet } = useFileStatus();

const uploaderRef = ref();
const uploaderIns = computed(() => uploaderRef.value?.uploader); // 内部实例化的uploader类实例
console.log(uploaderIns.value);

const uploadBtnRef = ref(); // 选择文件按钮（页面内使用时使用）
const panelShow = ref(false); // 显示面板
const collapse = ref(false); // 收缩面板

// 初始选项
const initOptions = {
	target: 'http://localhost:3000/upload',
	chunkSize: '2048000',
	fileParameterName: 'file',
	maxChunkRetries: 3,
	// 是否开启服务器分片校验
	testChunks: true,
	// 服务器分片校验函数，秒传及断点续传基础
	checkChunkUploadedByResponse(chunk, message) {
		let skip = false;

		try {
			const objMessage = JSON.parse(message);
			if (objMessage.skipUpload) {
				skip = true;
			} else {
				skip = (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
			}
		} catch (e) {}

		return skip;
	},
	query: file => {
		return {
			...file.params
		};
	}
};
let customParams = {}; // 自定义参数
let mergeFn = () => Promise.resolve(); // merge方法，返回promise
// 应用自定义参数
watch(
	() => props.params,
	data => {
		if (data) {
			customParams = data;
		}
	}
);
// 应用自定义选项
watch(
	() => props.options,
	newVal => {
		if (newVal) {
			setTimeout(() => {
				customizeOptions(newVal);
			}, 0);
		}
	}
);
const customizeOptions = opts => {
	// 自定义上传url
	if (opts.target) {
		uploaderIns.value.opts.target = opts.target;
	}
	// 是否可以秒传、断点续传
	if (opts.testChunks !== undefined) {
		uploaderIns.value.opts.testChunks = opts.testChunks;
	}
	// merge 的方法，类型为Function，返回Promise
	if (opts.mergeFn) {
		mergeFn = opts.mergeFn;
	}
	// 自定义文件上传类型
	if (opts.accept) {
		const input = document.querySelector('#global-uploader-btn input');
		input.setAttribute('accept', opts.accept.join());
	}
};

// 文件添加回调
const onFileAdded = async file => {
	panelShow.value = true;
	trigger('fileAdded');
	// 将额外的参数赋值到每个文件上，以不同文件使用不同params的需求
	file.params = customParams;
	// 计算MD5
	const md5 = await computeMD5(file);
	startUpload(file, md5);
};

// 计算md5
const computeMD5 = file => {
	// 文件状态设为"计算MD5"
	statusSet(file.id, 'md5');
	// 暂停文件
	file.pause();
	// 计算MD5时隐藏”开始“按钮
	nextTick(() => {
		const resumeBtn = document.querySelector(`.file-${file.id} .uploader-file-resume`);
		resumeBtn && (resumeBtn.style.display = 'none');
	});
	// 开始计算MD5
	return new Promise((resolve, reject) => {
		generateMD5(file, {
			onProgress(currentChunk, chunks) {
				// 实时展示MD5的计算进度
				nextTick(() => {
					const md5ProgressText = '校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%';
					document.querySelector(`.custom-status-${file.id}`).innerText = md5ProgressText;
				});
			},
			onSuccess(md5) {
				statusRemove(file.id);
				resolve(md5);
			},
			onError() {
				error(`文件${file.name}读取出错，请检查该文件`);
				file.cancel();
				statusRemove(file.id);
				reject();
			}
		});
	});
};

// md5计算完毕，开始上传
function startUpload(file, md5) {
	file.uniqueIdentifier = md5;
	file.resume();
}
// 成功回调
// 一个文件上传成功事件，第一个参数 rootFile 就是成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件；
// 第二个参数 file 就是当前成功的 Uploader.File 对象本身；
// 第三个参数就是 message 就是服务端响应内容，永远都是字符串；
// 第四个参数 chunk 就是 Uploader.Chunk 实例，它就是该文件的最后一个块实例，如果你想得到请求响应码的话，chunk.xhr.status 就是。

const onFileSuccess = (rootFile, file, response) => {
	const res = JSON.parse(response);

	// 服务端自定义的错误（即http状态码为200，但是是错误的情况），这种错误是Uploader无法拦截的
	if (!res.result) {
		error(res.message);
		// 文件状态设为“失败”
		statusSet(file.id, 'failed');
		return;
	}

	// 如果服务端返回了需要合并的参数
	if (res.needMerge) {
		// 文件状态设为“合并中”
		statusSet(file.id, 'merging');
		mergeFn({
			tempName: res.tempName,
			fileName: file.name,
			...file.params
		})
			.then(() => {
				// 文件合并成功
				trigger('fileSuccess');

				statusRemove(file.id);
			})
			.catch(() => {});

		// 不需要合并
	} else {
		trigger('fileSuccess');
		console.log('上传成功');
	}
};

function onFileProgress(rootFile, file, chunk) {
	console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`);
}

function onFileError(rootFile, file, response) {
	trigger('fileFailed');
	error(response);
}

const close = () => {
	uploaderIns.value.cancel();
	panelShow.value = false;
};

onMounted(() => {
	mittBus.on('openUploader', ({ params = {}, options = {} }) => {
		customParams = params;
		customizeOptions(options);
		if (uploadBtnRef.value) {
			uploadBtnRef.value.$el.click();
		}
	});
});
</script>

<script>
export default {
	name: 'GlobalUploader'
};
</script>

<style lang="scss">
@import './index.scss';
</style>
