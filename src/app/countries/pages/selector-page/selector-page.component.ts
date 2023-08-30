import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/Country.interfaces';
import { Observable, filter, switchMap, tap } from 'rxjs';

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
    border: ['', Validators.required],
  });;

  public countriesByRegion: SmallCountry[] = [];
  public borders:SmallCountry[]=[];


  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {

    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {

    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.myForm.get('border')!.setValue('')),
        switchMap(region => this.countriesService.getCountriesByRegion(region)),
        )
        .subscribe(countries => {
          this.countriesByRegion = countries;
        })
      }

      onCountryChanged(): void {

        this.myForm.get('country')?.valueChanges
        .pipe(
          tap(() => this.myForm.get('border')!.setValue('')),
          filter( (value:string) =>value.length > 0),
          switchMap( (alphacode ) => this.countriesService.getCountryByAlphaCode(alphacode)),
          switchMap((country)=>this.countriesService.getCountryBorderByCodes(country.borders??[])),
      )
      .subscribe(countries=> {

        this.borders=countries;
      })
  }


}
