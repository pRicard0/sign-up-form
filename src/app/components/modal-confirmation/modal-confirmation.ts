import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-modal-confirmation',
  imports: [Dialog, ButtonModule],
  templateUrl: './modal-confirmation.html',
  styleUrl: './modal-confirmation.css'
})
export class ModalConfirmation {
  @Input() visible = false;

  @Input() title: string = 'Confirmar exclusão';
  @Input() description: string = 'Tem certeza que deseja excluir este cliente?';
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}

