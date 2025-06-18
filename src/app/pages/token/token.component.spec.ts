import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TokenComponent } from './token.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('TokenComponent', () => {
  let component: TokenComponent;
  let fixture: ComponentFixture<TokenComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['select']);
    storeMock.select.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule],
      declarations: [TokenComponent],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the page title correctly', () => {
    const pageTitleElement = fixture.debugElement.query(
      By.css('.govuk-heading-xl.page-title')
    );
    expect(pageTitleElement.nativeElement.textContent).toContain('Token');
  });

  it('should display the sample data correctly', () => {
    component.sampleData = 'Token';
    component.ngOnInit();
    fixture.detectChanges();

    const sampleDataElement = fixture.debugElement.query(
      By.css('div.content.flex')
    );
    expect(sampleDataElement.nativeElement.textContent).toContain('Token');
  });
});
