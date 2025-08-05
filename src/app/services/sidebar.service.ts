import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private isOpenSignal = signal(false);

  isOpen = computed(() => this.isOpenSignal());

  toggle() {
    this.isOpenSignal.update(open => !open);
  }

  open() {
    this.isOpenSignal.set(true);
  }

  close() {
    this.isOpenSignal.set(false);
  }
}