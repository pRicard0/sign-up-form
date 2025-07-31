import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';

@Component({
  selector: 'app-register',
  imports: [SharedModule],
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
      { name: ['', [Validators.required, Validators.minLength(this.minTextCharSize), Validators.maxLength(this.maxTextCharSize)]],
        email: ['', [Validators.required, Validators.email]],
      }
    )
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
    } else {
      console.log('Form is invalid', this.registerForm.errors);
    }
  }
}