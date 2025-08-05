import { AppState } from "./app.state";

export const selectCountryState = (state: AppState) => state.countriesState;import { createSelector } from '@ngrx/store';

export const usersStateSelector = (state: AppState) => state.usersState;

export const usersSelector = createSelector(
  usersStateSelector,
  (state) => state.users
);

export const filtersSelector = createSelector(
  usersStateSelector,
  (state) => state.filters
);

export const filteredUsersSelector = createSelector(
  usersSelector,
  filtersSelector,
  (users, filters) => {
    return users.filter(user => {
      const countryMatch = !filters.country || user.country.toLowerCase() === filters.country.name.toLowerCase();
      const stateMatch = !filters.state || user.state.toLowerCase() === filters.state.name.toLowerCase();
      return countryMatch && stateMatch;
    });
  }
);