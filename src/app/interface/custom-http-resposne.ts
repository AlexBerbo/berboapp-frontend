export interface CustomHttpResponse<T> {
    status: string;
    statusCode: number;
    timeStamp: Date;
    reason: string;
    message: string;
    developerMessage?: string;
    data?: T
}
