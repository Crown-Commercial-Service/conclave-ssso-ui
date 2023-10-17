import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrgSupportSearchComponent } from './search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TokenService } from 'src/app/services/auth/token.service';
import { Store } from '@ngrx/store';

describe('OrgSupportSearchComponent', () => {
  let component: OrgSupportSearchComponent;
  let fixture: ComponentFixture<OrgSupportSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      declarations: [OrgSupportSearchComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        TokenService,
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formGroup with search field', () => {
    expect(component.formGroup.get('search')).toBeTruthy();
  });

  it('should display "no matching results" message when data is empty', () => {
    component.data = {
      currentPage: 1,
      pageCount: 0,
      rowCount: 0,
      orgUserList: [],
    };
    fixture.detectChanges();
    const noResultsMessage = fixture.nativeElement.querySelector('.govuk-body');
    expect(noResultsMessage.textContent).toContain(
      'There are no matching results.'
    );
  });
});
