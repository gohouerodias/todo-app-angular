import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { SideBar } from './side-bar/side-bar';
import { Main } from './main/main';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    SideBar,
    Main],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('todo-app');
}
