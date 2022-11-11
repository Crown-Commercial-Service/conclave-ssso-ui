import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedSuccessComponent } from './delegated-success.component';

describe('DelegatedSuccessComponent', () => {
  let component: DelegatedSuccessComponent;
  let fixture: ComponentFixture<DelegatedSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
