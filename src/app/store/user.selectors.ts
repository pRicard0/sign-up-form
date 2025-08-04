import { AppState } from "./app.state";
import { createSelector } from '@ngrx/store';

export const selectUserState = (state: AppState) => state.usersState;

export const usersSelector = createSelector(
  selectUserState,
  (state) => state.users
);

export const userDetailsSelector = createSelector(
  selectUserState,
  (state) => state.loggedUser
);

export const paginatedUsersSelector = createSelector(
  usersSelector,
  (state: AppState) => state.usersState.page,
  (state: AppState) => state.usersState.pageSize,
  (users, page, pageSize) => {
    const start = page * pageSize;
    return users.slice(start, start + pageSize);
  }
);