import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Explore } from './components/explore/explore';
import { HowWorks } from './components/how-works/how-works';
import { SearchBar } from './components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [Hero, SearchBar, Explore, HowWorks],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
