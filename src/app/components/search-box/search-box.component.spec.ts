import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { FormsModule } from '@angular/forms';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(() => {
    const viewportScrollerStub = () => ({});
    const storeStub = () => ({});
    const scrollHelperStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SearchBoxComponent],
      providers: [
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: Store, useFactory: storeStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub }
      ]
    });
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
