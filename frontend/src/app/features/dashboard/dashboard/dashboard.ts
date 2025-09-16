import { Component, inject } from '@angular/core';
import { IndustryService } from '../../../core/services/industry.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  readonly industryService = inject(IndustryService);

}