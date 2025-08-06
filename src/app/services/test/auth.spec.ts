import { TestBed } from '@angular/core/testing';

import { AuthService } from '../auth.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RegisterPostData } from '../../interfaces/registerPostData';
import { User } from '../../interfaces/user';

const postData: RegisterPostData = {
  name: 'Jane',
  email: 'jane@example.com',
  country: 'Brasil',
  birthDate: new Date('1990-01-01'),
  state: 'SP',
  cpf: '12345678900',
  number: '11912345678',
  numberType: { name: 'Celular' }
};

const mockUsers: User[] = [
  {
    id: '1',
    ...postData
  },
];

describe('Auth', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          provideHttpClient(),
          provideHttpClientTesting() 
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    service.registerUser(postData).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush({ success: true });
  });

  it('should get all users', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Jane');
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get user by email', () => {
    const email = mockUsers[0].email;
    const mockUser: User = mockUsers[0]

    service.getUserByEmail(email).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/users?email=${email}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should get user details', () => {
    const email = mockUsers[0].email;
    const mockUser: User = mockUsers[0]

    service.getUserDetails(email).subscribe(users => {
      expect(users[0].email).toBe(email);
    });

    const req = httpMock.expectOne(`http://localhost:3000/users?email=${email}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should update a user', () => {
    const updatedUser: User = mockUsers[0]

    service.updateUser(updatedUser).subscribe(user => {
      expect(user.name).toBe(updatedUser.name);
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${updatedUser.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });


  it('should return null if user not found by email', () => {
    const email = 'notfound@example.com';

    service.getUserByEmail(email).subscribe(user => {
      expect(user).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/users?email=${email}`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should delete a user', () => {
    const userId = '1';

    service.deleteUser(userId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});