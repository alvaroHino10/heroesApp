import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


function checkAuthStatus(): boolean | Observable<boolean> {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => {
          if (isAuthenticated) {
            console.log('Está autenticado no puede acceder a auth');
            router.navigate(['/heroes']);
          }
          else{
            console.log('No está autenticado para heroes pero puede acceder a auth');
          }
        }),
        map(isAuthenticated => !isAuthenticated)
      );
}

export const authCanActivate: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};

export const authCanMatch: CanMatchFn = (route: Route, urlSegments: UrlSegment[]) => {
  return checkAuthStatus();
};

export const authCanActivateChild: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};
