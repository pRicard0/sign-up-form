import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { SidebarService } from '../../services/sidebar.service';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let sidebarService: jasmine.SpyObj<SidebarService>;

  beforeEach(async () => {
    const sidebarServiceSpy = jasmine.createSpyObj('SidebarService', ['toggle']);

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideRouter([]),
        { provide: SidebarService, useValue: sidebarServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sidebarService.toggle() when toggleSidebar is called', () => {
    component.toggleSidebar();
    expect(sidebarService.toggle).toHaveBeenCalled();
  });

  it('should have correct links', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.textContent).toContain('Home');
    expect(links[1].nativeElement.textContent).toContain('Novo Cliente');
  });

  it('should call toggleSidebar on button click', () => {
    const spy = spyOn(component, 'toggleSidebar');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click');
    expect(spy).toHaveBeenCalled();
  });
});
