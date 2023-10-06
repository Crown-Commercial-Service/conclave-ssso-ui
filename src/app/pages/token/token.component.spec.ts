import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenComponent } from './token.component';
import { Store } from '@ngrx/store';
import { dataService } from 'src/app/services/data/data.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';

describe('TokenComponent', () => {
  let component: TokenComponent;
  let fixture: ComponentFixture<TokenComponent>;
  let mockDataService: jasmine.SpyObj<dataService>;
  let mockStore: jasmine.SpyObj<Store<UIState>>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('dataService', ['getData']);
    mockStore = jasmine.createSpyObj('Store', ['select']);

    await TestBed.configureTestingModule({
      declarations: [TokenComponent],
      providers: [
        { provide: dataService, useValue: mockDataService },
        { provide: Store, useValue: mockStore },
        ViewportScroller,
        ScrollHelper,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
