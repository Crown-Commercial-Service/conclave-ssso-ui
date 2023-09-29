import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BuyerConfirmComponent } from './confirm.component';

describe('BuyerConfirmComponent', () => {
  let component: BuyerConfirmComponent;
  let fixture: ComponentFixture<BuyerConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [BuyerConfirmComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the organization details', () => {
    component.organisation = {
      ciiOrganisationId: '123',
      rightToBuy: true,
    };
    fixture.detectChanges();

    const orgElement = fixture.nativeElement.querySelector('.content');
    expect(orgElement).toBeTruthy();
    expect(orgElement.textContent).toContain(
      'Review service roles for the organisation'
    );
  });

  it('should select "Yes" when organization is verified', () => {
    component.organisation = {
      ciiOrganisationId: '123',
      rightToBuy: true,
    };
    fixture.detectChanges();

    const isBuyerTrue = fixture.nativeElement.querySelector('#chkyes');
    const isBuyerFalse = fixture.nativeElement.querySelector('#chkno');

    expect(isBuyerTrue.checked).toBe(true);
    expect(isBuyerFalse.checked).toBe(false);
  });

  it('should select "No" when organization is not verified', () => {
    component.organisation = {
      ciiOrganisationId: '123',
      rightToBuy: false,
    };
    fixture.detectChanges();

    const isBuyerTrue = fixture.nativeElement.querySelector('#chkyes');
    const isBuyerFalse = fixture.nativeElement.querySelector('#chkno');

    expect(isBuyerTrue.checked).toBe(false);
    expect(isBuyerFalse.checked).toBe(true);
  });

  it('should call onSelect method when "Yes" is clicked', () => {
    spyOn(component, 'onSelect');
    const isBuyerTrue = fixture.nativeElement.querySelector('#chkyes');
    isBuyerTrue.click();
    fixture.detectChanges();

    expect(component.onSelect).toHaveBeenCalledWith(true);
  });

  it('should call onSelect method when "No" is clicked', () => {
    spyOn(component, 'onSelect');
    const isBuyerFalse = fixture.nativeElement.querySelector('#chkno');
    isBuyerFalse.click();
    fixture.detectChanges();

    expect(component.onSelect).toHaveBeenCalledWith(false);
  });
});
