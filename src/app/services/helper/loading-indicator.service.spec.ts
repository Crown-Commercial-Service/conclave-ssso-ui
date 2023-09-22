import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIndicatorService } from './loading-indicator.service';

describe('LoadingIndicatorService', () => {
  let component: LoadingIndicatorService;
  let fixture: ComponentFixture<LoadingIndicatorService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingIndicatorService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingIndicatorService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
