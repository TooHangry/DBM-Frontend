import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHomeModalComponent } from './add-home-modal.component';

describe('AddHomeModalComponent', () => {
  let component: AddHomeModalComponent;
  let fixture: ComponentFixture<AddHomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHomeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
