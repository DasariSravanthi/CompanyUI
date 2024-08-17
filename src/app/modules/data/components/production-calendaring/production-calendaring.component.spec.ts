import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCalendaringComponent } from './production-calendaring.component';

describe('ProductionCalendaringComponent', () => {
  let component: ProductionCalendaringComponent;
  let fixture: ComponentFixture<ProductionCalendaringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionCalendaringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCalendaringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
