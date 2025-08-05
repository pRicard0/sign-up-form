import { createAction, props } from "@ngrx/store";

const getCountries = createAction('[Countries] Get Countries')
const loadedCountries = createAction('[Countries] Loaded Countries', props<{ countries: Country[]}>())

const getStatesByCountryId = createAction('[Countries] Get Countries by ID')
const loadedStatesByCountryId = createAction('[Countries] Loaded States by Country ID')

export const countryActions = {
    getCountries,
    loadedCountries,
    getStatesByCountryId,
    loadedStatesByCountryId
}