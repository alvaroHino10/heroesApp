import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/hero.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  standalone: false,

  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent implements OnInit {
  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  private destroy = new Subject<void>();
  public selectedHero?: Hero;

  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(3000),
        takeUntil(this.destroy)
      )
      .subscribe(() => this.searchHero());
  }

  searchHero(){
    const value = this.searchInput.value || '';
    this.heroesService.getSuggestions(value)
      .pipe(takeUntil(this.destroy))
      .subscribe(heroes => this.heroes = heroes);
    console.log({value});
    console.log({heroes: this.heroes});
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent){
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }
    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero = hero;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
