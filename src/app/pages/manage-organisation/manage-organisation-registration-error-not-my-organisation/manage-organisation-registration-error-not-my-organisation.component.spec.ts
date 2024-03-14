import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrgRegOrgNotFoundComponent } from './manage-organisation-registration-error-not-my-organisation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegOrgNotFoundComponent', () => {
  let component: ManageOrgRegOrgNotFoundComponent;
  let fixture: ComponentFixture<ManageOrgRegOrgNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegOrgNotFoundComponent],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegOrgNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/manage-org/register/search" on button click', () => {
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(routerSpy).toHaveBeenCalledWith('/manage-org/register/search');
  });
});
