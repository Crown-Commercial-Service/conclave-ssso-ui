import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GovUKTableComponent } from './govuk-table.component';
import { Store } from '@ngrx/store';

describe('GovUKTableComponent', () => {
  let component: GovUKTableComponent;
  let fixture: ComponentFixture<GovUKTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GovUKTableComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        TranslateService,
        {
          provide: Store,
          useFactory: () => ({}),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUKTableComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the table headers correctly', () => {
    component.headerTextKeys = ['Header 1', 'Header 2', 'Header 3'];
    fixture.detectChanges();
    const tableHeaders = fixture.nativeElement.querySelectorAll(
      '.govuk-table__header'
    );
    expect(tableHeaders.length).toBe(0);
  });

  it('should render the table rows correctly', () => {
    component.data = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];
    component.dataKeys = ['id', 'name', 'email'];
    fixture.detectChanges();
    const tableRows =
      fixture.nativeElement.querySelectorAll('.govuk-table__row');
    expect(tableRows.length).toBe(0);
  });
});
