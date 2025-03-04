import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { environment } from '../../../../../environments/environment.development';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { Product, ProductDetail, ProductStock, ReceiptDetail, Size, Supplier } from '../../../../../types';

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

  isProgrammer: boolean = false;

  popupForm!: FormGroup;

  private url = environment.apiUrl;

  products: any[] = []; // Array to store the fetched products
  productDetails: any[] = []; // Array to store the fetched product details
  sizes: any[] = []; // Array to store the fetched sizes
  suppliers: any[] = []; // Array to store the fetched suppliers
  filteredVariants: any[] = []; // Array to store the filtered list of variants based on the selected product category.
  selectedProductCategory: number | null = null; // productCategory based on the selected variant

  productStockOptions: any[] = []; // Array to hold dropdown options

  constructor(private fb: FormBuilder, private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit() {
    this.initializeForm();

    this.getAllProducts();
    this.getAllProductDetails();
    this.getAllSizes();
    this.getAllSuppliers();

    this.getAllProductStocks();
    
  }

  ngOnChanges() {
    if (this.popupForm) {
      this.popupForm.reset();
      this.popupForm.patchValue(this.data);

      // Clear and repopulate receiptDetails FormArray
      if (this.receiptDetails) {
        this.receiptDetails.clear();
      }
      if (this.data.receiptDetails && this.data.receiptDetails.length) {
        this.data.receiptDetails.forEach((detail: ReceiptDetail) => {
          this.receiptDetails.push(this.createReceiptDetail(detail));
        });
      }
    }
  }

  initializeForm() {
    if (this.template === 'product') {
      this.popupForm = this.fb.group({
        productCategory: ['', [Validators.required, CustomValidators.stringValidator(100)]]
      });
    } else if (this.template === 'productDetail') {
      this.popupForm = this.fb.group({
        productId: ['', [Validators.required]],
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
        productDetailId: ['', [Validators.required]],
        gsm: ['', [CustomValidators.tinyintValidator]],
        sizeId: [''],
        weightInKgs: ['', [Validators.required, CustomValidators.smallintValidator]],
        rollCount: ['', [CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'receipt') {
      this.popupForm = this.fb.group({
        receiptDate: ['', [Validators.required]],
        supplierId: ['', [Validators.required]],
        billNo: ['', [Validators.required, CustomValidators.alphanumericValidator(100)]],
        billDate: ['', [Validators.required]],
        billValue: ['', [Validators.required, CustomValidators.floatValidator]],
        receiptDetails: this.fb.array([]) // FormArray for receipt details
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
        issueDate: ['', [Validators.required]],
        rollNumberId: ['', [CustomValidators.integerValidator]],
        productStockId: ['', [Validators.required, CustomValidators.smallintValidator]],
        rollNumber: ['', [CustomValidators.alphanumericValidator(100)]],
        weight: ['', [Validators.required, CustomValidators.floatValidator]],
        moisture: ['', [CustomValidators.floatValidator]]
      });
    } else if (this.template === 'productionCoating') {
      this.popupForm = this.fb.group({
        productionCoatingDate: ['', [Validators.required]],
        issueId: ['', [Validators.required, CustomValidators.integerValidator]],
        coatingStart: ['', [Validators.required]],
        coatingEnd: ['', [Validators.required]],
        averageSpeed: ['', [Validators.required, CustomValidators.tinyintValidator]],
        averageTemperature: ['', [Validators.required, CustomValidators.tinyintValidator]],
        gsmCoated: ['', [Validators.required, CustomValidators.tinyintValidator]],
        rollCount: ['', [Validators.required, CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'productionCalendaring') {
      this.popupForm = this.fb.group({
        productionCoatingDate: ['', [Validators.required]],
        productionCoatingId: ['', [Validators.required, CustomValidators.integerValidator]],
        rollNumber: ['', [Validators.required, CustomValidators.alphanumericValidator()]],
        beforeWeight: ['', [Validators.required, CustomValidators.floatValidator]],
        beforeMoisture: ['', [Validators.required, CustomValidators.floatValidator]],
        calendaringStart: ['', [Validators.required]],
        calendaringEnd: ['', [Validators.required]],
        rollCount: ['', [Validators.required, CustomValidators.tinyintValidator]]
      });
    } else if (this.template === 'productionSlitting') {
      this.popupForm = this.fb.group({
        productionCoatingDate: ['', [Validators.required]],
        productionCalendaringId: ['', [Validators.required, CustomValidators.integerValidator]],
        rollNumber: ['', [Validators.required, CustomValidators.alphanumericValidator()]],
        beforeWeight: ['', [Validators.required, CustomValidators.floatValidator]],
        beforeMoisture: ['', [Validators.required, CustomValidators.floatValidator]],
        slittingStart: ['', [Validators.required]],
        slittingEnd: ['', [Validators.required]],
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

    this.setupValueChangeListeners();
  }

  // Getter for receiptDetails FormArray
  get receiptDetails(): FormArray {
    return this.popupForm.get('receiptDetails') as FormArray;
  }

  // Method to create a new receipt detail form group
  createReceiptDetail(detail: ReceiptDetail): FormGroup {
    return this.fb.group({
      receiptDetailId: [detail.receiptDetailId || null], // Include receiptDetailId
      productStockId: [detail.productStockId || 0, [Validators.required, CustomValidators.smallintValidator]],
      weight: [detail.weight || 0, [Validators.required, CustomValidators.floatValidator]],
      unitRate: [detail.unitRate || 0, [Validators.required, CustomValidators.floatValidator]],
      rollCount: [detail.rollCount || 0, [CustomValidators.tinyintValidator]]
    });
  }

  getAllProducts() {
    // Clear messages before making this API call
    this.messageService.clear();

    this.apiService.get<Product[]>(`${this.url}/Product/allProducts`).subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  getAllProductDetails() {
    this.messageService.clear();

    this.apiService.get<ProductDetail[]>(`${this.url}/ProductDetail/allProductDetails`).subscribe({
      next: (productDetails: ProductDetail[]) => {
        this.productDetails = productDetails;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  getAllSizes() {
    this.messageService.clear();

    this.apiService.get<Size[]>(`${this.url}/Size/allSizes`).subscribe({
      next: (sizes: Size[]) => {
        this.sizes = sizes;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  getAllSuppliers() {
    this.messageService.clear();

    this.apiService.get<Supplier[]>(`${this.url}/Supplier/allSuppliers`).subscribe({
      next: (suppliers: Supplier[]) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  getAllProductStocks() {
    this.messageService.clear();

    this.apiService.get<ProductStock[]>(`${this.url}/ProductStock/allProductStocks`).subscribe({
      next: (productStocks: ProductStock[]) => {
        this.productStockOptions = productStocks;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  onProductCategoryChange(selectedProductId: number) {
    this.filteredVariants = this.productDetails.filter(
        detail => detail.productId === selectedProductId
    );
  }

  onEditPopupOpen() {
    if (this.template === 'productStock') {
      const selectedVariantId = this.popupForm.get('productDetailId')?.value;
      this.selectedProductCategory = null; // Reset product category
      this.filteredVariants = []; // Clear the variants 

      if (selectedVariantId) {
        const selectedVariant = this.productDetails.find(
          detail => detail.productDetailId === selectedVariantId
        );
      
        if (selectedVariant) {
            const correspondingProduct = this.products.find(
              product => product.productId === selectedVariant.productId
            );

            if (correspondingProduct) {
                this.selectedProductCategory = correspondingProduct.productId;
                this.filteredVariants = this.productDetails.filter(
                  detail => detail.productId === correspondingProduct.productId
                );
            }
        }
      }
    }
  }

  // Handle product stock selection change
  onProductStockChange(index: number) {
    const detail = this.receiptDetails.at(index) as FormGroup;
    const selectedStockId = this.receiptDetails.at(index).get('productStockId')?.value;

    const selectedStock = this.productStockOptions.find(
      stock => stock.productStockId === selectedStockId
    );

    if (selectedStock) {
      // Auto-fill the fields based on the selected stock
      detail.patchValue({
        weight: selectedStock.weightInKgs,
        rollCount: selectedStock.rollCount
      });
    }
  }

  // Add a new empty row to the receipt details
  addReceiptDetail() {
    this.receiptDetails.push(this.createReceiptDetail({ receiptId: 0, productStockId: 0, weight: 0, unitRate: 0, rollCount: 0 }));
  }

  // Remove a specific receipt detail row
  removeReceiptDetail(index: number) {
    this.receiptDetails.removeAt(index);
  }

  // Calculate bill value for each receipt
  calculateBillValue() {
    const totalBill = this.receiptDetails.value.reduce((sum: number, receiptDetail: ReceiptDetail) => sum + ((receiptDetail.weight || 0) * (receiptDetail.unitRate || 0)), 0);
    const roundedBill = Math.round(totalBill * 100) / 100; // Round to 2 decimal places
    this.popupForm.get('billValue')?.setValue((roundedBill > 0) ? roundedBill : null);
  }

  setupValueChangeListeners() {
    this.popupForm.get('receiptDate')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedDate = this.formatDate(value);
        this.popupForm.get('receiptDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.popupForm.get('billDate')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedDate = this.formatDate(value);
        this.popupForm.get('billDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.popupForm.get('issueDate')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedDate = this.formatDate(value);
        this.popupForm.get('issueDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.popupForm.get('productionCoatingDate')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedDate = this.formatDate(value);
        this.popupForm.get('productionCoatingDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.popupForm.get('coatingStart')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedTime = this.formatTime(value);
        this.popupForm.get('coatingStart')?.setValue(formattedTime, { emitEvent: false });
      }
    });

    this.popupForm.get('coatingEnd')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedTime = this.formatTime(value);
        this.popupForm.get('coatingEnd')?.setValue(formattedTime, { emitEvent: false });
      }
    });

    this.popupForm.get('calendaringStart')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedTime = this.formatTime(value);
        this.popupForm.get('calendringStart')?.setValue(formattedTime, { emitEvent: false });
      }
    });

    this.popupForm.get('calendaringEnd')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedTime = this.formatTime(value);
        this.popupForm.get('calendaringEnd')?.setValue(formattedTime, { emitEvent: false });
      }
    });
  
    this.popupForm.get('slittingStart')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedTime = this.formatTime(value);
        this.popupForm.get('slittingStart')?.setValue(formattedTime, { emitEvent: false });
      }
    });
  
    this.popupForm.get('slittingEnd')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const formattedTime = this.formatTime(value);
        this.popupForm.get('slittingEnd')?.setValue(formattedTime, { emitEvent: false });
      }
    });

    this.popupForm.get('receiptDetails')?.valueChanges.subscribe(() => {
      this.calculateBillValue();
    });    
  }
  
  // Helper function to format date
  formatDate(date: Date): string { 
    return date.toLocaleDateString('en-CA', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit' 
            }); // "yyyy-MM-dd" format
  }
  
  // Helper function to format time
  formatTime(time: Date): string {
    return time.toTimeString().split(' ')[0].substring(0, 5); // "HH:mm" format
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
