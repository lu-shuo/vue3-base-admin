export enum ResponseCode {
	SUCCESS = 0
}

export interface Result<T = any> {
	status: number;
	code: number;
	message: string;
	data: T;
}
