// @ts-nocheck
import SparkMD5 from 'spark-md5';

/**
 * 分段计算MD5
 * @param file {File}
 * @param callbacks {Object} - onProgress | onSuccess | onError
 */
export function generateMD5(file: File, callbacks = {}, chunkSize = 10 * 1024 * 1000) {
	const fileReader = new FileReader();
	const time = new Date().getTime();
	const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
	const chunks = Math.ceil(file.size / chunkSize);
	let currentChunk = 0;
	const spark = new SparkMD5.ArrayBuffer();
	const loadNext = () => {
		const start = currentChunk * chunkSize;
		const end = start + chunkSize >= file.size ? file.size : start + chunkSize;

		fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
	};

	loadNext();

	// 当文件成功读取时，执行load 事件
	fileReader.onload = e => {
		spark.append(e.target.result);

		if (currentChunk < chunks) {
			currentChunk++;
			loadNext();
			if (callbacks.onProgress && typeof callbacks.onProgress === 'function') {
				callbacks.onProgress(currentChunk, chunks);
			}
		} else {
			const md5 = spark.end();

			// md5计算完毕
			if (callbacks.onSuccess && typeof callbacks.onSuccess === 'function') {
				callbacks.onSuccess(md5);
			}

			console.log(
				`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`
			);
		}
	};

	fileReader.onerror = function () {
		console.error('MD5计算失败');
		if (callbacks.onError && typeof callbacks.onError === 'function') {
			callbacks.onError();
		}
	};
}
