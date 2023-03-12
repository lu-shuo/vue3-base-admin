import { ref, nextTick } from 'vue';

export const useFileStatus = () => {
	const fileStatusText = {
		success: '上传成功',
		error: '上传失败',
		uploading: '上传中',
		paused: '已暂停',
		waiting: '等待上传'
	};

	const statusMap = {
		md5: {
			text: '校验MD5',
			bgc: '#fff'
		},
		merging: {
			text: '合并中',
			bgc: '#e2eeff'
		},
		transcoding: {
			text: '转码中',
			bgc: '#e2eeff'
		},
		failed: {
			text: '上传失败',
			bgc: '#e2eeff'
		}
	};

	const customStatus = ref('');

	const statusRemove = id => {
		customStatus.value = '';
		nextTick(() => {
			const statusTag = document.querySelector(`.custom-status-${id}`);
			statusTag.remove();
		});
	};
	/**
	 * 新增的自定义的状态: 'md5'、'merging'、'transcoding'、'failed'
	 * @param id
	 * @param status
	 */
	function statusSet(id, status) {
		customStatus.value = status;
		nextTick(() => {
			const statusTag = document.createElement('p');
			statusTag.className = `custom-status-${id} custom-status`;
			statusTag.innerText = statusMap[status].text;
			statusTag.style.backgroundColor = statusMap[status].bgc;

			const statusWrap = document.querySelector(`.file_${id} .uploader-file-status`);
			statusWrap.appendChild(statusTag);
		});
	}

	return {
		fileStatusText,
		customStatus,
		statusRemove,
		statusSet
	};
};
