import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';
import { InputCpf } from "../../components/input-cpf/input-cpf";

@Component({
  selector: 'app-register',
  imports: [SharedModule, InputCpf],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  minTextCharSize = 3;
  maxTextCharSize = 120;
  registerForm!: FormGroup;

  constructor(private dep: ConstructorsService) {}

  ngOnInit() {
    this.registerForm = this.dep.fb.group(
      { 
        name: ['', [Validators.required, Validators.minLength(this.minTextCharSize), Validators.maxLength(this.maxTextCharSize)]],
        email: ['', [Validators.required, Validators.email]],
        cpf: ['', [Validators.required]]
      }
    )
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
    } else {
      console.log('Form is invalid', this.registerForm);
    }
  }
}