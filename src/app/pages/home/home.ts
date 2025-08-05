import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../services/shared/shared.modules';
import { Router } from '@angular/router';
import { userActions } from '../../store/user.actions';
import { Store } from '@ngrx/store';
import { userDetailsSelector, paginatedUsersSelector, usersLengthSelector } from '../../store/user.selectors';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { PaginatorState } from 'primeng/paginator';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-home',
  imports: [SharedModule, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private router = inject(Router)
  store = inject(Store)
  
  users$: Observable<User[]> = this.store.select(paginatedUsersSelector);
  usersLength$ = this.store.select(usersLengthSelector);
  loggedUser$: Observable<User | null> = this.store.select(userDetailsSelector)
  filters$ = this.store.select((state) => state.usersState.filters);

  constructor(public sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.store.dispatch(userActions.getUsers());

    const email = localStorage.getItem('email');
    console.log(email)
    if (email) {
      this.store.dispatch(userActions.getUserDetails({ email }));
    }
  }

  onFiltersChanged(filters: { country: any; state: any }) {
    this.store.dispatch(userActions.setFilters({ filters }));
  }

  createNew() {
    this.router.navigate(['/cadastro']);
  }

  editUser(user: User) {

  }

  deleteUser(user: User) {
    if (confirm(`Tem certeza que deseja remover o cliente ${user.name}?`)) {
      this.store.dispatch(userActions.deleteUser({ id: user.id }));
    }
  }

  onPageChange(event: PaginatorState) {
    const page = event.page ?? 0;
    const pageSize = event.rows ?? 6;

    this.store.dispatch(userActions.setPage({
      page: page as number,
      pageSize: pageSize as number
    }));
  }
  
  logout() {
    localStorage.clear()
    this.router.navigate(['login'])
  }
}
