import { User } from "./user";

export interface Profile {
    user?: User;
    jwt_token: string;
    refresh_token: string; 
}