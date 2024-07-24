import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../../types';

@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss'
})
export class EditPopupComponent {
  @Input() display: boolean = false;
  @Input() header!: string;

  @Input() product: Product = {
    productCategory: ''
  };

  @Output() confirm = new EventEmitter<Product>();
  @Output() displayChange = new EventEmitter<boolean>();

  onConfirm = () => {
    this.confirm.emit(this.product);
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel = () => {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
