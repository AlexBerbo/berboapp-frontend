import { DataState } from "../enum/datastate.enum";

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
