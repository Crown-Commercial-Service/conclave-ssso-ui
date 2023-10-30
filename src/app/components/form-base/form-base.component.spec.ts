import { TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FormBaseComponent } from './form-base.component';

describe('FormBaseComponent', () => {
  let service: FormBaseComponent;

  beforeEach(() => {
    const viewportScrollerStub = () => ({ setOffset: (array: any) => ({}) });
    const formGroupStub = () => ({
      value: {},
      valueChanges: { subscribe: (f: any) => f({}) }
    });
    TestBed.configureTestingModule({
      providers: [
        FormBaseComponent,
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: FormGroup, useFactory: formGroupStub }
      ]
    });
    service = TestBed.inject(FormBaseComponent);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it(`formChanged has default value`, () => {
    expect(service.formChanged).toEqual(false);
  });
});
