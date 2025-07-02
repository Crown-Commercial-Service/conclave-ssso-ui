import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserDeactivateConfirmComponent } from './manage-user-deactivate-confirm.component';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageUserDeactivateConfirmComponent', () => {
  let component: ManageUserDeactivateConfirmComponent;
  let fixture: ComponentFixture<ManageUserDeactivateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserDeactivateConfirmComponent ],
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
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserDeactivateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
