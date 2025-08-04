import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-filters.html',
  styleUrl: './client-filters.css'
})
export class ClientFilters {
  countries = ['Brasil', 'Argentina', 'Portugal'];
  states = ['SP', 'RJ', 'MG', 'CE'];

  selectedCountry: string | null = null;
  selectedState: string | null = null;

  @Output() filterChanged = new EventEmitter<{ country: string | null; state: string | null }>();

  onFilterChange() {
    this.filterChanged.emit({
      country: this.selectedCountry,
      state: this.selectedState
    });
  }
}
