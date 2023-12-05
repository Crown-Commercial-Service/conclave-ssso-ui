import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedAccessUserComponent } from './delegated-access-user.component';

describe('DelegatedAccessUserComponent', () => {
  let component: DelegatedAccessUserComponent;
  let fixture: ComponentFixture<DelegatedAccessUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedAccessUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedAccessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
