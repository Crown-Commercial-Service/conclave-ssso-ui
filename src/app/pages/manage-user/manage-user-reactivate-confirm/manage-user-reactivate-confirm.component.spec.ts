import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserReactivateConfirmComponent } from './manage-user-reactivate-confirm.component';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageUserReactivateConfirmComponent', () => {
  let component: ManageUserReactivateConfirmComponent;
  let fixture: ComponentFixture<ManageUserReactivateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserReactivateConfirmComponent ],
      imports:[
        StoreModule.forRoot({}),
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserReactivateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
