import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedUserStatusComponent } from './delegated-user-status.component';

describe('DelegatedUserStatusComponent', () => {
  let component: DelegatedUserStatusComponent;
  let fixture: ComponentFixture<DelegatedUserStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedUserStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
