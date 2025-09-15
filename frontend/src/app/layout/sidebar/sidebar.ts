import { Component, inject } from '@angular/core';
import { IndustryService } from '../../core/services/industry.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  readonly industryService = inject(IndustryService);

}