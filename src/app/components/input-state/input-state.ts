import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-input-state',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule],
  templateUrl: './input-state.html',
  styleUrl: './input-state.css'
})
export class InputState {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() required!: boolean;
  @Input() states: State[] = [];
  filteredStates: State[] = [];

  private countryService = inject(CountryService);

  ngOnInit() {
    this.formGroup.get('country')?.valueChanges.subscribe(country => {
      const countryId = (country && typeof country === 'object') ? country.id : null;

      if (countryId) {
        this.countryService.getStatesByCountryId(countryId).subscribe(states => {
          this.states = states;
        });
      } else {
        this.states = [];
      }
    });
  }

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }

  filterState(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredStates = this.states.filter(
      state => state.name.toLowerCase().startsWith(query)
    );
  }

  get isInvalid(): string | null {
    const control = this.control;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Campo obrigatório';
      if (control.hasError('invalidState')) return 'Estado inválido';
    }
    return null;
  }
}