import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedErrorComponent } from './delegated-error.component';

describe('DelegatedErrorComponent', () => {
  let component: DelegatedErrorComponent;
  let fixture: ComponentFixture<DelegatedErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
