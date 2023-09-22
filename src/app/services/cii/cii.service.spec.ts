import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ciiService } from './cii.service';

describe('ciiService', () => {
  let component: ciiService;
  let fixture: ComponentFixture<ciiService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ciiService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ciiService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
