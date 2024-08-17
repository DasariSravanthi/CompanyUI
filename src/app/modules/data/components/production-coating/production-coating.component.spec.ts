import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCoatingComponent } from './production-coating.component';

describe('ProductionCoatingComponent', () => {
  let component: ProductionCoatingComponent;
  let fixture: ComponentFixture<ProductionCoatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionCoatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCoatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
