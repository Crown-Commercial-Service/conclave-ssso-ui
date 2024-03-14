import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageOrgRegBuyerTypeComponent } from './manage-organisation-registration-buyer-type.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegBuyerTypeComponent', () => {
  let component: ManageOrgRegBuyerTypeComponent;
  let fixture: ComponentFixture<ManageOrgRegBuyerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegBuyerTypeComponent],
      imports: [RouterTestingModule, FormsModule, TranslateModule.forRoot()],
      providers: [{ provide: Store, useFactory: () => ({}) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegBuyerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the defaultChoice to "Central Government"', () => {
    expect(component.defaultChoice).toEqual('Central Government');
  });

  it('should render the heading with the correct text', () => {
    const headingElement = fixture.debugElement.query(
      By.css('.govuk-heading-xl.page-title')
    );
    expect(headingElement.nativeElement.textContent).toContain(
      'What type of buyer are you?'
    );
  });

  it('should render the sub-heading with the correct text', () => {
    const subHeadingElement = fixture.debugElement.query(By.css('h2'));
    expect(subHeadingElement.nativeElement.textContent).toContain(
      'To help us sign you in as fast as possible'
    );
  });

  it('should call onSubmit method when the continue button is clicked', () => {
    spyOn(component, 'onSubmit');
    const continueButton = fixture.debugElement.query(
      By.css('#continueButton')
    );

    continueButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
