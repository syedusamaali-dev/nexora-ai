import { Component, inject } from '@angular/core';
import { IndustryService } from '../../core/services/industry.service';
import { Industry } from '../../core/models/industry.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  readonly industryService = inject(IndustryService);

  selectIndustry(industry: Industry): void {
    this.industryService.setIndustry(industry);
  }
}