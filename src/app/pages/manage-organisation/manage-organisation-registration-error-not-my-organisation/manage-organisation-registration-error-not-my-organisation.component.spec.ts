import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrgRegOrgNotFoundComponent } from './manage-organisation-registration-error-not-my-organisation.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageOrgRegOrgNotFoundComponent', () => {
  let component: ManageOrgRegOrgNotFoundComponent;
  let fixture: ComponentFixture<ManageOrgRegOrgNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegOrgNotFoundComponent],
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
