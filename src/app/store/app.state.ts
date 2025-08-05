import { User } from "../interfaces/user";
import { CountryState } from "./country.reducer";
import { UserState } from "./user.reducer";

export interface AppState { 
    usersState: UserState
    countriesState: CountryState
}