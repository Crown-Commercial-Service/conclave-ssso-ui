import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewportScroller } from '@angular/common';
import { TermsConditionsComponent } from './terms-conditions.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TermsConditionsComponent', () => {
  let component: TermsConditionsComponent;
  let fixture: ComponentFixture<TermsConditionsComponent>;
  let localStore: any = {
    user_name: 'test name',
    isOrgAdmin: JSON.stringify(true),
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [TermsConditionsComponent],
      providers: [ViewportScroller],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.userName).toEqual('qbpq kxjb');
    expect(component.isOrgAdmin).toBeTrue();
  });
});
