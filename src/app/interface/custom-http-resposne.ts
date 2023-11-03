import { Customer } from "./customer";
import { Role } from "./role";
import { User } from "./user";

export interface CustomHttpResponse<T> {
    status: string;
    statusCode: number;
    timeStamp: Date;
    reason: string;
    message: string;
    developerMessage?: string;
    data?: T
}

export interface Page<T> {
    content: T[];
    totalPages: number,
    totalElements: number;
    numberOfElements: number;
    size: number;
    number: number;
}

export interface CustomerState {
    user: User;
    customer: Customer;
}

export interface EventState {
    user: User;
    event: Event;
    roles: Role[];
}
