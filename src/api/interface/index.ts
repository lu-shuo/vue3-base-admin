export enum ResponseCode {
	SUCCESS = 200,
	ERROR = 500,
	OVERDUE = 401
}

export interface Result<T = any> {
	status?: number;
	code: ResponseCode;
	message: string;
	data: T;
}
