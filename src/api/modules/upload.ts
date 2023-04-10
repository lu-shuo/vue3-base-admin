import http from '@/api';
import { Upload } from '@/api/models/upload';
import { PORT1 } from '@/config/axios';

/**
 * @name 文件上传模块
 */
// * 图片上传
export const uploadImg = (params: FormData) => {
	return http.post<Upload.ResFileUrl>(PORT1 + '/file/upload/img', params);
};

// * 视频上传
export const uploadVideo = (params: FormData) => {
	return http.post<Upload.ResFileUrl>(PORT1 + '/file/upload/video', params);
};
