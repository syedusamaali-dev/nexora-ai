import { Injectable, effect, inject } from '@angular/core';
import { IndustryService } from './industry.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly industryService = inject(IndustryService);

  constructor() {
    effect(() => {
      const industry = this.industryService.currentIndustry();

      document.body.classList.remove(
        'theme-healthcare',
        'theme-finance'
      );

      document.body.classList.add(`theme-${industry}`);
    });
  }
}