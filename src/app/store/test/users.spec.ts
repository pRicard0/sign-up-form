import {
  usersSelector,
  userDetailsSelector,
  filtersSelector,
  paginatedUsersSelector,
  usersLengthSelector
} from '../user.selectors';

import { AppState } from '../app.state';
import { User } from '../../interfaces/user';
import { LoadStatus, userReducer, initialState, UserState } from '../user.reducer';
import { userActions } from '../user.actions';

describe('Users Store', () => {
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      country: 'Brasil',
      state: 'São Paulo',
      cpf: '12345678900',
      birthDate: new Date('1990-01-01'),
      number: '11999999999',
      numberType: { name: 'Celular' }
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      country: 'Argentina',
      state: 'Buenos Aires',
      cpf: '98765432100',
      birthDate: new Date('1985-01-01'),
      number: '11911111111',
      numberType: { name: 'Celular' }
    }
  ];

  const mockStates = [
    { id: 11, name: 'São Paulo' },
    { id: 12, name: 'Rio de Janeiro' },
    { id: 21, name: 'Buenos Aires' },
    { id: 22, name: 'Córdoba' }
  ];

  const mockState: AppState = {
    usersState: {
      users: mockUsers,
      loggedUser: mockUsers[0],
      error: null,
      status: LoadStatus.success,
      loggedUserStatus: LoadStatus.success,
      deleteUserStatus: LoadStatus.success,
      filters: {
        country: { id: 1, name: 'Brasil', states: mockStates },
        state: { id: 11, name: 'São Paulo' }
      },
      page: 0,
      pageSize: 10
    },
    countriesState: {
      countries: [], // você pode preencher se quiser
      states: mockStates,
      error: null,
      status: LoadStatus.success
    }
  };

  // --- Selectors tests ---

  it('should select all users', () => {
    const result = usersSelector(mockState);
    expect(result.length).toBe(2);
  });

  it('should select logged user details', () => {
    const result = userDetailsSelector(mockState);
    expect(result).toEqual(mockUsers[0]);
  });

  it('should select filters', () => {
    const result = filtersSelector(mockState);
    expect(result.country?.name).toBe('Brasil');
    expect(result.state?.name).toBe('São Paulo');
  });

  it('should return paginated filtered users', () => {
    const result = paginatedUsersSelector(mockState);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Alice');
  });

  it('should return correct count of filtered users', () => {
    const result = usersLengthSelector(mockState);
    expect(result).toBe(1);
  });

  // --- Reducer tests ---

  const mockUser: User = mockUsers[0];

  it('should return initial state', () => {
    const action = { type: 'unknown' } as any;
    const state = userReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('should set status to loading on getUsers action', () => {
    const action = userActions.getUsers();
    const state = userReducer(initialState, action);
    expect(state.status).toBe(LoadStatus.loading);
  });

  it('should load users on loadedUsers action', () => {
    const action = userActions.loadedUsers({ users: [mockUser] });
    const state = userReducer(initialState, action);
    expect(state.users).toEqual([mockUser]);
    expect(state.status).toBe(LoadStatus.success);
  });

  it('should set loggedUserStatus to loading on getUserDetails', () => {
    const action = userActions.getUserDetails({ email: 'alice@example.com' });
    const state = userReducer(initialState, action);
    expect(state.loggedUserStatus).toBe(LoadStatus.loading);
  });

  it('should load loggedUser on loadedUserDetails', () => {
    const action = userActions.loadedUserDetails({ user: mockUser });
    const state = userReducer(initialState, action);
    expect(state.loggedUser).toEqual(mockUser);
    expect(state.loggedUserStatus).toBe(LoadStatus.success);
  });

  it('should set deleteUserStatus to pending on deleteUser', () => {
    const action = userActions.deleteUser({ id: '1' });
    const state = userReducer(initialState, action);
    expect(state.deleteUserStatus).toBe(LoadStatus.pending);
  });

  it('should remove user on deleteUserSuccess', () => {
    const startState: UserState = {
      ...initialState,
      users: [mockUser, { ...mockUser, id: '2' }],
    };
    const action = userActions.deleteUserSuccess({ id: '1' });
    const state = userReducer(startState, action);
    expect(state.users.length).toBe(1);
    expect(state.users.find(u => u.id === '1')).toBeUndefined();
    expect(state.deleteUserStatus).toBe(LoadStatus.success);
  });

  it('should update filters on setFilters', () => {
    const filters = { country: { id: 1, name: 'Brasil', states: [] }, state: null };
    const action = userActions.setFilters({ filters });
    const state = userReducer(initialState, action);
    expect(state.filters).toEqual(filters);
  });

  it('should update pagination on setPage', () => {
    const action = userActions.setPage({ page: 2, pageSize: 20 });
    const state = userReducer(initialState, action);
    expect(state.page).toBe(2);
    expect(state.pageSize).toBe(20);
  });

});
