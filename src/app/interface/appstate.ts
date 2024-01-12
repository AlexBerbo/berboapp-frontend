import { DataState } from "../enum/datastate.enum";
import { Page } from "./custom-http-resposne";
import { Customer } from "./customer";
import { Invoice } from "./invoice";
import { ServiceCustomer } from "./service-customer";
import { Stats } from "./stats";
import { User } from "./user";

export interface LoginState {
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsingMfa?: boolean;
    email?: string;
}

export interface RegisterState {
    dataState: DataState;
    registerSuccess?: boolean;
    error?: string;
    message?: string;
}

export type AccountType = 'account' | 'password';

export interface VerifyState {
    dataState: DataState;
    verifySuccess?: boolean;
    error?: string;
    message?: string;
    title?: string;
    type?: AccountType;
}

export interface InvoiceState {
    customer: Customer,
    invoice: Invoice,
    user: User
}

export interface PageInvoiceUserState<T> {
    page: Page<T>,
    user: User
}

export interface InvoiceCustomerUserState {
    customer: Customer[],
    user: User,
    serviceCustomer: ServiceCustomer;
}

export interface PageCustomerUserStatsState<T> {
    page: T,
    user: User,
    stats: Stats
}

export interface PageCustomerUserState<T> {
    page: T,
    user: User;
}

export interface PageServiceUserState<T> {
    page: Page<T>,
    user: User
}
