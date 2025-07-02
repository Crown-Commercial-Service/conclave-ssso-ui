import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrgSupportSearchComponent } from './search.component';
import { TokenService } from 'src/app/services/auth/token.service';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('OrgSupportSearchComponent', () => {
  let component: OrgSupportSearchComponent;
  let fixture: ComponentFixture<OrgSupportSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [OrgSupportSearchComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
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
      schemas: [NO_ERRORS_SCHEMA]
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
