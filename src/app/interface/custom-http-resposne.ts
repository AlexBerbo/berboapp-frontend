import { Customer } from "./customer";

export interface CustomHttpResponse<T> {
    status: string;
    statusCode: number;
    timeStamp: Date;
    reason: string;
    message: string;
    developerMessage?: string;
    data?: T
}

export interface Page {
    content: Customer[];
    totalPages: number,
    totalElements: number;
    numberOfElements: number;
    size: number;
    number: number;
}
