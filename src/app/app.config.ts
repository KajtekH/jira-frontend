import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideTheming, themingInitializer } from '@fundamental-ngx/core/theming';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideTheming({ defaultTheme: 'sap_horizon', changeThemeOnQueryParamChange: false }), themingInitializer(), provideAnimations()],
};
