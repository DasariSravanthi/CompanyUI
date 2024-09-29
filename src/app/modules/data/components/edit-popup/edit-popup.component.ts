import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';

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

  popupForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    if (this.popupForm) {
      this.popupForm.reset();
      this.popupForm.patchValue(this.data);
    }
  }

  initializeForm() {
    if (this.template === 'product') {
      this.popupForm = this.fb.group({
        productCategory: ['', [Validators.required, CustomValidators.stringValidator(100)]]
      });
    } else if (this.template === 'productDetail') {
      this.popupForm = this.fb.group({
        productId: ['', [Validators.required, CustomValidators.tinyintValidator]],
        variant: ['', [Validators.required, CustomValidators.stringValidator(100)]]
      });
    } else if (this.template === 'supplier') {
      this.popupForm = this.fb.group({
        supplierName: ['', [Validators.required, CustomValidators.stringValidator(100)]],
        dues: ['', [Validators.required, CustomValidators.floatValidator]]
      });
    } else if (this.template === 'size') {
      this.popupForm = this.fb.group({
        sizeInMM: ['', [Validators.required, CustomValidators.smallintValidator]]
      });
    } else if (this.template === 'productStock') {
      this.popupForm = this.fb.group({
        productDetailId: ['', [Validators.required, CustomValidators.tinyintValidator]],
        gsm: ['', [CustomValidators.tinyintValidator]],
        sizeId: ['', [CustomValidators.tinyintValidator]],
        weightInKgs: ['', [Validators.required, CustomValidators.smallintValidator]],
        rollCount: ['', [CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'receipt') {
      this.popupForm = this.fb.group({
        receiptDate: ['', [Validators.required, CustomValidators.dateValidator]],
        supplierId: ['', [Validators.required, CustomValidators.tinyintValidator]],
        billNo: ['', [Validators.required, CustomValidators.alphanumericValidator(100)]],
        billDate: ['', [Validators.required, CustomValidators.dateValidator]],
        billValue: ['', [Validators.required, CustomValidators.floatValidator]]
      });
    } else if (this.template === 'receiptDetail') {
      this.popupForm = this.fb.group({
        receiptId: ['', [Validators.required, CustomValidators.integerValidator]],
        productStockId: ['', [Validators.required, CustomValidators.smallintValidator]],
        weight: ['', [Validators.required, CustomValidators.floatValidator]],
        unitRate: ['', [Validators.required, CustomValidators.floatValidator]],
        rollCount: ['', [CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'rollNumber') {
      this.popupForm = this.fb.group({
        receiptDetailId: ['', [Validators.required, CustomValidators.integerValidator]],
        rollNumberValue: ['', [Validators.required, CustomValidators.alphanumericValidator(100)]]
      });
    } else if (this.template === 'issue') {
      this.popupForm = this.fb.group({
        issueDate: ['', [Validators.required, CustomValidators.dateValidator]],
        rollNumberId: ['', [CustomValidators.integerValidator]],
        productStockId: ['', [Validators.required, CustomValidators.smallintValidator]],
        rollNumber: ['', [CustomValidators.alphanumericValidator(100)]],
        weight: ['', [Validators.required, CustomValidators.floatValidator]],
        moisture: ['', [CustomValidators.floatValidator]]
      });
    } else if (this.template === 'productionCoating') {
      this.popupForm = this.fb.group({
        productionCoatingDate: ['', [Validators.required, CustomValidators.dateValidator]],
        issueId: ['', [Validators.required, CustomValidators.integerValidator]],
        coatingStart: ['', [Validators.required, CustomValidators.timeValidator]],
        coatingEnd: ['', [Validators.required, CustomValidators.timeValidator]],
        averageSpeed: ['', [Validators.required, CustomValidators.tinyintValidator]],
        averageTemperature: ['', [Validators.required, CustomValidators.tinyintValidator]],
        gsmCoated: ['', [Validators.required, CustomValidators.tinyintValidator]],
        rollCount: ['', [Validators.required, CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'productionCalendaring') {
      this.popupForm = this.fb.group({
        productionCoatingDate: ['', [Validators.required, CustomValidators.dateValidator]],
        productionCoatingId: ['', [Validators.required, CustomValidators.integerValidator]],
        rollNumber: ['', [Validators.required, CustomValidators.alphanumericValidator()]],
        beforeWeight: ['', [Validators.required, CustomValidators.floatValidator]],
        beforeMoisture: ['', [Validators.required, CustomValidators.floatValidator]],
        calendaringStart: ['', [Validators.required, CustomValidators.timeValidator]],
        calendaringEnd: ['', [Validators.required, CustomValidators.timeValidator]],
        rollCount: ['', [Validators.required, CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'productionSlitting') {
      this.popupForm = this.fb.group({
        productionCoatingDate: ['', [Validators.required, CustomValidators.dateValidator]],
        productionCalendaringId: ['', [Validators.required, CustomValidators.integerValidator]],
        rollNumber: ['', [Validators.required, CustomValidators.alphanumericValidator()]],
        beforeWeight: ['', [Validators.required, CustomValidators.floatValidator]],
        beforeMoisture: ['', [Validators.required, CustomValidators.floatValidator]],
        slittingStart: ['', [Validators.required, CustomValidators.timeValidator]],
        slittingEnd: ['', [Validators.required, CustomValidators.timeValidator]],
        rollCount: ['', [Validators.required, CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'slittingDetail') {
      this.popupForm = this.fb.group({
        productionSlittingId: ['', [Validators.required, CustomValidators.integerValidator]],
        rollNumber: ['', [Validators.required, CustomValidators.alphanumericValidator()]],
        weight: ['', [Validators.required, CustomValidators.floatValidator]],
        moisture: ['', [Validators.required, CustomValidators.floatValidator]]
      });
    }
  }

  onConfirm = () => {
    this.confirm.emit(this.popupForm.value);
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel = () => {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
