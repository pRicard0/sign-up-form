import { RegisterPostData } from "./registerPostData";

export interface User extends RegisterPostData {
    id: string;
}