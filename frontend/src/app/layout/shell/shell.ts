import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Dashboard } from '../../features/dashboard/dashboard/dashboard';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Sidebar,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {}