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

export const filtersSelector = createSelector(
  selectUserState,
  (state) => state.filters
);

export const paginatedUsersSelector = createSelector(
  usersSelector,
  filtersSelector,
  selectUserState,
  (users, filters, state) => {
    const filtered = users.filter(user => {
      const isNotLoggedUser = user.email !== state.loggedUser?.email;
      const countryMatch = !filters.country || user.country === filters.country.name;
      const stateMatch = !filters.state || user.state === filters.state.name;
      return isNotLoggedUser && countryMatch && stateMatch;
    });

    const startIndex = state.page * state.pageSize;
    return filtered.slice(startIndex, startIndex + state.pageSize);
  }
);

export const usersLengthSelector = createSelector(
  usersSelector,
  filtersSelector,
  (users, filters) => {
    return users.filter(user => {
      const countryMatch = !filters.country || user.country === filters.country.name;
      const stateMatch = !filters.state || user.state === filters.state.name;
      return countryMatch && stateMatch;
    }).length;
  }
);