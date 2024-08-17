import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSlittingComponent } from './production-slitting.component';

describe('ProductionSlittingComponent', () => {
  let component: ProductionSlittingComponent;
  let fixture: ComponentFixture<ProductionSlittingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionSlittingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSlittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
