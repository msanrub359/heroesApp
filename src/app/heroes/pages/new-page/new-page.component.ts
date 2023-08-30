import { switchMap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  constructor(private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbar:MatSnackBar,
    private dialog:MatDialog){}

  public heroForm=new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', {nonNullable:true}),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl('')
  })
  public publishers=[
    {id: 'DC Comics', desc:'DC - Comics'},
    {id: 'Marvel Comics', desc:'Marvel - Comics'}];

  get currentHero():Hero{
    const hero=this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (this.router.url.includes('edit')){
      this.activatedRoute.params
      .pipe(
        switchMap(({id})=>this.heroesService.getHeroById(id))
      )
      .subscribe(hero=>{
        if (!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        return;
      })
    }else{
      return;
    }
  }
  onSubmit():void{
   if (this.heroForm.invalid) {
    return;

   } else {
      if (this.currentHero.id){
        this.heroesService.updateHero(this.currentHero)
        .subscribe(hero=>{
          this.showSnackbar(`${hero.superhero} actualizado!`)
        })
      }else{
        this.heroesService.addHero(this.currentHero)
        .subscribe(hero=>{
          this.router.navigate(['/heroes/edit', hero.id]);
          this.showSnackbar(`${hero.superhero} insertado!`)
        })
      }
   }
  }

 onDeleteHero(){
  if (!this.currentHero.id) throw Error ("El id del Heroe es requerido");
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data:this.heroForm.value
  });
  dialogRef.afterClosed().subscribe(result =>{
     if (!result) return;
     this.heroesService.deleteHero(this.currentHero.id)
     .subscribe(wasDeleted=>{
      if (wasDeleted){
        this.router.navigate(['/heroes'])
      }
     });

  })
 }
  showSnackbar(message:string):void{
    this.snackbar.open(message, 'Realizado', {duration:2500})
  }
}

