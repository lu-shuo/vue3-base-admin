import { Confirm } from './interface/index';
import { ResponseCode } from '@/api/interface';

export const useConfirm = <P = any, R = any>(
	api: (params: P) => Promise<R>,
	params: Parameters<typeof api>[0],
	message: string,
	successMessage: string,
	errorMessage: string,
	title: string = '提示',
	type: Confirm.MessageType = 'warning',
	onCancel?: () => void
) => {
	return new Promise((resolve, reject) => {
		ElMessageBox.confirm(`是否${message}?`, title, {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type
		})
			.then(async () => {
				const res: any = await api(params);
				if (!res) return reject(false);
				if (res.code === ResponseCode.SUCCESS) {
					ElMessage({
						type: 'success',
						message: successMessage
					});
					resolve(true);
				} else {
					ElMessage({
						type: 'error',
						message: res.message || res.result || errorMessage
					});
					reject(false);
				}
			})
			.catch(() => {
				onCancel && onCancel();
			});
	});
};
