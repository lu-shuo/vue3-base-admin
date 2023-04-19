import { ResponseCode } from '@/api/interface';

/**
 * @description 接收数据流生成blob，创建链接，下载文件
 * @param {Function} api 导出表格的api方法(必传)
 * @param {Object} params 导出的参数(默认为空对象)
 * @param {String} fileName 导出的文件名(必传)
 * @param {String} fileType 导出的文件格式(默认为.xlsx)
 * @param {String} isMessage 是否有成功提示(默认为 true)
 * @param {Boolean} isNotify 是否有导出消息提示(默认为 true)
 * @param {String} prompt 是否有导出消息提示(默认为 true)
 * @return void
 * */
export const useDownload = async (
	api: (param: any) => Promise<any>,
	params: any = {},
	fileName: string,
	fileType: string = '.xlsx',
	isMessage: boolean = true,
	isNotify: boolean = true,
	prompt: string = '如果数据庞大会导致下载缓慢哦，请您耐心等待'
) => {
	let noticeIns: any = null;
	if (isNotify) {
		noticeIns = ElNotification({
			title: '温馨提示',
			message: prompt,
			type: 'info',
			duration: 3000
		});
	}
	try {
		let res = await api(params);
		const reader = new FileReader();
		reader.readAsText(res, 'utf-8');
		reader.onload = () => {
			try {
				res = JSON.parse(reader.result as string);
				if (res.code !== ResponseCode.SUCCESS) {
					noticeIns && noticeIns.close();
					ElMessage({
						type: 'error',
						message: res.message || '下载失败',
						showClose: true
					});
				}
			} catch (e) {
				const blob = new Blob([res]);
				// 兼容edge不支持createObjectURL方法
				if ('msSaveOrOpenBlob' in navigator) return window.navigator.msSaveOrOpenBlob(blob, fileName + fileType);
				const a = document.createElement('a');
				a.style.display = 'none';
				a.href = window.URL.createObjectURL(blob);
				a.download = `${fileName}${fileType}`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(a.href);
				isMessage && ElMessage({ type: 'success', message: '下载成功', showClose: true });
			}
		};
	} catch (error) {
		console.error(error);
	}
};
