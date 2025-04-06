import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { provideTheming, themingInitializer } from '@fundamental-ngx/core/theming';
import { provideAnimations } from '@angular/platform-browser/animations';
import {authInterceptor} from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTheming({
      defaultTheme: 'sap_horizon',
      changeThemeOnQueryParamChange: false
    }),
    themingInitializer(),
    provideAnimations(),
  ],
};
