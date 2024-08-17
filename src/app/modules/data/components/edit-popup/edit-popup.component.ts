import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss'
})
export class EditPopupComponent {
  @Input() display: boolean = false;
  @Input() header!: string;

  @Input() data: any = {};
  @Input() template!: string;

  @Output() confirm = new EventEmitter<any>();
  @Output() displayChange = new EventEmitter<boolean>();

  originalData: any = {};

  storeOriginalValue() {
    // Store the original value when the dialog is shown
    this.originalData = { ...this.data };
  }

  onConfirm = () => {
    this.confirm.emit(this.data);
    this.resetData(); // Reset data to empty after confirming
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel = () => {
    this.data = { ...this.originalData };
    this.display = false;
    this.displayChange.emit(this.display);
  }

  hasEmptyFields(): boolean {
    if (this.template === 'product') {
      return !this.data.productCategory;
    } else if (this.template === 'productDetail') {
      return !this.data.productId || !this.data.variant;
    } else if (this.template === 'supplier') {
      return !this.data.supplierName || !this.data.dues;
    } else if (this.template === 'size') {
      return !this.data.sizeInMM;
    } else if (this.template === 'productStock') {
      return !this.data.productDetailId || !this.data.weightInKgs;
    } else if (this.template === 'receipt') {
      return !this.data.receiptDate || !this.data.supplierId || !this.data.billNo || !this.data.billDate || !this.data.billValue;
    } else if (this.template === 'receiptDetail') {
      return !this.data.receiptId || !this.data.productStockId || !this.data.weight || !this.data.unitRate;
    } else if (this.template === 'rollNumber') {
      return !this.data.receiptDetailId || !this.data.rollNumberValue;
    } else if (this.template === 'issue') {
      return !this.data.issueDate || !this.data.productStockId || !this.data.weight;
    } else if (this.template === 'productionCoating') {
      return !this.data.productionCoatingDate || !this.data.issueId || !this.data.coatingStart || !this.data.coatingEnd || !this.data.averageSpeed || !this.data.averageTemperature || !this.data.gsmCoated || !this.data.rollCount;
    } else if (this.template === 'productionCalendaring') {
      return !this.data.productionCoatingDate || !this.data.productionCoatingId || !this.data.rollNumber || !this.data.beforeWeight || !this.data.beforeMoisture || !this.data.calendaringStart || !this.data.calendaringEnd|| !this.data.rollCount;
    } else if (this.template === 'productionSlitting') {
      return !this.data.productionCoatingDate || !this.data.productionCalendaringId || !this.data.rollNumber || !this.data.beforeWeight || !this.data.beforeMoisture || !this.data.slittingStart || !this.data.slittingEnd|| !this.data.rollCount;
    } else if (this.template === 'slittingDetail') {
      return !this.data.productionSlittingId || !this.data.rollNumber || !this.data.weight || !this.data.moisture;
    }
    return true;
  }

  resetData() {
    if (this.template === 'product') {
      this.data = {
        productCategory: ''
      };
    } else if (this.template === 'productDetail') {
      this.data = {
        productId: '',
        variant: ''
      };
    } else if (this.template === 'supplier') {
      this.data = {
        supplierName: '',
        dues: ''
      };
    } else if (this.template === 'size') {
      this.data = {
        sizeInMM: ''
      };
    } else if (this.template === 'productStock') {
      this.data = {
        productDetailId: '',
        gsm: '',
        sizeId: '',
        weightInKgs: '',
        rollCount: ''
      };
    } else if (this.template === 'receipt') {
      this.data = {
        receiptDate: '',
        supplierId: '',
        billNo: '',
        billDate: '',
        billValue: ''
      };
    } else if (this.template === 'receiptDetail') {
      this.data = {
        receiptId: '',
        productStockId: '',
        weight: '',
        unitRate: '',
        rollCount: ''
      };
    } else if (this.template === 'rollNumber') {
      this.data = {
        receiptDetailId: '',
        rollNumberValue: ''
      };
    } else if (this.template === 'issue') {
      this.data = {
        issueDate: '',
        rollNumberId: '',
        productStockId: '',
        rollNumber: '',
        weight: '',
        moisture: ''
      };
    } else if (this.template === 'productionCoating') {
      this.data = {
        productionCoatingDate: '',
        issueId: '',
        coatingStart: '',
        coatingEnd: '',
        averageSpeed: '',
        averageTemperature: '',
        gsmCoated: '',
        rollCount: ''
      };
    } else if (this.template === 'productionCalendaring') {
      this.data = {
        productionCoatingDate: '',
        productionCoatingId: '',
        rollNumber: '',
        beforeWeight: '',
        beforeMoisture: '',
        calendaringStart: '',
        calendaringEnd: '',
        rollCount: ''
      };
    } else if (this.template === 'productionSlitting') {
      this.data = {
        productionCoatingDate: '',
        productionCalendaringId: '',
        rollNumber: '',
        beforeWeight: '',
        beforeMoisture: '',
        slittingStart: '',
        slittingEnd: '',
        rollCount: ''
      };
    } else if (this.template === 'slittingDetail') {
      this.data = {
        productionSlittingId: '',
        rollNumber: '',
        weight: '',
        moisture: ''
      };
    }
  }
}
