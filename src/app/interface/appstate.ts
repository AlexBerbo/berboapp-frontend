import { DataState } from "../enum/datastate";

export interface LoginState {
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsingMfa?: boolean;
    email?: string;
}