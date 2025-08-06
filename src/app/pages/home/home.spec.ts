import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, StateObservable, ActionsSubject, ReducerManager, ReducerManagerDispatcher, StoreModule } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { userActions } from '../../store/user.actions';
import { URL } from '../../services/shared/strings';
import { User } from '../../interfaces/user';
import { SidebarService } from '../../services/sidebar.service';

const mockUsers: User[] = [
  {
    id: "123",
    name: 'Jane',
    email: 'jane@example.com',
    country: 'Brasil',
    birthDate: new Date('1990-01-01'),
    state: 'SP',
    cpf: '12345678900',
    number: '11912345678',
    numberType: { name: 'Celular' }
  }
]

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let store: Store;
  let router: Router;
  let dispatchSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let closeSpy: jasmine.Spy;
  let sidebarService: SidebarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Home,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideHttpClient(),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {}, queryParams: {} } }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    sidebarService = component.sideBarService;

    dispatchSpy = spyOn(store, 'dispatch');
    navigateSpy = spyOn(router, 'navigate');
    closeSpy = spyOn(sidebarService, 'close');

    fixture.detectChanges();
  });

  beforeEach(() => {
    dispatchSpy.calls.reset();
    navigateSpy.calls.reset();
    closeSpy.calls.reset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getUsers and getUserDetails on ngOnInit when email exists in localStorage', () => {
    const email = 'test@example.com';
    localStorage.setItem('email', email);
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(userActions.getUsers());
    expect(dispatchSpy).toHaveBeenCalledWith(userActions.getUserDetails({ email }));
  });

  it('should dispatch getUsers and not dispatch getUserDetails on ngOnInit when email does NOT exist in localStorage', () => {
    localStorage.removeItem('email');
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(userActions.getUsers());
    expect(dispatchSpy).not.toHaveBeenCalledWith(jasmine.objectContaining({ email: jasmine.any(String) }));
  });

  it('should dispatch setFilters action on onFiltersChanged', () => {
    const filters = {
      country: { name: 'Brasil' } as Country,
      state: { name: 'SP' } as State
    };
    component.onFiltersChanged(filters);
    expect(dispatchSpy).toHaveBeenCalledWith(userActions.setFilters({ filters }));
  });
  
  it('should navigate to cadastro page on createNew', () => {
    component.createNew();
    expect(navigateSpy).toHaveBeenCalledWith([URL.CADASTRO_URL]);
  });

  it('should close sidebar and navigate to edit page on editUser', () => {
    const email = 'user@example.com';
    component.editUser(email);

    expect(closeSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([`${URL.EDIT_URL}/${email}`]);
  });

  it('should dispatch deleteUser action and reset modal state on onConfirmDelete', () => {
    const mockUser = mockUsers[0]

    component.userToDelete = mockUser;
    component.modalVisible = true;
    component.onConfirmDelete();

    expect(dispatchSpy).toHaveBeenCalledWith(userActions.deleteUser({ id: mockUser.id }));
    expect(component.modalVisible).toBeFalse();
    expect(component.userToDelete).toBeNull();
  });

  it('should reset modal state on onCancelDelete', () => {
    component.modalVisible = true;
    component.userToDelete = { id: '1' } as any;

    component.onCancelDelete();

    expect(component.modalVisible).toBeFalse();
    expect(component.userToDelete).toBeNull();
  });

  it('should dispatch setPage action on onPageChange', () => {
    const event = {
      page: 2,
      rows: 10
    };

    component.onPageChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(userActions.setPage({ page: 2, pageSize: 10 }));
  });

  it('should dispatch setPage with default values if event page or rows are undefined', () => {
    component.onPageChange({} as any);
    expect(dispatchSpy).toHaveBeenCalledWith(userActions.setPage({ page: 0, pageSize: 6 }));
  });

  it('should close sidebar, clear localStorage and navigate to login on logout', () => {
    const localStorageClearSpy = spyOn(localStorage, 'clear').and.callThrough();

    component.logout();

    expect(closeSpy).toHaveBeenCalled();
    expect(localStorageClearSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });

  it('should set userToDelete, show modal and set confirmation text on deleteUser', () => {
    const user = mockUsers[0]
    component.deleteUser(user);

    expect(component.userToDelete).toBe(user);
    expect(component.modalVisible).toBeTrue();
    expect(component.modalConfirmationText).toBe(`Tem certeza que deseja excluir o cliente ${user.name} ?`);
  });
});
