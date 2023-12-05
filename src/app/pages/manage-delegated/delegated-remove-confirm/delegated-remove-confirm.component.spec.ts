import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedRemoveConfirmComponent } from './delegated-remove-confirm.component';

describe('DelegatedRemoveConfirmComponent', () => {
  let component: DelegatedRemoveConfirmComponent;
  let fixture: ComponentFixture<DelegatedRemoveConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedRemoveConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedRemoveConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
