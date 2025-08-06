import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../services/shared/shared.modules';
import { Router } from '@angular/router';
import { userActions } from '../../store/user.actions';
import { Store } from '@ngrx/store';
import { userDetailsSelector, paginatedUsersSelector, usersLengthSelector } from '../../store/user.selectors';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { PaginatorState } from 'primeng/paginator';
import { SidebarService } from '../../services/sidebar.service';
import { URL } from '../../services/shared/strings';
import { filteredUsersSelector } from '../../store/country.selectors';

@Component({
  selector: 'app-home',
  imports: [SharedModule, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private router = inject(Router)
  store = inject(Store)
  sideBarService = inject(SidebarService)

  loggedEmail = localStorage.getItem('email');
  
  users$ = this.store.select(filteredUsersSelector).pipe(
    map(users => users.filter(user => user.email !== this.loggedEmail))
  );
  usersLength$ = this.store.select(usersLengthSelector);
  loggedUser$: Observable<User | null> = this.store.select(userDetailsSelector)
  filters$ = this.store.select((state) => state.usersState.filters);
  
  modalVisible = false;
  userToDelete: User | null = null;
  modalConfirmationText!: string

  editModalVisible = false;
  userToEdit: User | null = null;

  constructor(public sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.store.dispatch(userActions.getUsers());    

    const email = localStorage.getItem('email');
    if (email) {
      this.store.dispatch(userActions.getUserDetails({ email }));
    }
  }

  onFiltersChanged(filters: { country: Country | null; state: State | null }) {
    console.log("filtros:", filters);
    this.store.dispatch(userActions.setFilters({ filters }));
  }

  createNew() {
    this.router.navigate([URL.CADASTRO_URL]);
  }

  editUser(email: string) {
    this.sideBarService.close()
    this.router.navigate([`${URL.EDIT_URL}/${email}`]);
  }

  deleteUser(user: User) {
    this.userToDelete = user;
    this.modalVisible = true;

    this.modalConfirmationText = `Tem certeza que deseja excluir o cliente ${this.userToDelete?.name} ?`
  }

  onConfirmDelete() {
    if (this.userToDelete) {
      this.store.dispatch(userActions.deleteUser({ id: this.userToDelete.id }));
    }

    this.modalVisible = false;
    this.userToDelete = null;
  }

  onCancelDelete() {
    this.modalVisible = false;
    this.userToDelete = null;
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
    this.sideBarService.close()
    localStorage.clear()
    this.router.navigate(['login'])
  }
}