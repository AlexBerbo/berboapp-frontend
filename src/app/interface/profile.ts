import { Events } from "./event";
import { Role } from "./role";
import { User } from "./user";

export interface Profile {
    user?: User;
    event?: Events[],
    roles?: Role[],
    jwt_token?: string;
    refresh_token?: string; 
}