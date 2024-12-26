import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  standalone: false,

  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  });

  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      return;
    }
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.heroesService.getHeroById(id))
    ).subscribe(hero => {
      if (!hero) {
        return this.router.navigateByUrl('/');
      }
      this.heroForm.reset(hero);
      return;
    });

  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void{
    if(this.heroForm.invalid){
      return;
    }

    if (this.heroForm.value.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`Hero ${hero.superhero} updated!`);
          console.log('Hero created', hero)
        });
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.showSnackBar(`Hero ${hero.superhero} created!`);
        this.router.navigate(['/heroes/edit', hero.id]);
      });
  }

  showSnackBar(message: string): void{
    this.snackBar.open(message, 'ok!', {
      duration: 2500
    });
  }

  onDeleteHero(): void{
    if (!this.currentHero.id) {
      throw Error('Cannot delete a hero without id');
    }
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {data: this.heroForm.value});

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((result: boolean) => result),
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
    });
  }
}
