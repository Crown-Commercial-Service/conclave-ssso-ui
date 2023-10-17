import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DelegatedSuccessComponent } from './delegated-success.component';
import { Subscription, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedSuccessComponent', () => {
  let component: DelegatedSuccessComponent;
  let fixture: ComponentFixture<DelegatedSuccessComponent>;
  let mockActivatedRoute: any;
  let mockTitleService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({
        data: 'eyJ1c2VyTmFtZSI6ImFkbWluIn0=',
        status: 'create',
      }),
    };

    mockTitleService = {
      setTitle: jasmine.createSpy('setTitle'),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
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
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
