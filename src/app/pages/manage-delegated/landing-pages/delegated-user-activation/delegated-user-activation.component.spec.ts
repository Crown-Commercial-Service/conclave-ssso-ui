import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedUserActivationComponent } from './delegated-user-activation.component';

describe('DelegatedUserActivationComponent', () => {
  let component: DelegatedUserActivationComponent;
  let fixture: ComponentFixture<DelegatedUserActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedUserActivationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
