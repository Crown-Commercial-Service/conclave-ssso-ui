import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedUserConfirmComponent } from './delegated-user-confirm.component';

describe('DelegatedUserConfirmComponent', () => {
  let component: DelegatedUserConfirmComponent;
  let fixture: ComponentFixture<DelegatedUserConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedUserConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
