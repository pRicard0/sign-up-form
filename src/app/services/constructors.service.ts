import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class ConstructorsService {
  constructor(
    public fb: FormBuilder,
    public router: Router,
  ) {}
}