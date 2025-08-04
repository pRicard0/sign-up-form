import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../services/auth.service";
import { userActions } from "./user.actions";
import { catchError, map, switchMap, tap } from "rxjs";

export const getUsersEffect = createEffect(
  (actions = inject(Actions), authService = inject(AuthService)) => {
    return actions.pipe(
      ofType(userActions.getUsers),
      tap(() => console.log("passando pelo getusers")),
      switchMap(() => authService.getUsers().pipe(
          map(users => userActions.loadedUsers({ users }))
      ))
    )
  }, { functional: true }
)

export const getUserDetailsEffect = createEffect(
  (actions = inject(Actions), authService = inject(AuthService)) => {
    return actions.pipe(
      ofType(userActions.getUserDetails),
      tap(() => console.log("passando pelo getuserdetails")),
      switchMap(({ email }) =>
        authService.getUserDetails(email).pipe(
          map((users) => {
            const user = users[0];
            return userActions.loadedUserDetails({ user });
          })
        )
      )
    );
  },
  { functional: true }
);

export const deleteUserEffect = createEffect(
  (actions = inject(Actions), authService = inject(AuthService)) => {
    return actions.pipe(
      ofType(userActions.deleteUser),
      switchMap(({ id }) =>
        authService.deleteUser(id).pipe(
          map(() => userActions.deleteUserSuccess({ id }))
        )
      )
    );
  },
  { functional: true }
);
