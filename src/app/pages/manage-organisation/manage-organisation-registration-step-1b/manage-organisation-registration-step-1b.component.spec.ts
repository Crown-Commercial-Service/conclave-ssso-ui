import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrgRegStep1BComponent } from './manage-organisation-registration-step-1b.component';

describe('ManageOrgRegStep1BComponent', () => {
  let component: ManageOrgRegStep1BComponent;
  let fixture: ComponentFixture<ManageOrgRegStep1BComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegStep1BComponent],
      imports: [RouterTestingModule, StoreModule.forRoot({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep1BComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to search route when continue button is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    const continueButton =
      fixture.nativeElement.querySelector('#continueButton');
    continueButton.click();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith('manage-org/register/search');
  });

  it('should navigate to previous step when back link is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    const backLink = fixture.nativeElement.querySelector('#backLink');
    backLink.click();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith('manage-org/register/buyer-type');
  });
});
