import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFilters } from './client-filters';

describe('ClientFilters', () => {
  let component: ClientFilters;
  let fixture: ComponentFixture<ClientFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
