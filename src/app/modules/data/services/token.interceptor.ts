import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationDate;
    } catch (e) {
      return true; // If token is invalid, consider it expired
    }
  };

  const myToken = localStorage.getItem('token');

  if (myToken && isTokenExpired(myToken)) {
    localStorage.removeItem('token');
    router.navigateByUrl('login');
    return next(req);
  }

  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${myToken}`
    }
  });
  return next(cloneRequest);
};
