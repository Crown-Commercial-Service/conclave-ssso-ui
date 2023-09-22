import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperConfigurationService } from './wrapper-configuration.service';

describe('WrapperConfigurationService', () => {
  let component: WrapperConfigurationService;
  let fixture: ComponentFixture<WrapperConfigurationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperConfigurationService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperConfigurationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
