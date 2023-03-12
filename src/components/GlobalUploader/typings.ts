export interface CustomOptions {
	target?: string;
	chunkSize?: number;
	simultaneousUploads?: number; // 并发上传数，默认 3
	testChunks?: boolean; // 是否测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等，默认 true。
	accept?: string[]; // https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file#accept
	mergeFn?: () => Promise<any>;
}

export type UploaderEvents = 'fileAdded' | 'fileSuccess' | 'fileFailed';
