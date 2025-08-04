import { createAction, props } from "@ngrx/store";
import { User } from "../interfaces/user";

const getUserDetails = createAction('[Users] Get User details', props<{ email: string }>())
const getUsers = createAction('[Users] Get Users')

const loadedUsers = createAction('[Users] Loaded Users', props<{ users: User[]}>())
const loadedUserDetails = createAction('[Users] Loaded User details', props<{ user: User }>())

const deleteUser = createAction('[Users] Delete User', props<{ id: string }>());
const deleteUserSuccess = createAction('[Users] Delete User Success', props<{ id: string }>());

const setFilters = createAction('[Users] Set Filters', props<{ filters: { country: string | null; state: string | null } }>());

const setPage = createAction('[User] Set Page', props<{ page: number; pageSize: number }>());


export const userActions = {
    getUserDetails,
    getUsers,
    loadedUsers,
    loadedUserDetails,
    deleteUser,
    deleteUserSuccess,
    setFilters,
    setPage
}