import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/Country.interfaces';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  });;

 public countriesByRegion:SmallCountry[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {

    this.onRegionChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {

    this.myForm.get('region')?.valueChanges
      .pipe(
        switchMap(region => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe(countries => {
        this.myForm.get('country')!.setValue("");
        this.countriesByRegion=countries;
      })
  }
}
function tap(arg0: () => string): import("rxjs").OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}

