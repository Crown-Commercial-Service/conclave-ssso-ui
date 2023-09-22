import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollHelper } from './scroll-helper.services';

describe('ScrollHelper', () => {
  let component: ScrollHelper;
  let fixture: ComponentFixture<ScrollHelper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollHelper ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollHelper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
