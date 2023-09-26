import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegatedSuccessComponent } from './delegated-success.component';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('DelegatedSuccessComponent', () => {
  let component: DelegatedSuccessComponent;
  let fixture: ComponentFixture<DelegatedSuccessComponent>;
  let mockActivatedRoute: any;
  let mockTitleService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({
        data: 'base64-encoded-data',
      }),
    };

    mockTitleService = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      declarations: [DelegatedSuccessComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Title, useValue: mockTitleService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title when status is "create"', () => {
    const mockData = {
      userName: 'John Doe',
      status: 'create',
    };
    const base64EncodedData = btoa(JSON.stringify(mockData));
    spyOn(window, 'atob').and.returnValue(base64EncodedData);
    spyOn(window, 'decodeURIComponent').and.returnValue('John Doe');
    spyOn(window, 'unescape').and.returnValue('John Doe');

    component.ngOnInit();

    expect(mockTitleService.setTitle).toHaveBeenCalledWith(
      'Delegated user successfully added - CCS'
    );
  });
});
