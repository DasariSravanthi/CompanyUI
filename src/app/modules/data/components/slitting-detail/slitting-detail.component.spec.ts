import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlittingDetailComponent } from './slitting-detail.component';

describe('SlittingDetailComponent', () => {
  let component: SlittingDetailComponent;
  let fixture: ComponentFixture<SlittingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlittingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlittingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
