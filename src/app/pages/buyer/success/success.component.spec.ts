import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { BuyerSuccessComponent } from './success.component';

describe('BuyerSuccessComponent', () => {
  let component: BuyerSuccessComponent;
  let fixture: ComponentFixture<BuyerSuccessComponent>;

  beforeEach(() => {
    const storeStub = () => ({});
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BuyerSuccessComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub }
      ]
    });
    fixture = TestBed.createComponent(BuyerSuccessComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
