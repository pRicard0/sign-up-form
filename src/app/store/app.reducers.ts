import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.state";
import { userReducer } from "./user.reducer";

export const appReducers: ActionReducerMap<AppState> = {
    usersState: userReducer
}