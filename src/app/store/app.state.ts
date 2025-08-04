import { User } from "../interfaces/user";
import { UserState } from "./user.reducer";

export interface AppState { 
    usersState: UserState
}