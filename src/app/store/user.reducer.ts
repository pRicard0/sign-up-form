import { createReducer, on } from "@ngrx/store"
import { User } from "../interfaces/user"
import { userActions } from "./user.actions"

export enum LoadStatus {
  loading = 'loading',
  pending = 'pending',
  error = 'error',
  success = 'success'
}

export interface UserState {
  users: User[];
  loggedUser: User | null;
  error: string | null;
  status: LoadStatus;
  loggedUserStatus: LoadStatus;
  deleteUserStatus: LoadStatus;
  filters: {
    country: string | null;
    state: string | null;
  }
  page: number;
  pageSize: number;
}

export const initialState: UserState = {
  users: [],
  loggedUser: null,
  error: null,
  status: LoadStatus.pending,
  loggedUserStatus: LoadStatus.pending,
  deleteUserStatus: LoadStatus.success,
  filters: {
    country: null,
    state: null
  },
  page: 0,
  pageSize: 6
};

export const userReducer = createReducer(
  initialState,

  on(userActions.getUsers, (state) => ({
    ...state,
    status: LoadStatus.loading
  })),

  on(userActions.loadedUsers, (state, { users }) => ({
    ...state,
    users,
    status: LoadStatus.success
  })),

  on(userActions.getUserDetails, (state) => ({
    ...state,
    loggedUserStatus: LoadStatus.loading
  })),

  on(userActions.loadedUserDetails, (state, { user }) => ({
    ...state,
    loggedUser: user ?? null,
    loggedUserStatus: LoadStatus.success
  })),

  on(userActions.deleteUser, (state) => ({
    ...state,
    deleteUserStatus: LoadStatus.pending
  })),

  on(userActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(user => user.id !== id),
    deleteUserStatus: LoadStatus.success
  })),

  on(userActions.setFilters, (state, { filters }) => ({
    ...state,
    filters
  })),

  on(userActions.setPage, (state, { page, pageSize }) => ({
    ...state,
    page,
    pageSize
  })),
);