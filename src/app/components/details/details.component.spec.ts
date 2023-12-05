import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the detailsData in the template', () => {
    component.detailsData = 'This is the details data';
    fixture.detectChanges();
    const detailsTextElement = fixture.nativeElement.querySelector(
      '.govuk-details__text'
    );
    expect(detailsTextElement.textContent).toContain(
      'This is the details data'
    );
  });
});
