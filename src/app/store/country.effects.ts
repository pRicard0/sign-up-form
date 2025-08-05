import { inject } from "@angular/core"
import { createEffect, Actions, ofType } from "@ngrx/effects"
import { switchMap, map } from "rxjs"
import { CountryService } from "../services/country.service"
import { countryActions } from "./country.actions"

export const getCountriesEffect = createEffect(
    (actions = inject(Actions), countryService = inject(CountryService)) => {
        return actions.pipe(
            ofType(countryActions.getCountries),
            switchMap(() => countryService.getCountries().pipe(
                map(countries => countryActions.loadedCountries({ countries }))
            ))
        )
    }
)

