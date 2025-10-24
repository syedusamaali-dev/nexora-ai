import { Component, inject } from '@angular/core';
import { IndustryService } from '../../core/services/industry.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,
  RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  readonly industryService = inject(IndustryService);

}