import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataMigrationStatusComponent } from './data-migration-status.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('DataMigrationStatusComponent (Template)', () => {
  let component: DataMigrationStatusComponent;
  let fixture: ComponentFixture<DataMigrationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(),RouterTestingModule],
      declarations: [DataMigrationStatusComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: { subscribe: () => {} } },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the correct breadcrumbs', () => {
    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbs[0].textContent).toContain('ADMINISTRATOR_DASHBOARD');
    expect(breadcrumbs[1].textContent).toContain('DATA_MIGRATION');
    expect(breadcrumbs[2].textContent).toContain('FILE_VALIDATION');
  });

  it('should display the correct heading', () => {
    const heading = fixture.nativeElement.querySelector('.govuk-heading-xl');
    expect(heading.textContent).toContain('FILE_VALIDATION_HEADING');
  });

  it('should display the correct description', () => {
    const description = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(description.textContent).toContain('FILE_VALIDATION_DES');
  });

  it('should have a "Return to Data Migration" link', () => {
    const link = fixture.nativeElement.querySelectorAll(
      '.navigation-text'
    );
    
    expect(link[0].textContent).toContain('Return to Data Migration');
  });

  it('should have a "Return to dashboard" link', () => {
    const link = fixture.nativeElement.querySelectorAll(
      '.navigation-text'
    );
    expect(link[1].textContent).toContain('Return to dashboard');
  });
});
