import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EnvironmentBannerComponent } from './environment-banner.component';
import { environment } from 'src/environments/environment';

describe('EnvironmentBannerComponent', () => {
  let component: EnvironmentBannerComponent;
  let fixture: ComponentFixture<EnvironmentBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EnvironmentBannerComponent]
    });
    fixture = TestBed.createComponent(EnvironmentBannerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`environmentName has default value`, () => {
    expect(component.environmentName).toEqual(environment.uri.web.name);
  });
});
