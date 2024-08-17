import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollNumberComponent } from './roll-number.component';

describe('RollNumberComponent', () => {
  let component: RollNumberComponent;
  let fixture: ComponentFixture<RollNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RollNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
