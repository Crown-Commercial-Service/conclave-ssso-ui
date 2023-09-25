import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CIIOptions } from './cii-options.component';

describe('CIIOptions', () => {
  let component: CIIOptions;
  let fixture: ComponentFixture<CIIOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CIIOptions ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CIIOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
