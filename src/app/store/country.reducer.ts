import { createReducer, on } from "@ngrx/store";
import { countryActions } from "./country.actions";

enum LoadStatus {
    loading = 'loading',
    pending = 'pending',
    error = 'error',
    success = 'success'
}

export interface CountryState {
    countries: Country[];
    states: State[]
    error: string | null;
    status: LoadStatus
}

const initialState: CountryState = {
    countries: [],
    states: [],
    error: null,
    status: LoadStatus.pending
}

export const countryReducer = createReducer(
    initialState,

    on(countryActions.getCountries, (state) => ({
        ...state,
        status: LoadStatus.loading
    })),

    on(countryActions.loadedCountries, (state, { countries}) => ({
        ...state,
        countries: countries,
        status: LoadStatus.success
    }))
)