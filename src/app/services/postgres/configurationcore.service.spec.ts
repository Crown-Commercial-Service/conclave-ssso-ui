import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationCore } from './configurationcore.service';

describe('ConfigurationCore', () => {
  let component: ConfigurationCore;
  let fixture: ComponentFixture<ConfigurationCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationCore ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
