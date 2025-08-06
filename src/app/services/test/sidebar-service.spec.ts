import { TestBed } from '@angular/core/testing';
import { SidebarService } from '../sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be initially closed', () => {
    expect(service.isOpen()).toBeFalse();
  });

  it('should open the sidebar', () => {
    service.open();
    expect(service.isOpen()).toBeTrue();
  });

  it('should close the sidebar', () => {
    service.open();
    service.close();
    expect(service.isOpen()).toBeFalse();
  });

  it('should toggle the sidebar', () => {
    expect(service.isOpen()).toBeFalse();

    service.toggle();
    expect(service.isOpen()).toBeTrue();

    service.toggle();
    expect(service.isOpen()).toBeFalse();
  });
});
