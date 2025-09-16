import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Dashboard } from '../../features/dashboard/dashboard/dashboard';

@Component({
  selector: 'app-shell',
  imports: [Header, Sidebar, Dashboard],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {}