import { Component } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-date-picker',
  imports: [DatePickerModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css'
})
export class DatePicker {

}
